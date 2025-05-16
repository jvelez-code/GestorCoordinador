// models/Pagos.js
const mongoose = require('mongoose');

async function createPagosModel() {
  const pagosDiariosConnection = await require('../db/pagosDiarios')();
  

const PagosSchema = new mongoose.Schema({
    fechaPago: String,
    aportante: String,
    tipoIdentificacion: String,
    numIdentificacion: String,
    tipoEntidad: String,
    numTrabajadores: Number,
    numAdministradoras: Number,
    totalPago: Number,
    originador: String,
    tipoPago: String,
    numeroPlanilla: String,
    formaPago: String,
    entidad: String,
    anioPago: String,
    mesPago: String,
    departamento: Number,
    municipio: Number,
    email: String,
    telefono: String,
    direccion: String,
    celular: String,
    sucursal: String,
    registroSalida: Number,
    usuario: String,
    cantidadPagos: Number,
    tipoPlanilla: String,
    entidadRecaudo: String
}, {
    collection: 'pagosFechas'
  });

  const Pagos = pagosDiariosConnection.model('Pagos', PagosSchema);

  return Pagos;
}

module.exports = createPagosModel;
