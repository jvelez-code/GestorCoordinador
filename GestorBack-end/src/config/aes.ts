import * as crypto from 'crypto';

// Configuración
const algorithm = 'aes-256-ecb'; // Algoritmo de cifrado (modo ECB)
const keyBase64 = 'SKVQtne2oqDusA7Drn0lg/0YAwj5tX+/g31P4yat8h8=';

// Decodifica la clave de Base64
const key = Buffer.from(keyBase64, 'base64');

// Verifica la longitud de la clave
if (key.length !== 32) {
  throw new Error('La clave debe tener 256 bits (32 bytes) para AES-256.');
}

// Función para cifrar datos
export function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(algorithm, key, null); // 'null' para el IV en ECB
  let encrypted = cipher.update(text, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('base64'); // Devuelve el texto cifrado en Base64
}

// Función para descifrar datos
export function decrypt(encryptedText: string): string {
  const encryptedTextBuffer = Buffer.from(encryptedText, 'base64');
  const decipher = crypto.createDecipheriv(algorithm, key, null); // 'null' para el IV en ECB
  let decrypted = decipher.update(encryptedTextBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString('utf8');
}
