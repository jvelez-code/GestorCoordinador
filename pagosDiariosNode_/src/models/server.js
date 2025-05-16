const express = require('express')
var cors = require('cors')
const connectDB = require('../config/configDB');
const moment = require('moment');
const { correosMongo } = require('../controllers/sendEmail');

const cron = require('node-cron');
const authToken = require('../controllers/authToken');
const dataPagos = require('../controllers/dataPagos')
const Pagos = require('../entitys/pagos');


class Server {



    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.pagosPath = '/api/pagosDiarios'
        this.middlewares();
        this.routes();
        this.cronJobs();

    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    routes() {
        connectDB().then(() => { })
        this.app.use(this.pagosPath, require('../routes/pagos'))
    }

    cronJobs() {

        cron.schedule('0 10 * * *', async () => {
            console.log('Ejecutando tarea programada a las 10:00 AM');
            const fechaActual = moment().subtract(1, 'days').format('YYYY-MM-DD');
            //const fechaActual =  moment('2025-03-24').format('YYYY-MM-DD');          
            try {
                console.log(`Fecha actual: ${fechaActual}`);

                const token = await authToken.obtenerToken();
                if (!token) throw new Error("No se pudo obtener el token.");

                const data = await dataPagos.obtenerDatosPagos(token, fechaActual, fechaActual);
                //console.log("Datos obtenidos:", data);  // Agregado para depuración
                await dataPagos.limpiarPagos();

                if (!data || !data.object) {
                    throw new Error("Respuesta inválida al obtener datos.");
                }

                if (data.object === "") {
                    console.log("No se encontraron registros.");
                } else {
                    // Verifica que `data.object` sea un arreglo antes de continuar
                    if (Array.isArray(data.object) && data.object.length > 0) {
                        console.log(`${data.object.length} registros obtenidos.`);

                        try {
                            await Pagos.insertMany(data.object);
                            console.log("Se enviaron datos para las fechas indicadas.");

                        } catch (insertError) {
                            console.error("Error al insertar los pagos:", insertError.message);
                            console.error(insertError.stack);
                        }
                        try {
                            const subject = "Cargue Pagos diarios a Mongose";
                            const nombre = "Jaime Vélez";
                            const mensaje = "Este es el mensaje del correo.";
                            const template = "felicitacion.html";
    
                            await correosMongo('jaimev_tec@jaimetorres.net', subject, nombre, mensaje, template);
                            console.log("Correo enviado con éxito.");
                        } catch (error) {
                            console.error("Error al enviar el correo:", error.message);
                        }
                    } else {
                        console.log("No hay datos disponibles para las fechas indicadas.");
                    }
                }



            } catch (error) {
                console.error("Error al ejecutar el cron job:", error);
                console.error(error.stack);
            }
        });
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port)
        })
    }

}

module.exports = Server;


