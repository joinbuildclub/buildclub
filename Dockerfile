# Use Node.js 20 as the base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy application code
COPY . .

# Build the client and server
RUN npm run build

# Expose port 5000
EXPOSE 5000

# Start the application
CMD ["npm", "run", "start"]