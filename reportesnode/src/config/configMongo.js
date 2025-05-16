const mongoose = require('mongoose');

const url = 'mongodb://root:rootpassword@10.1.1.151:27017/pagosDiarios?authSource=admin';

async function connectDB() {
  try {
    await mongoose.connect(url);
    console.log('Conectado a MongoDB en Docker!');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
  }
}

module.exports = connectDB;
