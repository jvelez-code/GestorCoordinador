const mongoose = require('mongoose');

async function createGestionModel() {  
  const gestorDrakoConnection = await require('../db/gestorDrako')();


const GestionSchema = new mongoose.Schema({
  fecha_gestion: {
    type: Date,
    required: true
  },
  empresa: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true
  }
}, {
  collection: 'gestion'
});

const Gestion = gestorDrakoConnection.model('Gestion', GestionSchema);

return Gestion;
}

module.exports = createGestionModel;
