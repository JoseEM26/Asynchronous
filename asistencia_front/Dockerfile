# Stage 1: Build the Angular application
FROM node:20-alpine AS build
WORKDIR /app
# Install dependencies
COPY package*.json ./
RUN npm install
# Copy source code and build
COPY . .
RUN npm run build --configuration=production

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine
# Copy the compiled application from the build stage
# Note: The path might vary depending on your angular.json configuration
# For Angular 17/18, it's typically dist/[app-name]/browser
COPY --from=build /app/dist/asistencia_front/browser /usr/share/nginx/html
# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port 80
EXPOSE 80
# Run Nginx
CMD ["nginx", "-g", "daemon off;"]
