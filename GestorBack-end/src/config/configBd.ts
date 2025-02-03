import { encrypt, decrypt } from './aes';

// // Cifrar el texto
//const text = "Velez2024*"; // Texto a cifrar

// // Cifrar el texto
// const encrypted = encrypt(text);
// console.log('Texto cifrado:', encrypted);

// Descifrar el texto
const decrypted = decrypt('n4W11oLXQSEDvgus1UdNlw==');
console.log('Texto descifrado configDB:', decrypted);
const gestor= process.env.GESTOR
const contac= process.env.CONTACT
const server= process.env.SERVER
const usuario= process.env.USUARIO

// // Mostrar clave utilizada
// console.log('Clave (Base64):', 'your_base64_encoded_key');







// Base de datos Asterisk
let config_bd = {
    user: usuario,
    password: decrypted,
    host: server,
    database: contac,
    port: 5432,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    // toStr: function() {
    //     return `postgresql://${this.user}:${this.password}@${this.host}:${this.port}/${this.database}`;
    // }
}

// Base de datos Asterisk replica
let config_bd_r = {
    user: usuario,
    password: decrypted,
    host: server,
    database: contac,
    port: 5432,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    // toStr: function() {
    //     return `postgresql://${this.user}:${this.password}@${this.host}:${this.port}/${this.database}`;
    // }
}

// Base de datos Gestor
let config_bd_gc = { 
    user: usuario,
    password: decrypted,
    host: server,
    database: gestor,
    port: 5432,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    // toStr: function() {
    //     return `postgresql://${this.user}:${this.password}@${this.host}:${this.port}/${this.database}`;
    // }
}

// Base de datos Gestor replica
let config_bd_gc_r = {
    user: usuario,
    host: server,
    password: decrypted,
    database: gestor,
    port: 5432,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    // toStr: function() {
    //     return `postgresql://${this.user}:${this.password}@${this.host}:${this.port}/${this.database}`;
    // }
}



module.exports = {
    config_bd,
    config_bd_gc,
    config_bd_r,
    config_bd_gc_r
}
