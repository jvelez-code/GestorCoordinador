
#Primera Etapa
FROM node:20.10.0 as build
WORKDIR /app


# Instalación de dependencias
COPY package.json /app
RUN npm install --force
RUN apt-get update && apt-get install -y tzdata && \
    ln -fs /usr/share/zoneinfo/America/Bogota /etc/localtime && \
    dpkg-reconfigure --frontend noninteractive tzdata


# Copia del código fuente y construcción de la aplicación
COPY . /app
RUN npm run build  --prod

# Etapa de producción
FROM nginx:1.17.1-alpine

# Copia de los archivos construidos al servidor Nginx
COPY --from=build /app/dist/reportesFront /usr/share/nginx/html

# Copia de la configuración de Nginx y los certificados SSL
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
COPY ./src/assets/SSL_wc.enlace-apb.com.cer /usr/share/nginx/html/assets/SSL_wc.enlace-apb.com.cer
COPY ./src/assets/web_enlace.key /usr/share/nginx/html/assets/web_enlace.key


# Exponer el puerto en el que Nginx estará escuchando
EXPOSE 80
EXPOSE 9443

# Comando para correr Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
