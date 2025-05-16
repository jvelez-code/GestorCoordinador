const express = require('express')
const morgan = require('morgan');
var cors = require('cors')
const conectMongo = require('../config/configMongo');
const conectPostgres = require('../config/configPostgres');


class Server {



    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.io = require('socket.io')(this.server, {
            cors: {
                origin: process.env.ALLOWED_ORIGINS.split(','),  // Lista de orígenes permitidos desde el .env
                methods: ['GET', 'POST'],
                allowedHeaders: ['Content-Type'],
                credentials: true  // Permite cookies y otros encabezados de autenticación
            }
        });

        this.pagosPath = '/apireporte'
        this.middlewares();
        this.routes();

    }

    middlewares() {

        this.app.use(morgan('dev'));
        this.app.use(express.json());

        if (!process.env.ALLOWED_ORIGINS) {
            console.error('Error: ALLOWED_ORIGINS no está definido en el archivo .env');
            process.exit(1);
        }

        const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
        const corsOptions = {
            origin: allowedOrigins,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type'],
            credentials: true
        };

        this.app.use(cors(corsOptions));

    }

    async verificaBD() {
        try {
            await conectMongo();
            console.log('Conexión a MongoDB exitosa');
        } catch (error) {
            console.error('Error al conectar a las bases de datos:', error);
            process.exit(1); // Detener el proceso si la conexión falla
        }
    }

    async routes() {
        await this.verificaBD();
        this.app.use(this.pagosPath + '/reporMongo', require('../routes/pagos'));
        this.app.use(this.pagosPath + '/reporContact', require('../routes/reportesContact'));
        this.app.use(this.pagosPath + '/reporGestor', require('../routes/reportesGestor'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port)
        })
    }

}

module.exports = Server;

