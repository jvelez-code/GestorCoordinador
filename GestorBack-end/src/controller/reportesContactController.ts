import { Request, Response } from 'express';


const c = require('../config/configBd');
const { Pool } = require('pg');

// const configes ={
//     host: '10.1.1.7',
//     //host: '10.1.1.25',
//     user: 'postgres',
//     password: '' ,
//     database: 'gestorclientes',
//     //database: 'gestorclientes20210204',
//     port: '5432'
// }


/// conexiones a las bases de datos
//const poolcont = new Pool(configcont);
const poolcont = new Pool(c.config_bd_r);
const poolprod = new Pool(c.config_bd);


class ReporContact {


    static logins = async (req: Request, res: Response) => {
        res.send("Mundo")
    }


    static inicio = ((req: Request, res: Response) => {
        res.send('Hola mundo inicio');
    });


    // EMBARGOS

    static postDetalleEstadosEmb = async (req: Request, res: Response) => {
        try {
         
        let fechaInicial=req.body.fechaInicial
        let fechaFinal=req.body.fechaFinal
        let documento=req.body.documento

        // let fechaInicial= '2024-09-19 01:05:00'
        // let fechaFinal= '2024-09-19 21:05:00'
        // let documento= '1005997235'


            const response = await poolprod.query(`SELECT ee.login_agente AS usuario,lg.fecha_ini ,lg.fecha_fin,date_trunc('second',lg.fecha_fin-lg.fecha_ini) AS diferencia, lg.id_extension,lg.estado,e.descripcion AS descripcion
                FROM ask_log_estados lg,ask_estado_extension ee,ask_estado e
                WHERE lg.fecha_ini BETWEEN ($1) AND ($2)  AND lg.id_extension=ee.id_extension
                AND lg.estado=e.id_estado
                AND ee.nro_documento=($3)
                ORDER BY lg.fecha_ini`, [fechaInicial, fechaFinal, documento]);

            if (res !== undefined) {
                return res.json(response.rows);

            }

        } catch (error) {
            console.log(error);
        }
    }


    //BD CONTACT



    static postSeguimientoAgentes = async (req: Request, res: Response) => {
        try {
            //parametro de header
            //alt +96 `
            let fechaini = req.body.fechaini
            let fechafin = req.body.fechafin
            let empresa = req.body.empresa
            const response = await poolprod.query(`SELECT * from generar_estados(($1), ($2), ($3))`,[fechaini, fechafin, empresa]);
            if (res !== undefined) {
                return res.json(response.rows);
            }

        }
        catch (error) {
            console.log(error);
        }
    };

    static postGrabacionesPila = async (req: Request, res: Response) => {
        try {
            //parametro de header
            //alt +96 `
            let fechaini = req.body.fechaini
            let fechafin = req.body.fechafin
            let empresa = req.body.empresa
            const response = await poolcont.query(`select fecha_grabacion, uniqueid, concat('/p_wrk2',ruta_grabacion,nombre_grabacion) as ruta_grabacion from grabaciones_pila gp  
            where tipo_de_llamada ='Entrante'
            order by 1 desc limit 100 `);

            
            //order by 1 limit 100 `, [fechaini, fechafin, empresa]);

            if (res !== undefined) {
                return res.json(response.rows);
            }

        }
        catch (error) {
            console.log(error);
        }
    };

    

    static postFiltradosSecretaria = async (req: Request, res: Response) => {
        try {
            //parametro de header
            //alt +96 `
            let fechaini = req.body.fechaini
            let fechafin = req.body.fechafin
            let empresa = req.body.empresa

            const response = await poolcont.query(`WITH totalDevoluciones AS (
            SELECT COUNT (DISTINCT (numero_documento)) as devolucion FROM  llamada_entrante 
            WHERE fecha_hora_asterisk BETWEEN ($1) and ($2)
            AND desea_devolucion  IS TRUE AND id_agente IS NULL  AND numero_de_intentos_fallidos = 0 
            AND id_detalle_gestion IS NULL AND empresa=($3)),                  
            totalIntentos as (        
            SELECT COUNT(*) as intento FROM llamada_entrante dLlE 
            WHERE fecha_hora_asterisk BETWEEN ($1) and ($2)
            AND dLlE.empresa=($3) AND dLlE.desea_devolucion  IS TRUE 
            AND dLlE.numero_de_intentos_fallidos  < 3 AND id_detalle_gestion = 0 )
            SELECT devolucion, intento FROM totalDevoluciones CROSS JOIN totalIntentos`, [fechaini, fechafin, empresa]);

            if (res !== undefined) {
                return res.json(response.rows);
            }

        }
        catch (error) {
            console.log(error);
        }
    };




    static postIVR = async (req: Request, res: Response) => {
        try {
            //parametro de header
            //alt +96 `
            let fechaini = req.body.fechaini
            let fechafin = req.body.fechafin
            let empresa = req.body.empresa

            const response = await poolcont.query(`SELECT ivr_date::TEXT, ivr_hora,
        ivr_ide, ivr_pin, ivr_per,
        ivr_tel, ivr_state
        from call_ivr where ivr_date between ($1)
        AND ($2) ORDER BY ivr_date,ivr_hora `, [fechaini, fechafin]);

            if (res !== undefined) {
                return res.json(response.rows);
            }

        }
        catch (error) {
            console.log(error);
        }
    };



    static postDuracionEstados = async (req: Request, res: Response) => {
        try {
            //parametro de header
            //alt +96 `
            let fechaini = req.body.fechaini
            let fechafin = req.body.fechafin
            let empresa = req.body.empresa

            const response = await poolcont.query(`SELECT extensiones, agente, dias, total::time , hora_limite::time,(hora_limite-total)::time as diferencia, descripcion ,Hora FROM  (
            SELECT  ale.id_extension AS extensiones,login_agente AS agente,count(*) AS dias ,sum(fecha_fin-fecha_ini) AS total,(time '01:02:00')*count(*) AS hora_limite,
            (sum(fecha_fin-fecha_ini))-((time '01:02:00')*count(*) ) AS diferencia,descripcion,time '01:02:00' AS Hora
            FROM ASk_log_estados ale,ASk_estado,ASk_estado_extension aee
            where ale.estado=id_estado AND ale.id_extension=aee.id_extension AND fecha_ini between ($1) AND  ($2)
            AND  aee.empresa=($3) AND ale.estado in ('5')
            GROUP BY ale.id_extension,login_agente,descripcion UNION
            SELECT ale.id_extension AS extensiones,login_agente AS agente,count(*) AS dias,sum(fecha_fin-fecha_ini) AS total,(time '00:20:00')*count(*) AS hora_limite,
            (sum(fecha_fin-fecha_ini))-((time '00:20:00')*count(*) ) AS diferencia,descripcion,time '00:20:00' AS Hora
            FROM ASk_log_estados ale,ASk_estado,ASk_estado_extension aee
            where ale.estado=id_estado AND ale.id_extension=aee.id_extension AND fecha_ini between ($1) AND  ($2)
            AND  aee.empresa=($3) AND ale.estado in ('7','8')
            GROUP BY ale.id_extension,login_agente,descripcion) AS horarios
            ORDER BY dias desc,agente,diferencia desc`, [fechaini, fechafin, empresa]);

            if (res !== undefined) {
                return res.json(response.rows);
            }

        }
        catch (error) {
            console.log(error);
        }
    };




    static postllamadasporHora = async (req: Request, res: Response) => {
        try {
            //parametro de header
            //alt +96 `
            let fechaini = req.body.fechaini
            let fechafin = req.body.fechafin
            let empresa = req.body.empresa

            const response = await poolcont.query(`SELECT hora_llamada, sum(contestadas)::int AS ANSWERED,
        (count(hora_llamada)-sum(contestadas))::int AS NO_ANSWER,count(hora_llamada)::int AS TOTALES 
        FROM ( SELECT  date_part('hour',fecha_grabacion) as hora_llamada, CASE WHEN id_agente!='777777777' THEN 1 
        WHEN id_agente='777777777' THEN 0 END  contestadas from grabaciones_pila 
        where fecha_grabacion BETWEEN ($1) and ($2)  AND empresa=($3)
        AND tipo_de_llamada='Entrante' ) as t group by hora_llamada ORDER BY 1`, [fechaini, fechafin, empresa]);

            if (res !== undefined) {
                return res.json(response.rows);
            }

        }
        catch (error) {
            console.log(error);
        }
    };


    static postSecretariaVirtual = async (req: Request, res: Response) => {
        try {
            //parametro de header
            //alt +96 `
            let fechaini = req.body.fechaini
            let fechafin = req.body.fechafin
            let empresa = req.body.empresa

            const response = await poolcont.query(`SELECT fecha::TEXT, sum (total_dia) as total, SUM(cant_devueltas_dia) AS devueltas,
        SUM(cant_pendientes_dia) as pendientes,
        telefono
         FROM (
        SELECT
        count(*) as total_dia, to_date(to_char( fecha_hora, 'YYYY/MM/DD'), 'YYYY/MM/DD') AS fecha, id_asterisk,
        (SUM(CASE WHEN  fecha_devolucion IS NULL OR (to_date(to_char(fecha_devolucion, 'YYYYMMDD'), 'YYYYMMDD')<>to_date(to_char(fecha_hora, 'YYYYMMDD'), 'YYYYMMDD')) THEN 1 ELSE 0 END)) AS cant_pendientes_dia,
        (SUM(CASE WHEN (to_date(to_char(fecha_devolucion, 'YYYYMMDD'), 'YYYYMMDD')= to_date(to_char(fecha_hora, 'YYYYMMDD'), 'YYYYMMDD')) THEN 1 ELSE 0 END))   AS cant_devueltas_dia,
        MAX( id_detalle_gestion ) AS gestion,
        MAX( ruta_entrante ) AS telefono
        FROM llamada_entrante
        WHERE fecha_hora BETWEEN ($1) and ($2)
        AND desea_devolucion = 't' AND empresa=($3)
        GROUP BY to_date(to_char( fecha_hora, 'YYYY/MM/DD'), 'YYYY/MM/DD'), id_asterisk
        )AS t
        GROUP BY fecha,telefono
        ORDER BY fecha,pendientes DESC `, [fechaini, fechafin, empresa]);

            if (res !== undefined) {
                return res.json(response.rows);
            }

        }
        catch (error) {
            console.log(error);
        }
    };

    static postTmoEntranteSaliente = async (req: Request, res: Response) => {
        try {
            //parametro de header
            //alt +96 `
            let fechaini = req.body.fechaini
            let fechafin = req.body.fechafin
            let empresa = req.body.empresa
            const response = await poolcont.query(`with entrante as(
            SELECT a.agenteE AS documento,a.agente AS agente,
            a.entrante As entrante,
            SUM(a.duracionE)::time AS duracione,
            SUM(COALESCE(a.cantidadE,0)) AS cantidade
            FROM
            (SELECT c.time::date AS fecha ,
            c.tipo_de_llamada AS entrante,
            c.agent AS agenteE,
            login_Agente AS agente,
            sum(to_timestamp (t.time,'yyyy/mm/dd HH24:MI:ss')::time-to_timestamp (c.time,'yyyy/mm/dd HH24:MI:ss')::time) AS duracionE,
            count(*) as cantidadE,
            c.empresa
            FROM (
            SELECT time,callid,agent,event,empresa,tipo_de_llamada
            FROM grabaciones_pila, queue_log
            WHERE uniqueid=callid AND id_agente=agent AND fecha_grabacion 
				between ($1) and ($2)
AND  empresa=($3)
      and event='CONNECT'
            AND tipo_de_llamada='Entrante' ) AS c
            INNER JOIN (
            SELECT time,callid,agent,event,empresa,tipo_de_llamada
            FROM grabaciones_pila, queue_log
            WHERE uniqueid=callid and event IN ('COMPLETEAGENT','COMPLETECALLER','BLINDTRANSFER','ATTENDEDTRANSFER')) AS t ON c.callid=t.callid AND c.agent=t.agent
            INNER JOIN (SELECT DISTINCT(nro_documento), login_Agente
            FROM ask_estado_extension  WHERE activo=true GROUP BY  login_Agente,nro_documento) ask ON c.agent=nro_documento
            GROUP BY c.time::date,c.agent,login_Agente,c.empresa,c.tipo_de_llamada
            ORDER BY c.time::date,c.agent,login_Agente,c.empresa,c.tipo_de_llamada) as a
            GROUP  BY a.agenteE,a.agente,a.entrante
            ),
            saliente AS (
            (SELECT TO_CHAR(fecha_inicio,'YYYY-MM-DD')::TEXT AS fecha, a.id_Agente,usuario,
count(fecha_inicio) as cantidads,sum(fecha_fin-fecha_inicio)::text as duracions,
(sum(fecha_fin-fecha_inicio)/count(fecha_inicio))::text AS promedio
FROM ac_llamadas_salientes a,grabaciones_pila g, usuario u
WHERE a.uniqueid=g.uniqueid AND  a.id_agente=nro_documento 
AND  fecha_inicio between ($1) and ($2)
AND  a.empresa=($3) AND  fecha_fin is not null 
GROUP BY fecha,a.id_Agente,usuario
ORDER by promedio desc ))
            
            SELECT 
			CASE 
			WHEN documento is null  THEN id_agente
			ELSE documento
			END AS documentoFinal,
			CASE 
			WHEN agente is null  THEN usuario
			ELSE agente
			END AS agenteFinal,
			'Entrante' as entrante,cantidade::int,duracione::text,'Saliente' as saliente,
			cantidads::int,duracions::text,
			(COALESCE(cantidade,0)+COALESCE(cantidads,0)) AS catidadt,
			date_trunc('second',(SUM(COALESCE(duracione::interval ,'00:00:00')+
									 COALESCE(duracions::interval,'00:00:00'))))::text AS duraciont,
			date_trunc('second',(SUM(COALESCE(duracione::interval ,'00:00:00')+
			                         (COALESCE(duracions::interval,'00:00:00'))))/(COALESCE(cantidade,0)+COALESCE(cantidads,0)))::text  AS promedio
            FROM entrante e FULL JOIN saliente s
            ON e.documento=s.id_agente
			GROUP BY documento,id_agente,agente,usuario,entrante,cantidade,duracione,duracione,
			cantidads,duracions
			ORDER BY promedio DESC `, [fechaini, fechafin, empresa]);

            if (res !== undefined) {
                return res.json(response.rows);
            }

        }
        catch (error) {
            console.log(error);
        }
    };







    static postLlamadasRecibidas = async (req: Request, res: Response) => {
        try {
            //parametro de header
            //alt +96 `
            let fechaini = req.body.fechaini
            let fechafin = req.body.fechafin
            let empresa = req.body.empresa
            const response = await poolcont.query(`SELECT fecha_llamada::TEXT ,
        sum(COALESCE(llamadas,'0'))-sum(COALESCE(positiva,'0'))-sum(COALESCE(negativas,'0'))-sum(COALESCE(no_atendidas,'0')) AS no_calificadas,
        sum(COALESCE(positiva,'0')) AS calif_positiva,
        sum(COALESCE(negativas,'0')) AS calif_negativo,
        sum(COALESCE(llamadas,'0'))-sum(COALESCE(no_atendidas,'0'))AS atendidas,
        sum(COALESCE(llamadas,'0')) AS total_llamadas,linea_servicio as telefono FROM
        (SELECT date(fecha_grabacion) AS fecha_llamada ,COUNT(uniqueid) AS llamadas , CASE WHEN calificacion =1 THEN 1 END AS positiva,CASE WHEN calificacion =2 THEN 1 END AS negativas,
        CASE WHEN id_agente='777777777' THEN 1 END AS no_atendidas, linea_servicio FROM
        (SELECT fecha_grabacion,uniqueid,calificacion,linea_servicio,id_agente
        from grabaciones_pila gp, queue_log
        WHERE uniqueid=callid
        AND fecha_grabacion BETWEEN ($1) and ($2)
        AND tipo_de_llamada='Entrante' AND id_agente!='777777777'
        AND empresa=($3) AND event IN ('COMPLETEAGENT','COMPLETECALLER','BLINDTRANSFER','ATTENDEDTRANSF')) as t
        group by fecha_grabacion,calificacion,linea_servicio,id_agente) as y
        group by fecha_llamada,TELEFONO`, [fechaini, fechafin, empresa]);

            if (res !== undefined) {
                return res.json(response.rows);
            }

        }
        catch (error) {
            console.log(error);
        }
    };

    static postCalificacionServicio = async (req: Request, res: Response) => {
        try {
            //parametro de header
            //alt +96 `
            let fechaini = req.body.fechaini
            let fechafin = req.body.fechafin
            let empresa = req.body.empresa
            const response = await poolcont.query(`SELECT gp.uniqueid AS idASterisk,
        tp.tipo_doc AS tipo_doc,
        CASE WHEN gp.calificacion=1 THEN 'POSITIVA' WHEN  gp.calificacion=2 THEN 'NEGATIVA'
        WHEN gp.calificacion=0  THEN 'NO CALIFICADA'  END AS calificacion,
        lle.numero_documento AS numero_documento,
        gp.id_agente AS documentoAgente,
        ask.login_agente AS agente
        FROM grabaciones_pila gp
        INNER JOIN llamada_entrante lle on gp.uniqueid=lle.id_Asterisk
        INNER JOIN tipo_documento tp on tp.id= lle.tipo_documento
        INNER JOIN ask_estado_extension ask on ask.nro_documento=gp.id_Agente
        WHERE gp.fecha_grabacion BETWEEN  ($1) and ($2) AND gp.empresa= ($3)
        AND gp.id_agente!='777777777' AND tipo_de_llamada='Entrante' and activo=true
        ORDER BY gp.fecha_grabacion`, [fechaini, fechafin, empresa]);

            if (res !== undefined) {
                return res.json(response.rows);
            }

        }
        catch (error) {
            console.log(error);
        }
    };



    static postReporteTmoSaliente = async (req: Request, res: Response) => {
        try {
            //parametro de header
            //alt +96 `
            let fechaini = req.body.fechaini
            let fechafin = req.body.fechaFinal
            let empresa = req.body.empresa

            const response = await poolcont.query(`SELECT TO_CHAR(fecha_inicio,'YYYY-MM-DD')::TEXT AS fecha, a.id_Agente AS agente
        ,usuario as login, count(fecha_inicio) as cantidad,sum(fecha_fin-fecha_inicio)::text as duracion,
        (sum(fecha_fin-fecha_inicio)/count(fecha_inicio))::text AS segundos
        FROM ac_llamadas_salientes a,grabaciones_pila g, usuario u
        WHERE a.uniqueid=g.uniqueid AND  a.id_agente=nro_documento 
        AND  fecha_inicio between ($1) AND ($2)
        AND  a.empresa=($3) AND  fecha_fin is not null 
        GROUP BY fecha,a.id_Agente,usuario
        ORDER by segundos desc `
                , [fechaini, fechafin, empresa]);

            if (res !== undefined) {
                return res.json(response.rows);
            }

        }
        catch (error) {
            console.log(error);
        }
    };

    static postDevolucionFiltrada = async (req: Request, res: Response) => {
        try {
            //parametro de header
            //alt +96 `
            let fechaini = req.body.fechaini
            let fechafin = req.body.fechafin
            let empresa = req.body.empresa
            const response = await poolcont.query(`SELECT  empresa,id_asterisk,ll.id_Detalle_gestion,tipo_documento as tipo_doc, numero_documento,  CASE WHEN fecha_devolucion IS NOT NULL THEN 'DEVUELTA' ELSE 'PENDIENTE' END TIPO_GESTION,
        numero_devolucion, numero_origen, fecha_hora, fecha_devolucion,numero_de_intentos_fallidos AS intentos,
        gd.usuario AS usuario,
        intento1,intento2,intento3
        FROM llamada_entrante ll
        LEFT JOIN detallegestionDevolucion gd ON ll.id_Detalle_gestion=gd.id_Detalle_gestion
        WHERE desea_devolucion = 't'
        AND ll.empresa=($3)
        AND fecha_hora BETWEEN  ($1) AND ($2)
        ORDER BY fecha_hora DESC`, [fechaini, fechafin, empresa]);

            if (res !== undefined) {
                return res.json(response.rows);
            }

        }
        catch (error) {
            console.log(error);
        }
    };



    static postReporteTmoDetallado = async (req: Request, res: Response) => {
        try {
            //parametro de header
            //alt +96 `
            let fechaini = req.body.fechaini
            let fechafin = req.body.fechafin
            let empresa = req.body.empresa
            let usuario = req.body.usuario

            console.log(fechaini);
            console.log(fechafin);
            console.log(empresa);
            console.log(usuario);
            const response = await poolcont.query(`SELECT c.time::TEXT AS fechainicio ,c.callid AS id,
        login_agente AS agente ,numero_cliente AS telCliente,
        SUBSTRING((to_timestamp (t.time,'yyyy/mm/dd HH24:MI:ss')::time-to_timestamp (c.time,'yyyy/mm/dd HH24:MI:ss')::time)::TEXT,0,9) AS duracion
        FROM (
        SELECT time,callid,agent,event,numero_cliente,login_Agente
        FROM grabaciones_pila g, queue_log q, ask_estado_extension a
        WHERE uniqueid=callid  AND agent=nro_documento
        AND id_agente=agent AND fecha_grabacion BETWEEN ($1)  AND ($2) 
        AND g.empresa=($3)  AND tipo_de_llamada='Entrante' AND event='CONNECT' AND activo=true 
            
        ) AS c
        INNER JOIN (
        SELECT time,callid,agent,event
        FROM grabaciones_pila, queue_log
        WHERE uniqueid=callid AND event IN ('COMPLETEAGENT','COMPLETECALLER','BLINDTRANSFER','ATTENDEDTRANSFER')) AS t
        ON c.callid=t.callid AND c.agent=t.agent
        ORDER BY c.time::TEXT`
                , [fechaini, fechafin, empresa]);

            //AND login_agente=($4)

            if (res !== undefined) {
                return res.json(response.rows);
            }

        }
        catch (error) {
            console.log(error);
        }
    };


    static postReporteTmo = async (req: Request, res: Response) => {
        try {
            //parametro de header
            //alt +96 `
            let fechaini = req.body.fechaini
            let fechafin = req.body.fechafin
            let empresa = req.body.empresa
            console.log(fechaini);
            console.log(fechafin);
            console.log(empresa);
            const response = await poolcont.query(`SELECT fecha::text, documento, agente, duracionLlamadas, 
        cantidadGrabaciones, segundos FROM (
        SELECT c.time::Date AS fecha ,
         c.agent AS documento,
         login_Agente AS agente,
         SUBSTRING(sum(to_timestamp (t.time,'yyyy/mm/dd HH24:MI:ss')::time-to_timestamp (c.time,'yyyy/mm/dd HH24:MI:ss')::time)::TEXT,0,9) AS duracionLlamadas,
         count(*) as cantidadGrabaciones,
         SUBSTRING((sum(to_timestamp (t.time,'yyyy/mm/dd HH24:MI:ss')::time-to_timestamp (c.time,'yyyy/mm/dd HH24:MI:ss')::time)/count(*))::TEXT,0,9) AS segundos
         FROM (
         SELECT time,callid,agent,event
         FROM grabaciones_pila, queue_log
         WHERE uniqueid=callid AND id_agente=agent AND fecha_grabacion BETWEEN ($1)  AND ($2)
         AND empresa=($3) AND event='CONNECT' AND id_agente!='777777777'
         AND tipo_de_llamada='Entrante') AS c
         INNER JOIN (
         SELECT time,callid,agent,event
         FROM grabaciones_pila, queue_log
         WHERE uniqueid=callid AND event IN ('COMPLETEAGENT','COMPLETECALLER','BLINDTRANSFER','ATTENDEDTRANSFER')) AS t ON c.callid=t.callid AND c.agent=t.agent
         INNER JOIN (SELECT DISTINCT(nro_documento), login_Agente
         FROM ask_estado_extension  WHERE activo=true GROUP BY  login_Agente,nro_documento) ask ON c.agent=nro_documento
         GROUP BY c.time::Date,c.agent,login_Agente
         ORDER BY segundos DESC) AS tmo`, [fechaini, fechafin, empresa]);

            if (res !== undefined) {
                return res.json(response.rows);
            }

        }
        catch (error) {
            console.log(error);
        }
    };

    static postLlamadasPerdidas = async (req: Request, res: Response) => {
        try {
            let now = new Date();
            console.log('La fecha actual es', now);
            console.log('UNIX time:', now.getTime());
            let fechaini = req.body.fechaini
            let fechafin = req.body.fechafin
            let empresa = req.body.empresa
            console.log(fechaini);
            console.log(fechafin);
            console.log(empresa);
            const response = await poolcont.query(`SELECT  * FROM  (SELECT l.fecha_hora AS fecha, l.numero_origen AS numero, 
        l.ruta_entrante AS linea FROM queue_log,llamada_entrante l,grabaciones_pila gp WHERE callid=id_asterisk  
        AND callid=uniqueid AND fecha_hora between '2023-09-04 01:00:00' AND '2023-09-04 20:00:00' AND event='ABANDON' 
        AND gp.empresa='CONTACT' EXCEPT SELECT l.fecha_hora AS fecha, l.numero_origen AS numero, 
        l.ruta_entrante AS linea  FROM queue_log,llamada_entrante l WHERE id_asterisk = callid 
        AND fecha_hora between '2023-09-04 01:00:00' AND '2023-09-04 20:00:00' AND event='CONNECT') AS a ORDER BY fecha`);

            if (res !== undefined) {
                return res.json(response.rows);
            }

        }
        catch (error) {
            console.log(error);
        }
    };


    //Monitoreo

    static potsMonitoreo = async (req: Request, res: Response) => {
        // res.send('Hola mundo post final');
        try {
            let empresa = req.body.empresa;

            let date = new Date();
            date.setDate(date.getDate() - 5);
            const formatDate = (date: Date) => {
                let formatted_date = date.getFullYear() + "-" + (date.getMonth() + 1) +
                    "-" + date.getDate();
                return formatted_date;
            }
            let fechaFinal = formatDate(date);
            const response = await poolcont.query(`SELECT id_extension, login_agente, descripcion ,
        numero_origen,fechahora_inicio_Estado ,  SUBSTRING((now()-fechahora_inicio_Estado)::TEXT,0,9) as total
        FROM ask_estado_extension aee ,ask_estado ae
        WHERE aee.estado=ae.id_estado and cast(fechahora_inicio_Estado as date)>=($1)
        AND empresa=($2) ORDER BY ae.id_estado,5 `, [fechaFinal, empresa]);
            if (res !== undefined) {
                return res.json(response.rows);
   }
        }
        catch (error) {
            console.log(error);
        }
    };


    //DB ASTERISK_PAGOSGDE

    static postLlamadasFueradeHorario = async (req: Request, res: Response) => {
        try {
            //parametro de header
            //alt +96 `
            let fechaini = req.body.fechaini
            let fechafin = req.body.fechafin
            let empresa = req.body.empresa

            const response = await poolcont.query(`SELECT id_asterisk, ruta_entrante, fecha_hora_asterisk, tipo_doc, numero_documento, numero_origen, date_part('dow',fecha_hora_asterisk) as dia, fuerahorario
            FROM (
            SELECT id_asterisk, ruta_entrante, fecha_hora_asterisk, tipo_documento, numero_documento, numero_origen, desea_devolucion, numero_devolucion, fecha_devolucion, date_part('dow',fecha_hora_asterisk),
                CASE
                      WHEN date_part('dow',fecha_hora_asterisk) IN ('1','2','3','4','5') AND fecha_hora_asterisk::time NOT BETWEEN '08:00' AND  '18:00' THEN 0
                         WHEN date_part('dow',fecha_hora_asterisk) IN ('6')  AND fecha_hora_asterisk::time NOT BETWEEN '08:00' AND '12:00' THEN 0
                     WHEN date_part('dow',fecha_hora_asterisk) IN ('0') THEN 0
                     ELSE 1 END
                AS fuerahorario
            FROM
            (SELECT * FROM llamada_entrante
            LEFT JOIN festivos ON (llamada_entrante.fecha_hora_asterisk::date = festivos.fecha)
            WHERE fecha_hora_asterisk BETWEEN ($1) AND ($2)
            AND empresa= ($3)
            ORDER BY fecha_hora_asterisk
            ) AS subReporte) AS reporteFinal
            INNER JOIN tipo_documento ON (tipo_documento = tipo_documento.id)
            WHERE fuerahorario = 0`, [fechaini, fechafin, empresa]);

            if (res !== undefined) {
                return res.json(response.rows);
            }

        }
        catch (error) {
            console.log(error);
        }
    };

    static postLlamadasFueradeHorarioEventual = async (req: Request, res: Response) => {
        try {
            //parametro de header
            //alt +96 `
            let fechaini = req.body.fechaini
            let fechafin = req.body.fechafin
            let empresa = req.body.empresa
            let horaLista = req.body.horaEven
            console.log(fechaini);
            console.log(fechafin);
            console.log(horaLista);
            const response = await poolcont.query(`SELECT id_asterisk, ruta_entrante, fecha_hora_asterisk, tipo_doc, numero_documento, numero_origen, date_part('dow',fecha_hora_asterisk) as dia, fuerahorario
            FROM (
            SELECT id_asterisk, ruta_entrante, fecha_hora_asterisk, tipo_documento, numero_documento, numero_origen, desea_devolucion, numero_devolucion, fecha_devolucion, date_part('dow',fecha_hora_asterisk),
                CASE
                      WHEN date_part('dow',fecha_hora_asterisk) IN ('1','2','3','4','5') AND fecha_hora_asterisk::time NOT BETWEEN '08:00' AND  ($4) THEN 0
                         WHEN date_part('dow',fecha_hora_asterisk) IN ('6')  AND fecha_hora_asterisk::time NOT BETWEEN '08:00' AND '12:00' THEN 0
                     WHEN date_part('dow',fecha_hora_asterisk) IN ('0') THEN 0
                     ELSE 1 END
                AS fuerahorario
            FROM
            (SELECT * FROM llamada_entrante
            LEFT JOIN festivos ON (llamada_entrante.fecha_hora_asterisk::date = festivos.fecha)
            WHERE fecha_hora_asterisk BETWEEN ($1) AND ($2)
            AND empresa= ($3)
            ORDER BY fecha_hora_asterisk
            ) AS subReporte) AS reporteFinal
            INNER JOIN tipo_documento ON (tipo_documento = tipo_documento.id)
            WHERE fuerahorario = 0`, [fechaini, fechafin, empresa, horaLista]);

            if (res !== undefined) {
                return res.json(response.rows);
            }

        }
        catch (error) {
            console.log(error);
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
            console.log(fechaini);
            console.log(fechafin);
            console.log(empresa);
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
export default ReporContact;
