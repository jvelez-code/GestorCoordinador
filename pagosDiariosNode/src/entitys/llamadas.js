const mongoose = require('mongoose');

async function createLlamadaModel() {
  const gestorDrakoConnection = await require('../db/gestorDrako')();


const LlamadaSchema = new mongoose.Schema({
  time: { 
    type: Date, 
    required: true },
  callid: { 
    type: String, 
    required: true },
  event: { 
    type: String, 
    required: true },
  uniqueid: { 
    type: String, 
    required: true },
  empresa: { 
    type: String, 
    required: true },
  id_agente: { 
    type: String, 
    required: true },
  tipo_de_llamada: { 
    type: String, 
    required: true }
}, {
  collection: 'llamadas'
});

const Llamada = gestorDrakoConnection.model('Llamada', LlamadaSchema);

return Llamada;
}

module.exports = createLlamadaModel;
