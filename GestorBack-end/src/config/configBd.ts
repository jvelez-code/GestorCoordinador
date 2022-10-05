
//Base de datos Asterisk
var config_bd = {
    user: 'pgsql',
    host: '10.1.1.7',
    database: 'contact_center',
    password: 'pgsql',
    port: 5432,
    toStr: () => `postgresql://${config_bd.user}:${config_bd.password}@${config_bd.host}:${config_bd.port}/${config_bd.database}`
}

//Base de datos Asterisk replica
var config_bd_r = {
    user: 'pgsql',
    host: '10.1.1.7',
    database: 'contact_center',
    password: 'pgsql',
    port: 5432,
    toStr: () => `postgresql://${config_bd.user}:${config_bd.password}@${config_bd.host}:${config_bd.port}/${config_bd.database}`
}

//Base de datos Gestor
var config_bd_gc = { 
    host: '10.1.1.7',
    //host: '10.1.1.25',
    user: 'postgres',
    password: '' ,
    database: 'gestorclientes',
    //database: 'gestorclientes20210204',
    port: '5432'
}



//Base de datos Gestor replica
var config_bd_gc_r = {
    user: 'pgsql',
    host: '10.1.1.7',
    database: 'gestorclientes_2022-08-01',
    password: 'pgsql',
    port: 5432,
    toStr: () => `postgresql://${config_bd.user}:${config_bd.password}@${config_bd.host}:${config_bd.port}/${config_bd.database}`
}



module.exports = {
    config_bd,
    config_bd_gc,
    config_bd_r,
    config_bd_gc_r,
}