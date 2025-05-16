const mongoose = require('mongoose');
const { DB_PAGOSDIARIOS } = require('../config/db');


async function connectGestorDrako() {
  try {
    const pagosDiariosConnection = await mongoose.createConnection(DB_PAGOSDIARIOS, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Conectado a MongoDB en gestorDrako');
    return pagosDiariosConnection;
  } catch (error) {
    console.error('Error al conectar a gestorDrako:', error);
  }
}

module.exports = connectGestorDrako;

