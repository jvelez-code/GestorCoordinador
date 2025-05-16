// models/Pagos.js
const mongoose = require('mongoose');

const pagosSchema = new mongoose.Schema({
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
});

const Pagos = mongoose.model('pagos', pagosSchema, 'pagosFechas');

module.exports = Pagos;
