# Usa una imagen base oficial de NGINX (en este caso, basada en Alpine para un tamaño más reducido)
FROM nginx:alpine

# Copiar el archivo de configuración de NGINX a la ubicación adecuada dentro del contenedor
COPY ./certs /etc/nginx/certs
RUN chmod -R 777 /etc/nginx/certs/


# Copiar los certificados SSL
COPY ./nginx.conf /etc/nginx/nginx.conf
RUN chmod 644 /etc/nginx/nginx.conf


EXPOSE 443

# Iniciar NGINX en modo "foreground"
CMD ["nginx", "-g", "daemon off;"]
