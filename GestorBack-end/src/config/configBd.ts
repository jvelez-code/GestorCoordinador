
    //Base de datos Asterisk
    var config_bd = {
        user: 'pgsql',
        host: '10.1.1.25',
        database: 'contact_center030523_no_la_danen25',
        password: 'pgsql',
        port: 5432,
        toStr: () => `postgresql://${config_bd.user}:${config_bd.password}@${config_bd.host}:${config_bd.port}/${config_bd.database}`
    }

    //Base de datos Asterisk replica
    var config_bd_r = {
        user: 'pgsql',
        host: '10.1.1.25',
        database: 'contact_center030523_no_la_danen25',
        password: 'pgsql',
        port: 5432,
        toStr: () => `postgresql://${config_bd.user}:${config_bd.password}@${config_bd.host}:${config_bd.port}/${config_bd.database}`
    }

    //Base de datos Gestor
    var config_bd_gc = { 
        user: 'pgsql',
        host: '10.1.1.25',
        database: 'gestorclientes090323_25',
        password: 'pgsql',
        port: 5432,
        toStr: () => `postgresql://${config_bd.user}:${config_bd.password}@${config_bd.host}:${config_bd.port}/${config_bd.database}`
    }



    //Base de datos Gestor replica
    var config_bd_gc_r = {
        user: 'pgsql',
        host: '10.1.1.25',
        database: 'gestorclientes090323_25',
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
