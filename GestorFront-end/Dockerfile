# Stage 0, based on Node.js, to build and compile Angular
FROM node:16-alpine as node
WORKDIR /app
COPY ./ /app/
RUN npm install -g npm --force
RUN npm link @angular/cli --force
ARG configuration=production
RUN npm run build --force

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:alpine
COPY --from=node /app/dist/reportesFront /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf