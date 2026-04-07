# Use Node.js 22
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the project
COPY . .

# Expose app port
EXPOSE 3000

# Start the app
CMD ["node", "app.js"]
