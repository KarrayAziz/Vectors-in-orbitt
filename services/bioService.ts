import { GoogleGenAI } from "@google/genai";
import { BioResult, SearchParams, AIAnalysis } from '../types';
import { MOCK_RESULTS } from '../constants';

// In a real deployment, this would call the FastAPI endpoints
// defined in the backend/ folder.

export const searchBioVector = async (params: SearchParams): Promise<BioResult[]> => {
  // SIMULATION: Simulate network latency and Qdrant filtering
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));

  // Filter logic simulating Qdrant payload filtering
  let results = MOCK_RESULTS.filter(r => {
    // Simulate Semantic Search simply by checking if text includes keywords from query (very basic mock)
    // In reality, Python backend does vector dot product.
    // For demo purposes, we return everything if query is empty, or filter slightly.
    if (!params.query) return true;
    const q = params.query.toLowerCase().split(' ');
    const text = (r.chunk.text + r.source.title).toLowerCase();
    return q.some(word => text.includes(word));
  });

  // Filter by Delta G
  if (params.minDeltaG) {
    results = results.filter(r => (r.deltaG || 0) <= params.minDeltaG);
  }

  // Simulate MMR (Diversity) - In a real app, Qdrant handles this.
  // We'll just shuffle slightly if diversity is high.
  if (params.diversity > 0.7) {
    results = results.sort(() => Math.random() - 0.5);
  } else {
    results = results.sort((a, b) => b.score - a.score);
  }

  return results;
};

// Use Gemini to generate actionable next steps
export const analyzeResultWithGemini = async (
  result: BioResult, 
  apiKey: string | undefined
): Promise<AIAnalysis> => {
  
  if (!apiKey) {
    // Fallback if no key provided
    return {
      summary: "API Key required for live GenAI analysis. Using cached static analysis.",
      nextSteps: [
        "Validate binding affinity via Surface Plasmon Resonance (SPR).",
        "Perform site-directed mutagenesis on interacting residues.",
        "Run Molecular Dynamics (MD) simulation for 100ns."
      ],
      riskLevel: 'Low'
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = ai.models.getGenerativeModel({ 
        model: 'gemini-3-flash-preview',
        systemInstruction: "You are a senior bioinformatics research assistant. Analyze the provided biological chunk and metadata to suggest concrete, actionable wet-lab or in-silico next steps."
    });

    const prompt = `
      Context: A researcher is investigating this biological entity.
      Title: ${result.source.title}
      Text Chunk: ${result.chunk.text}
      Delta G: ${result.deltaG} kcal/mol
      Type: ${result.type}

      Provide a JSON response with:
      1. A 1-sentence summary.
      2. 3 specific actionable next steps (experimental or computational).
      3. Risk level (Low/Medium/High) of pursuing this target based on thermodynamic stability.
    `;

    // We ask for JSON for structured integration
    const response = await model.generateContent({
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const json = JSON.parse(text);
    return {
      summary: json.summary || json['1-sentence summary'],
      nextSteps: json.nextSteps || json['3 specific actionable next steps'] || [],
      riskLevel: json.riskLevel || 'Medium'
    };

  } catch (error) {
    console.error("Gemini Error:", error);
    return {
        summary: "Error generating analysis.",
        nextSteps: ["Check console logs", "Verify API Key"],
        riskLevel: 'High'
    };
  }
};