# Base image with Node + Puppeteer preinstalled
FROM ghcr.io/puppeteer/puppeteer:23.4.0

# Switch to root to install missing dependencies
USER root

# Install system libraries Puppeteer needs
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
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# --- Add Chrome installation explicitly ---
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" \
        > /etc/apt/sources.list.d/google-chrome.list && \
    apt-get update && apt-get install -y google-chrome-stable && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy dependency manifests first (for caching)
COPY package*.json ./

# Install production dependencies
RUN npm ci

# Copy all project files
COPY . .

# Build frontend (Vite)
RUN npm run build

# Switch back to Puppeteer’s expected non-root user
USER pptruser

# Environment setup
ENV NODE_ENV=production
ENV PORT=8080
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

# Expose Cloud Run port
EXPOSE 8080

# Start your Node server
CMD ["node", "src/server.cjs"]