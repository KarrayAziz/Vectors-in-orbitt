FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install minimal system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies with extended timeout
RUN pip install --default-timeout=1000 --no-cache-dir -r requirements.txt

# Set FastEmbed cache directory (persisted in image) and create it
ENV FASTEMBED_CACHE_DIR=/app/.fastembed_cache
RUN mkdir -p $FASTEMBED_CACHE_DIR && chown -R nobody:nogroup $FASTEMBED_CACHE_DIR

# Pre-download the ONNX embedding model into the cache during build to avoid runtime download issues
RUN python - <<'PY'
from fastembed import TextEmbedding
TextEmbedding(model_name='BAAI/bge-small-en-v1.5')
print('Downloaded FastEmbed model into cache')
PY

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/docs || exit 1

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
