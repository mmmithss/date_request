# Multi-stage Dockerfile to build and serve on port 5000 in any ecosystem
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production server stage
FROM nginx:alpine

# Copy built dist files
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom Nginx configuration to listen on port 5000 and handle SPA routing
RUN printf 'server {\n\
    listen 5000;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 5000

CMD ["nginx", "-g", "daemon off;"]
