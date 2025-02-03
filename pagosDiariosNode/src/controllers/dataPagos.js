const axios = require('axios');
const config = require('../config/config');

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

module.exports = {
  obtenerDatosPagos
};
