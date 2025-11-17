FROM node:18

WORKDIR /app

# Copy package first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the backend
COPY . .

# Build TypeScript
RUN npm run build

# Expose your backend port (change if needed)
EXPOSE 5000

# Run server
CMD ["npm", "start"]
