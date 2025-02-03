const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
    nombre: String,
    edad: Number,
    direcci: {
      calle: String,
      barri: String
    }
  });

const Cliente = mongoose.model('Cliente', clienteSchema);
module.exports = Cliente;
