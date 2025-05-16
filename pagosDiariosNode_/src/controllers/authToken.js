const axios = require('axios');
const config = require('../config/config');

const obtenerToken = async () => {

  try {
    const response = await axios.post(config.authUrl, {
      "usuario": config.usuario,
      "clave": config.clave
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.data && response.data.token) {
      console.log('Token obtenido:', response.data.token);
      return response.data.token;
    } else {
      throw new Error('No se pudo obtener el token');
    }
  } catch (error) {
    console.error('Error al obtener el token:', error.message);
    throw error;
  }
};

module.exports = {
  obtenerToken
};
