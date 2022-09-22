#Primera Etapa
FROM node:14.15.4 as node
WORKDIR /app
COPY ./ /app/
RUN npm install 
RUN npm link @angular/cli --force
ARG configuration=production
RUN npm run build

#Segunda Etapa
FROM nginx:1.17.1-alpine
	#Si estas utilizando otra aplicacion cambia PokeApp por el nombre de tu app
COPY --from=node /app/dist/reportesFront /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf