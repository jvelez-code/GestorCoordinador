const express = require('express')
var cors = require('cors')
const connectDB = require('../config/configDB');
const moment = require('moment');

const cron = require('node-cron');
const authToken = require('../controllers/authToken');
const dataPagos = require('../controllers/dataPagos')
const Pagos = require('../entitys/pagos');


class Server {

    

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.pagosPath = '/api/pagosDiarios'
        this.middlewares();
        this.routes();
        this.cronJobs();

    }

    middlewares(){
        this.app.use(cors());
        this.app.use( express.json() );
    }

    routes(){
       connectDB().then(()=>{ })
       this.app.use(this.pagosPath, require('../routes/pagos'))              
        }

        cronJobs() {
           
            cron.schedule('35 16 * * *', async () => {
                //console.log('Ejecutando tarea programada a las 11:00 PM');
                const fechaActual = moment().subtract(1, 'days').format('YYYY-MM-DD');  
                //const fechaActual =  moment('2024-12-09').format('YYYY-MM-DD');          
                try {
                    console.log(fechaActual);
                    const token = await authToken.obtenerToken(); 
                    const data = await dataPagos.obtenerDatosPagos(token, fechaActual, fechaActual);
                    console.log(data.object.length,'valorres longitud')
                    if (data.object.length > 0) {
                        const pagosFecha = await Pagos.insertMany(data.object); 
                        console.log("Se enviaron datos para las fechas indicadas.");
                      } else {
                        console.log("No hay datos disponibles para las fechas indicadas.");
                      }
                     
                  
                    
                } catch (error) {
                    console.error("Error al ejecutar el cron job:", error);
                }
            });
        }

    listen(){        
        this.app.listen(this.port, ()=>{
            console.log('Servidor corriendo en el puerto', this.port)
        })
    }

}

module.exports = Server;

