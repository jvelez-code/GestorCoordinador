const express = require('express')
var cors = require('cors')

class Server {

    

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.middlewares();
        this.routes();

    }

    middlewares(){
        const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

        const corsOptions = {
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type'],
        };

        this.app.use(cors(corsOptions));
        this.app.use(express.static('public'))
    }

    routes(){
        this.app.get('/api', (req, res) => {
            res.send('Hello World')
          });
        }

    listen(){


        const options = {
            key: fs.readFileSync('certs/web_b2bjtccia.key'),
            cert: fs.readFileSync('certs/b2bjtccia.com.cer'),
        };
        
        this.app.listen(this.port, ()=>{
            console.log('Servidor corriendo en el puerto', this.port)
        })
    }

}

module.exports = Server;

