import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import router from './routes/index.routes';

const app = express();
app.use(morgan('dev'));
app.use(express.json());

// Verifica si ALLOWED_ORIGINS está definido
if (!process.env.ALLOWED_ORIGINS) {
  console.error('Error: ALLOWED_ORIGINS no está definido en el archivo .env');
  process.exit(1);
}

// Configurar CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.use(router);

export default app;
