# Use an official Node.js runtime as a parent image
# We use a Debian-based image to easily install LibreOffice
FROM node:18-bullseye

# Install LibreOffice and fonts
RUN apt-get update && apt-get install -y \
    libreoffice \
    fonts-opensymbol \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy the entire project
COPY . .

# Install Backend Dependencies
WORKDIR /app/server
RUN npm install

# Install Frontend Dependencies and Build
WORKDIR /app/client
RUN npm install
RUN npm run build

# Go back to server directory
WORKDIR /app/server

# Expose the port the app runs on
EXPOSE 5001

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5001

# Start the server
CMD ["node", "server.js"]
