FROM node:20

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Vite default dev port
EXPOSE 3000

# --host allows access from localhost / other devices
CMD ["npm", "run", "dev", "--", "--host"]
