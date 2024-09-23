require('dotenv').config();

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';


import router from './routes/index.routes';


const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Configurar CORS
app.use((req, res, next) => {
  const allowedOrigins = ['http://127.0.0.1:4200', 'https://127.0.0.1:9443',
  'https://gestorcoordinador.enlace-apb.com:9443','https://gestorcoordinador.jaimetorres.net:9443', 'http://10.10.11.198:4200'];

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
  
 app.use(router)


export default app;