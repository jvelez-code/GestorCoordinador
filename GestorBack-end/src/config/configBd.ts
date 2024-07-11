const bcrypt = require('bcrypt');

// Base de datos Asterisk
var config_bd = {
    user: 'jaime.velez',
    password: 'V3l3z24*',
    host: '10.1.1.25',
    database: 'contact_center',
    port: 5432,
    toStr: function() {
        return `postgresql://${this.user}:${this.password}@${this.host}:${this.port}/${this.database}`;
    }
}

// Base de datos Asterisk replica
var config_bd_r = {
    user: 'jaime.velez',
    password: 'V3l3z24*',
    host: '10.1.1.25',
    database: 'contact_center',
    port: 5432,
    toStr: function() {
        return `postgresql://${this.user}:${this.password}@${this.host}:${this.port}/${this.database}`;
    }
}

// Base de datos Gestor
let config_bd_gc = { 
    user: 'jaime.velez',
    password: 'V3l3z24*',
    host: '10.1.1.25',
    database: 'gestorclientes_200524',
    port: 5432,
    toStr: function() {
        return `postgresql://${this.user}:${this.password}@${this.host}:${this.port}/${this.database}`;
    }
}

// Base de datos Gestor replica
var config_bd_gc_r = {
    user: 'jaime.velez',
    host: '10.1.1.25',
    password: 'V3l3z24*',
    database: 'gestorclientes_200524',
    port: 5432,
    toStr: function() {
        return `postgresql://${this.user}:${this.password}@${this.host}:${this.port}/${this.database}`;
    }
}

// Función para encriptar la contraseña
async function hashPassword(password: string) {
    const saltRounds = 12; // Número de rondas de sal (recomendado: 10)
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

// Función de ejemplo para encriptar una contraseña
async function ejemploEncriptacion() {
    try {
        const plainPassword = '123';
        const hashedPassword = await hashPassword(plainPassword);
        console.log('Contraseña encriptada:', hashedPassword);

        // Aquí podrías guardar hashedPassword en tu base de datos
    } catch (error) {
        console.error('Error al encriptar la contraseña:', error);
    }
}

module.exports = {
    config_bd,
    config_bd_gc,
    config_bd_r,
    config_bd_gc_r,
    ejemploEncriptacion,
    hashPassword
}
