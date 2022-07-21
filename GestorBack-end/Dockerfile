FROM node:lts 

WORKDIR /usr/src/app

#intalacion de dependencias
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]
