# Stage 1 — build
FROM node:20-alpine AS builder

WORKDIR /monorepo

# Copy workspace manifests
COPY packages/ ./packages/
COPY apps/web/package*.json ./apps/web/

WORKDIR /monorepo/apps/web
RUN npm ci

COPY apps/web/ .
RUN npm run build

# Stage 2 — serve with nginx
FROM nginx:alpine

COPY --from=builder /monorepo/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
