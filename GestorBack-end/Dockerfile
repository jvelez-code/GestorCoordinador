FROM node:16-alpine
WORKDIR /app

#intalacion de dependencias
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
#CMD [ "npm run", "dev" ]
CMD npm run dev
