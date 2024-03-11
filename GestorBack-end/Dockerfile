FROM node:20.10.0
WORKDIR /app

#intalacion de dependencias
COPY package*.json ./
RUN npm install --save --force
RUN apt-get update && apt-get install -y tzdata && \
    ln -fs /usr/share/zoneinfo/America/Bogota /etc/localtime && \
    dpkg-reconfigure --frontend noninteractive tzdata

COPY . .

EXPOSE 3000
#CMD [ "npm run", "dev" ]
CMD npm run dev
