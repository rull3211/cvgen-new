# Use official Node LTS image
FROM node:20-slim

# Install fonts and dependencies for headless Chrome (Puppeteer)
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    fonts-noto-color-emoji \
    libnss3 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libxshmfence1 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# Build Vite frontend if needed
RUN npm run build || echo "Skipping frontend build"

# Expose port 8080 (Cloud Run expects this)
ENV PORT=8080

# Start the server
CMD ["node", "src/server.cjs"]