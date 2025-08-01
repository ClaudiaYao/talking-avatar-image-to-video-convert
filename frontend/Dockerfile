# This file is used to create docker images for the frontend
FROM node:18 AS frontend-builder
WORKDIR /app/talking_avatar_app
COPY . .
WORKDIR /app/talking_avatar_app/frontend
RUN npm install --include=dev
RUN npm run build

FROM nginx:alpine
COPY --from=frontend-builder /app/talking_avatar_app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
