const fetch = require('node-fetch');
const https = require('https');
const crypto = require('crypto');

const algorithm = 'aes-256-ecb'; // Algoritmo de cifrado (modo ECB)
//const keyBase64 = 'HSc3u4euQH8Smr/nLJy07Mo5lU/ylKEpGZAkpvgkTSY='; //jv
const keyBase64 = 'OTTCUMpQlogG0AAw6Lf4boif/oiWfhC5V6p9a2qW2Ko='; //wembley

// Decodifica la clave de Base64
const key = Buffer.from(keyBase64, 'base64');

// Verifica la longitud de la clave
if (key.length !== 32) {
  throw new Error('La clave debe tener 256 bits (32 bytes) para AES-256.');
}

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, null); // 'null' para el IV en ECB
  let encrypted = cipher.update(text, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('base64'); // Devuelve el texto cifrado en Base64
}

function decrypt(encryptedText) {
  const encryptedTextBuffer = Buffer.from(encryptedText, 'base64');
  const decipher = crypto.createDecipheriv(algorithm, key, null); // 'null' para el IV en ECB
  let decrypted = decipher.update(encryptedTextBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString('utf8');
}

module.exports = { encrypt, decrypt };