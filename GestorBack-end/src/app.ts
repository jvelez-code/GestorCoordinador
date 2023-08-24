require('dotenv').config({ path:'/.env'})

import { config } from "dotenv";
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';


import router from './routes/index.routes';
import { REFUSED } from 'dns';


const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
// app.use(
//     usuarioRouter,
//     askEstadoExtensionRouter,
//     authUsuarioRouter);
 app.use(router)


export default app;