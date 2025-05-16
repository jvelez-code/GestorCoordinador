const express = require('express')
var cors = require('cors')
const moment = require('moment');
const { correosMongo } = require('../controllers/sendEmail');

const cron = require('node-cron');
const authToken = require('../controllers/authToken');
const dataPagos = require('../controllers/dataPagos')
const createPagosModel = require('../entitys/pagosDiarios');


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

    async routes() {
        this.pagosModel = await createPagosModel();
        this.app.use(this.pagosPath, require('../routes/pagos'))
    }

    cronJobs() {

        cron.schedule('36 17 * * *', async () => {
            console.log('Ejecutando tarea programada a las 10:00 AM');
            //const fechaActual = moment().subtract(1, 'days').format('YYYY-MM-DD');
            const fechaActual =  moment('2025-05-13').format('YYYY-MM-DD');  

            try {

                console.log(`Fecha actual: ${fechaActual}`);

                const token = await authToken.obtenerToken();
                if (!token) throw new Error("No se pudo obtener el token.");

                const data = await dataPagos.obtenerDatosPagos(token, fechaActual, fechaActual);
                console.log("Datos obtenidos:", data);

                if (data.object === "") {
                    try {
                        const subject = "Cargue Pagos Diarios";
                        const nombre = "Jaime Vélez";
                        const mensaje = `No se encontraron registros para al fecha`;
                        const template = "advertencia";
                        const email ="jaimev_tec@jaimetorres.net"

                        await correosMongo(email, subject, nombre, mensaje, template);
                        console.log("Correo enviado con éxito.");
                    } catch (error) {
                        console.error("Error al enviar el correos:", error.message);
                    }
                } else {

                    let registrar = [];
                    let eliminar = {};
                    if (Array.isArray(data.object) && data.object.length > 0) {
                        console.log(`${data.object.length} registros obtenidos.`);

                        try {
                            registrar = await this.pagosModel.insertMany(data.object);
                            console.log('Pagos Insertados:', registrar.length);

                            //await dataPagos.limpiarPagos();
                            eliminar = await this.pagosModel.deleteMany({ cantidadPagos: { $gt: 3 } });
                            console.log('Pagos eliminados:', eliminar.deletedCount);

                        } catch (insertError) {
                            console.error("Error al insertar los pagos:", insertError.message);
                            console.error(insertError.stack);
                        }
                        try {
                            const subject = "Cargue Pagos Diarios";
                            const nombre = "Jaime Vélez";
                            const mensaje = `Se registrarón ${registrar.length}, Se eliminarón ${eliminar.deletedCount}`;
                            const template = "advertencia";
                            const email ="jaimev_tec@jaimetorres.net"
    
                            await correosMongo(email, subject, nombre, mensaje, template);
                            console.log("Correo enviado con éxito.");
                        } catch (error) {
                            console.error("Error al enviar el correos:", error.message);
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


