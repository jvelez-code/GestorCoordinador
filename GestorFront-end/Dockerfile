# Stage 0, based on Node.js, to build and compile Angular
FROM node:lts as node
WORKDIR /app
COPY ./ /app/
RUN npm install -g npm@8.5.3
RUN npm link @angular/cli
ARG configuration=production
RUN npm run build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:alpine
COPY --from=node /app/dist/reportesFront /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf