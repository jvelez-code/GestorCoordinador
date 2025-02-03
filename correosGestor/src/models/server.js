const express = require('express')
const cors = require('cors')
const userRoutes = require('../routes/user');

class Server {

    

    constructor(){
        this.app = express();
        this.port = process.env.PORT || 3005;
        this.pagosPath = '/apicorreo'
        this.middlewares();
        this.routes();

    }

    middlewares(){
        this.app.use(cors());
        this.app.use(express.static('public'))
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
        };        
        this.app.use(cors(corsOptions));
    }

    routes(){  
        this.app.use( this.pagosPath, require('../routes/user'));
        }


    listen(){        
            this.app.listen(this.port, ()=>{
                console.log('Servidor corriendo en el puerto', this.port)
            })
        }

}

module.exports = Server;

