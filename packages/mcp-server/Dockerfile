# --- Final Image ---
# Use a lightweight Node.js image
FROM node:20-alpine

WORKDIR /app

# Copy project files
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src

# Install ALL dependencies (including tsx and types)
# Skip audit and fund to save memory/time
RUN npm install --no-audit --no-fund --no-package-lock

# Environment variables
ENV TRANSPORT=stdio
ENV BACKEND_URL=https://yama-ucp-store-backend.vercel.app
# Ensure Node uses a sensible amount of memory for tsx
ENV NODE_OPTIONS="--max-old-space-size=1536"

# Run directly from source using tsx
ENTRYPOINT ["npx", "tsx", "src/index.ts"]
