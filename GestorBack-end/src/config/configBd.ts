import { encrypt, decrypt } from './aes';

// // Cifrar el texto
//const text = "Velez2024*"; // Texto a cifrar

// // Cifrar el texto
// const encrypted = encrypt(text);
// console.log('Texto cifrado:', encrypted);

// Descifrar el texto
//const decrypted = decrypt('ySLP8tyF/6PElLqgY0OapYzgmbPmk1CEaRwdlRng7PU=');
const decrypted = 'Velez2024*';
console.log('Texto descifrado configDB:', decrypted);

// // Mostrar clave utilizada
// console.log('Clave (Base64):', 'your_base64_encoded_key');







// Base de datos Asterisk
let config_bd = {
    user: 'jaime.velez',
    password: decrypted,
    host: '10.1.1.25',
    database: 'contact_center_apz12092024',
    port: 5432,
    toStr: function() {
        return `postgresql://${this.user}:${this.password}@${this.host}:${this.port}/${this.database}`;
    }
}

// Base de datos Asterisk replica
let config_bd_r = {
    user: 'jaime.velez',
    password: decrypted,
    host: '10.1.1.25',
    database: 'contact_center_apz12092024',
    port: 5432,
    toStr: function() {
        return `postgresql://${this.user}:${this.password}@${this.host}:${this.port}/${this.database}`;
    }
}

// Base de datos Gestor
let config_bd_gc = { 
    user: 'jaime.velez',
    password: decrypted,
    host: '10.1.1.25',
    database: 'gestorclientes_apz12092024',
    port: 5432,
    toStr: function() {
        return `postgresql://${this.user}:${this.password}@${this.host}:${this.port}/${this.database}`;
    }
}

// Base de datos Gestor replica
let config_bd_gc_r = {
    user: 'jaime.velez',
    host: '10.1.1.25',
    password: decrypted,
    database: 'gestorclientes_apz12092024',
    port: 5432,
    toStr: function() {
        return `postgresql://${this.user}:${this.password}@${this.host}:${this.port}/${this.database}`;
    }
}



module.exports = {
    config_bd,
    config_bd_gc,
    config_bd_r,
    config_bd_gc_r
}
