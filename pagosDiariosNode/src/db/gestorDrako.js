const mongoose = require('mongoose');
const { DB_GESTORDRAKO } = require('../config/db');


async function connectGestorDrako() {
  try {
    const gestorDrakoConnection = await mongoose.createConnection(DB_GESTORDRAKO, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Conectado a MongoDB en gestorDrako');
    return gestorDrakoConnection;
  } catch (error) {
    console.error('Error al conectar a gestorDrako:', error);
  }
}

module.exports = connectGestorDrako;
