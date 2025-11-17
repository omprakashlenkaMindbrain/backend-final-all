# ---------- Stage 1: Build ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript → JavaScript
RUN npm run build


# ---------- Stage 2: Run ----------
FROM node:18-alpine

WORKDIR /app

# Copy built files and node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Copy environment variables
COPY .env .env

# Copy production config JSON
COPY config/default.json ./config/default.json

# Set default MODE
ENV MODE=prod

# Run the app
CMD ["node", "dist/app.js"]