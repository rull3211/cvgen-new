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

# Install pnpm globally
RUN npm install -g pnpm@10.25.0

# Set working directory
WORKDIR /app

# Copy workspace configuration and lock file from root
COPY pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY pnpm-lock.yaml ./pnpm-lock.yaml

# Copy package.json files (root and backend)
COPY package.json ./package.json
COPY packages/backend/package.json ./packages/backend/package.json

# Install dependencies using pnpm (only backend + its deps)
RUN pnpm install --filter @cvgen/backend --prod --frozen-lockfile

# Copy backend server file
COPY packages/backend/server.cjs ./packages/backend/server.cjs

# Set working directory to backend package
WORKDIR /app/packages/backend

# Switch back to Puppeteer's expected non-root user
USER pptruser

# Environment setup
ENV NODE_ENV=production
ENV PORT=8080
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

# Expose Cloud Run port
EXPOSE 8080

# Start Node server
CMD ["node", "server.cjs"]
