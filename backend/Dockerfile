# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies (production only)
RUN npm install --omit=dev

# Copy the rest of the backend code
COPY . .

# Create uploads directory (in case it's empty and not tracked by git)
RUN mkdir -p uploads

# Expose the port the app runs on
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
