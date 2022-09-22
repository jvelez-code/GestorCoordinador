FROM node:14.15.4
WORKDIR /app

#intalacion de dependencias
COPY package*.json ./
RUN npm install --save --force

COPY . .

EXPOSE 3000
#CMD [ "npm run", "dev" ]
CMD npm run dev
