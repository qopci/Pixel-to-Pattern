# Official Node.js image with lightweight Linux Alpine OS
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Adds ARG to ensure NEXT_PUBLIC_API_BASE_URL is baked into the build
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

# Copy package files into container
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy all the code into the container
COPY . .

# Expose PORT 3001 for frontend server to run on
EXPOSE 3001

# Temporarily disable Babel to allow Next.js to use SWC during build
RUN mv babel.config.js babel.config.ignore || true

# Build the Next.js app for production
RUN npm run build

# Define default command to start the frontend
CMD ["npm", "start"]
