# Use an official Node.js image as the base image
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /mealmeter_mobile/mealmeter

# Install Expo CLI globally
RUN npm install -g expo-cli

# Copy the package.json and package-lock.json (if available) to the container
COPY mealmeter/package*.json ./

# Install dependencies
RUN npm install

# Copy the entire mealmeter folder into the container
COPY mealmeter .

# Expose the Expo ports (default ports used by Expo)
EXPOSE 8081 19000 19001 19002

# Command to start the Expo server
CMD ["npm", "start"]