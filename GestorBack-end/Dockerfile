# Usa una versión específica de la imagen oficial de Node.js
FROM node:20.10.0

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json (si existe)
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install --force

# Configura la zona horaria
RUN apt-get update && apt-get install -y tzdata && \
    ln -fs /usr/share/zoneinfo/America/Bogota /etc/localtime && \
    dpkg-reconfigure --frontend noninteractive tzdata

# Copia el resto del código de la aplicación
COPY . .

# Copia los certificados SSL
COPY certs/ /app/certs/

# Expon el puerto en el que la aplicación va a correr
EXPOSE 3000
EXPOSE 8484

# Comando para ejecutar la aplicación
CMD ["npm", "run", "dev"]

