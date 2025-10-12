# Use the official Node.js LTS image (Debian-based)
FROM node:lts-buster

# Set working directory
WORKDIR /app

# Update package sources (Buster repos are archived) and install dependencies
RUN sed -i 's|http://deb.debian.org/debian|http://archive.debian.org/debian|g' /etc/apt/sources.list \
 && sed -i '/security/d' /etc/apt/sources.list \
 && apt-get -o Acquire::Check-Valid-Until=false update \
 && apt-get install -y \
    ffmpeg \
    imagemagick \
    webp \
    git \
    curl \
 && apt-get upgrade -y \
 && rm -rf /var/lib/apt/lists/*

# Install PM2 globally (for process management)
RUN npm install -g pm2

# Copy package files first for better layer caching
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy all files (except those in .dockerignore)
COPY . .

# Create session directory (required by your app)
RUN mkdir -p /app/session

# Set environment variables (adjust as needed)
ENV NODE_ENV=production
ENV PORT=3000

# Expose the Express.js port
EXPOSE 3000

# Start the app using PM2 (recommended for production)
CMD ["pm2-runtime", "start", "bot.js"]

# Alternative without PM2:
# CMD ["node", "--experimental-specifier-resolution=node", "index.js"]