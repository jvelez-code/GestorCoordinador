import { Request, Response } from 'express';


const c = require('../config/configBd');
const { Pool } = require('pg');
const poolcont = new Pool(c.config_bd_r);


class askEstados {


    //BD CONTACT

    static postAskEstados = async (req: Request, res: Response) => {

        const client = await poolcont.connect();
        try {
            // Inicia la transacción
            await client.query('BEGIN');
    
            let ext = req.body.idExtension;
    
            // Actualiza ask_estado_extension
            await client.query(`
                UPDATE ask_estado_extension 
                SET estado = '1', numero_origen = NULL, fechahora_inicio_estado = NOW() 
                WHERE id_extension = $1
            `, [ext]);
    
            // Obtiene el máximo id_log
            const idLog = await client.query(`
                SELECT MAX(id_log) 
                FROM ask_log_estados 
                WHERE id_extension = $1
            `, [ext]);

              // Obtiene el máximo id_log
              const idLogFinal = await client.query(`
              SELECT MAX(id_log) + 1
              FROM ask_log_estados`);

            let  maxIdLogFinal=idLogFinal.rows[0]['?column?']
    
            // Actualiza ask_log_estados
            
           
                let maxIdLog = idLog.rows[0].max;

                await client.query(`
                    UPDATE ask_log_estados 
                    SET fecha_fin = NOW() 
                    WHERE id_log = $1
                `, [maxIdLog]);
     
    
            /*Inserta un nuevo registro en ask_log_estados*/
            await client.query(`
                INSERT INTO ask_log_estados (id_log, id_extension, fecha_ini, estado) 
                VALUES ($1, $2,  NOW(), '1')
            `, [maxIdLogFinal, ext]);


    
            // Confirma la transacción
            await client.query('COMMIT');
            res.status(200).json({ id_extension: ext });
    
        } catch (error) {
            // Si hay un error, se revierte la transacción
            await client.query('ROLLBACK');
            console.error('Error en postAskEstados:', error);
        } finally {
            // Libera el cliente de la conexión
            client.release();
        }
    };
    

    
   static postLlamadasCalificadasGDE = async (req: Request, res: Response) => {
        try {
            //parametro de header
            //alt +96 `
            let fechaini = req.body.fechaini
            let fechafin = req.body.fechafin
            let empresa = req.body.empresa
            let horaLista = req.body.horaLista

            const response = await poolcont.query(`SELECT gp.fecha_grabacion AS fecha,
            cdr.uniqueid AS idASterisk,
            gp.ruta_grabacion AS ruta,
            CASE WHEN cdr.call_poll=1 THEN 'POSITIVA' WHEN  cdr.call_poll=2 THEN 'NEGATIVA'
            WHEN cdr.call_poll IS NULL  THEN 'NO CALIFICADA'  END AS calificacion,
            gp.numero_cliente AS telefono,
            ask.login_agente AS agente
            FROM grabaciones_pila gp left join  cdr cdr on gp.uniqueid=cdr.uniqueid
            LEFT JOIN llamada_entrante lle on cdr.uniqueid=lle.id_Asterisk
            LEFT JOIN ask_estado_extension ask ON gp.id_agente=ltrim(ask.nro_documento,'Agent/')
            WHERE gp.fecha_grabacion BETWEEN  ($1) AND ($2)
            AND gp.id_agente!='777777777' AND tipo_de_llamada='Entrante'
            and gp.empresa= ($3) and ask.login_agente!='JFERNANDEZ_GDE'
            AND cdr.lAStapp='Queue'
            ORDER BY gp.fecha_grabacion`, [fechaini, fechafin, empresa]);

            if (res !== undefined) {
                return res.json(response.rows);
            }

        }
        catch (error) {
            console.log(error);
        }
    };

}
export default askEstados;
