# Use Node.js as the base image
FROM node:20-alpine as builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
# COPY package*.json ./

# Install dependencies
# RUN npm install --legacy-peer-deps

# Copy the rest of the application source code
COPY . ./

# Build the application using Vite
# RUN npm run build

# Use a lightweight web server for the production build
FROM nginx:stable-alpine

# Set working directory to nginx html folder
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy the build output from the builder stage
COPY --from=builder /app/dist .

# Copy custom nginx configuration (optional, if needed)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]