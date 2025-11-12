# Official Node.js image with lightweight Linux Alpine OS
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files into container
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy all the code into the container
COPY . .

# Expose PORT 3000 for backend server to listen on
EXPOSE 3000

# Define default command to start the server
CMD ["npm", "start"]