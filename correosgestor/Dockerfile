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

# Expon el puerto en el que la aplicación va a correr
EXPOSE 3005

# Comando para ejecutar la aplicación
CMD ["node", "app.js"]

