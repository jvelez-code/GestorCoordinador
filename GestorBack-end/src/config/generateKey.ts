import * as crypto from 'crypto';

// Generar una clave AES de 256 bits (32 bytes)
const key = crypto.randomBytes(32); // 32 bytes * 8 bits = 256 bits

// Codificar la clave en Base64
const keyBase64 = key.toString('base64');

console.log('Clave AES en Base64:', keyBase64);
