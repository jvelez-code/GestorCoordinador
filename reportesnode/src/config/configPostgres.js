const { Client } = require('pg');
const { decrypt } = require('./aes');


const { GESTOR, CONTACT, SERVER, USUARIO } = process.env;

// El texto cifrado que quieres desencriptar
//const encryptedPassword = 'uYV18708LDs3AxqVdLShGg=='; //jv
const encryptedPassword = '3CDqM2fjmx19je/CxJ7U0BEa+MxZ1/4IVLo3NtOf8C4='; //wembley

// Desencriptar la contraseña
const decryptedPassword = decrypt(encryptedPassword);

// Mostrar la contraseña desencriptada
console.log('Contraseña desencriptada:', decryptedPassword);


const createDbConfig = (database) => ({
    user: USUARIO,
    password: decryptedPassword,
    host: SERVER,
    database: database,
    port: 5432,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});


const config_bd = createDbConfig(CONTACT);
const config_bd_gc = createDbConfig(GESTOR);
const config_bd_r = createDbConfig(CONTACT);
const config_bd_gc_r = createDbConfig(GESTOR);

console.log(config_bd,'contac1')
console.log(config_bd_gc,'gestor2')

module.exports = {
    config_bd,
    config_bd_gc,
    config_bd_r,
    config_bd_gc_r
};
