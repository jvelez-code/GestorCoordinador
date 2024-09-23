import fetch from 'node-fetch';

import * as https from 'https';

const agent = new https.Agent({ rejectUnauthorized: false });
let tokenauth: string = '';
let bodycontraencriptada: any; // Cambia a un tipo más específico si es conocido
const dominioapis = '10.1.0.9';
const aplicativo = 'gestor';

// Define interfaces para las respuestas de la API
interface TokenResponse {
  body: {
    token: any;
  };
}

interface EncriptarClaveResponse {
  body: any; // Cambia esto a un tipo más específico si se conoce
}

interface DesencriptarClaveResponse {
  // Define los campos esperados en la respuesta
  resultado: string;
}

const url2 = `https://${dominioapis}/helpvoz/api/v1/authorize`;
const cuerpo2 = {
  usuario: '123',
  clave: '123'
};

async function obtenerTokenAuth(): Promise<string> {
  try {
    const response = await fetch(url2, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cuerpo2),
      agent: agent
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, ${errorData}`);
    }


    const tokenResponse: TokenResponse = {
        body: {
          token: await response.json()
        }
      };

    //tokenResponse: TokenResponse = await response.json();
    tokenauth = tokenResponse.body.token;
    console.log('Token de autorización:', tokenauth);
    
    return tokenauth;
    
  } catch (error) {
    console.error('Error al obtener el token:', error);
    throw error;
  }
}

const url3 = `https://${dominioapis}/helpvoz/api/v1/encriptarclave/${aplicativo}/`;

async function obtenerClavecifrada(): Promise<any> {
  if (!tokenauth) {
    await obtenerTokenAuth(); // Asegúrate de que se obtiene el token antes de proceder
  }
  
  try {
    const response = await fetch(url3, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenauth}` // No necesitas JSON.stringify aquí
      },
      agent: agent
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, ${errorData}`);
    }


    const encriptarClaveResponse: EncriptarClaveResponse = {
        body: {
          token: await response.json()
        }
      };

    //const result3: EncriptarClaveResponse = await response.json();
    bodycontraencriptada = encriptarClaveResponse.body;
    console.log('cuerpo:', bodycontraencriptada);
    console.log('cuerpo en texto:', JSON.stringify(bodycontraencriptada));
    return encriptarClaveResponse.body;
    
  } catch (error) {
    console.error('Error al obtener la clave cifrada:', error);
    throw error;
  }
}

const url = `https://${dominioapis}/helpvoz/api/v1/desencriptarclave/`;

async function obtenerClave(): Promise<any> {
  if (!tokenauth) {
    await obtenerTokenAuth(); // Asegúrate de que se obtiene el token antes de proceder
    await obtenerClavecifrada();
  }
  const cuerpo = bodycontraencriptada;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenauth}` // No necesitas JSON.stringify aquí
      },
      body: JSON.stringify(cuerpo),
      agent: agent
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, ${errorData}`);
    }

    if (!response.ok) {
        const errorData = await response.text();
    }

    const result = await response.json();
    return result;
    
  } catch (error) {
    console.error('Error al obtener la clave:', error);
    throw error;
  }
}

export { obtenerClave };
