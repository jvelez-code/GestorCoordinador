const axios = require('axios');
const config = require('../config/config');
const Pagos = require('../entitys/pagosDiarios');

const obtenerDatosPagos = async (token, fechaInicio, fechaFin) => {
  try {
    const response = await axios.post(config.dataUrl, {
      fechaInicio,
      fechaFin
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
     return response.data;
  } catch (error) {
    console.error('Error al obtener los datos de pagos:', error.message);
    throw error;
  }
};

const limpiarPagos = async() => {
  try {
    const result = await Pagos.deleteMany({ cantidadPagos: { $gt: 3 } });
    console.log('Pagos eliminados:', result.deletedCount);
  } catch (error) {
    console.error('Error al borrar pagos mayor que 3:', error.message);
    throw error;    
  }
}

module.exports = {
  obtenerDatosPagos,
  limpiarPagos
};
