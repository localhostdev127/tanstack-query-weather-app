# Stage 1: Build
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .



# Build the app
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine AS production

# Remove the default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the built app from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
