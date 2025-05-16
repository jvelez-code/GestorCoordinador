const express = require('express')
const morgan = require('morgan');
var cors = require('cors');
const { socketController } = require('../sockets/controller');

class Server {

    

    constructor(){
        this.app = express();
        this.port = process.env.PORT || 3021;
        this.server = require('http').createServer( this.app);
        this.io = require('socket.io')(this.server);
        

        this.pagosPath = '/apireporte'
        this.paths = {};

        this.middlewares();

        this.routes();

        this.socket();

    }

    middlewares(){
        
        this.app.use(morgan('dev'));
        this.app.use( express.json() ); 
        this.app.use( express.static('public'))
    }
    
    routes(){

    }

    socket(){
        this.io.on('connection', (socket) => {
            console.log('Cliente conectado Server.js:', socket.id);
            socketController(socket, this.io);  // Llama al controlador para manejar eventos
        });
    
    }



    listen(){        
        //this.app.listen(this.port, ()=>{
            this.server.listen(this.port, ()=>{
            console.log('Servidor corriendo en el puerto', this.port)
        })
    }

}

module.exports = Server;

