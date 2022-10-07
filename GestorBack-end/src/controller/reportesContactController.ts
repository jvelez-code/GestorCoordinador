import { Request , Response } from 'express';

const { Pool }= require('pg');

// const configes ={
//     host: '10.1.1.7',
//     //host: '10.1.1.25',
//     user: 'postgres',
//     password: '' ,
//     database: 'gestorclientes',
//     //database: 'gestorclientes20210204',
//     port: '5432'
// }

const configcont ={
    host: '10.1.1.7',
    //host: '10.1.1.25',
    user: 'postgres',
    password: '' ,
    database: 'contact_center',
    //database: 'asterisk_pagosgde',
    //database: 'contact_center20210204',
    port: '5432'
}

/// conexiones a las bases de datos
//const pool = new Pool(configes);
const poolcont = new Pool(configcont);

class ReporContact {


    static logins = async (req: Request, res: Response)=>{
        res.send("Mundo")
    }


    static inicio =((req: Request, res:Response ) => {
    res.send('Hola mundo inicio');
});



//BD CONTACT



static postIVR = async (req: Request, res:Response ) =>{
    try {
        //parametro de header
        //alt +96 `
        let fechaini=req.body.fechaini
        let fechafin=req.body.fechafin   
        let empresa=req.body.empresa
        
        const response = await poolcont.query(`SELECT ivr_date::TEXT, ivr_hora,
        ivr_ide, ivr_pin, ivr_per,
        ivr_tel, ivr_state
        from call_ivr where ivr_date between ($1)
        AND ($2) ORDER BY ivr_date,ivr_hora `,[fechaini ,fechafin] );

    if (res !== undefined) {
        return res.json(response.rows);        
      }
      
    } 
    catch (error) {
        console.log(error); 
    } 
};



static postDuracionEstados = async (req: Request, res:Response ) =>{
    try {
        //parametro de header
        //alt +96 `
        let fechaini=req.body.fechaini
        let fechafin=req.body.fechafin   
        let empresa=req.body.empresa
        
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
            ORDER BY dias desc,agente,diferencia desc`,[fechaini ,fechafin, empresa] );

    if (res !== undefined) {
        return res.json(response.rows);        
      }
      
    } 
    catch (error) {
        console.log(error); 
    } 
};




static postllamadasporHora = async (req: Request, res:Response ) =>{
    try {
        //parametro de header
        //alt +96 `
        let fechaini=req.body.fechaini
        let fechafin=req.body.fechafin   
        let empresa=req.body.empresa
        
        const response = await poolcont.query(`SELECT hora_llamada, sum(contestadas)::int AS ANSWERED,
        (count(hora_llamada)-sum(contestadas))::int AS NO_ANSWER,count(hora_llamada)::int AS TOTALES 
        FROM ( SELECT  date_part('hour',fecha_grabacion) as hora_llamada, CASE WHEN id_agente!='777777777' THEN 1 
        WHEN id_agente='777777777' THEN 0 END  contestadas from grabaciones_pila 
        where fecha_grabacion BETWEEN ($1) and ($2)  AND empresa=($3)
        AND tipo_de_llamada='Entrante' ) as t group by hora_llamada ORDER BY 1`,[fechaini ,fechafin, empresa] );

    if (res !== undefined) {
        return res.json(response.rows);        
      }
      
    } 
    catch (error) {
        console.log(error); 
    } 
};


static postSecretariaVirtual = async (req: Request, res:Response ) =>{
    try {
        //parametro de header
        //alt +96 `
        let fechaini=req.body.fechaini
        let fechafin=req.body.fechafin   
        let empresa=req.body.empresa
        
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
        ORDER BY fecha,pendientes DESC `,[fechaini ,fechafin, empresa] );

    if (res !== undefined) {
        return res.json(response.rows);        
      }
      
    } 
    catch (error) {
        console.log(error); 
    } 
};

static postTmoEntranteSaliente = async (req: Request, res:Response ) =>{
    try {
        //parametro de header
        //alt +96 `
        let fechaini=req.body.fechaini
        let fechafin=req.body.fechafin   
        let empresa=req.body.empresa
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
            WHERE uniqueid=callid AND id_agente=agent AND fecha_grabacion BETWEEN ($1) and ($2)
            AND empresa=($3) and event='CONNECT'
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
            saliente AS
            (SELECT b.agenteS AS documento,b.login AS agente,
            b.Saliente As Saliente,SUM(b.duracionS) AS duracions,
            SUM(COALESCE(b.cantidadS,0)) AS cantidads
            FROM
            (SELECT TO_CHAR(fecha_grabacion,'YYYY-MM-DD')AS fecha,
            tipo_de_llamada AS Saliente,
            id_Agente AS agenteS,
            login_agente AS login ,
            (sum(duracion)::text||' secs')::interval AS duracions,
            COUNT(numero_cliente) AS cantidadS
            FROM grabaciones_pila gp , ask_estado_extension ask
            WHERE id_agente=nro_documento
            AND tipo_de_llamada='Saliente'  AND fecha_grabacion
            BETWEEN ($1) and ($2)
            and gp.empresa=($3) AND activo=true
            GROUP BY FECHA,tipo_de_llamada,id_Agente,login_agente,duracion
            ) AS B
            GROUP  BY b.agenteS,b.login,b.Saliente)
            
            SELECT a.documento AS documento,a.agente AS agente,
            CONCAT(u.primer_nombre,' ',u.segundo_nombre,' ',u.primer_apellido,' ',u.segundo_apellido) AS nombreA,
            a.entrante As entrante,(SUM(COALESCE(a.duracionE,'00:00:00')))::time AS duracione,
            SUM(COALESCE(a.cantidadE,0)) AS cantidade,
            b.documento AS documentos,b.agente AS agenteS,
            b.Saliente As Saliente, (SUM(COALESCE(b.duracions,'00:00:00')))::time AS duracions,
            SUM(COALESCE(b.cantidadS,0)) AS cantidadS,
            (SUM(COALESCE(a.duracionE,'00:00:00')+COALESCE(b.duracions,'00:00:00')))::time AS totalTiempo,
            SUM(COALESCE(a.cantidadE,0)+COALESCE(b.cantidads,0)) AS totalCantidad,
            (date_trunc('second',(SUM(COALESCE(a.duracionE,'00:00:00')+COALESCE(b.duracions,'00:00:00')) )/
            (SUM(COALESCE(a.cantidadE,0)+COALESCE(b.cantidads,0)))))::time AS totalDuracion
            
            FROM entrante a FULL JOIN saliente b
            ON a.documento=b.documento
            LEFT JOIN usuario u ON a.documento=u.nro_documento
            
            GROUP BY a.documento,a.agente,a.entrante,
            b.documento,b.agente,b.Saliente,
            u.primer_nombre,u.segundo_nombre,primer_apellido,segundo_apellido
            ORDER BY totalDuracion DESC`,[fechaini ,fechafin, empresa] );

    if (res !== undefined) {
        return res.json(response.rows);        
      }
      
    } 
    catch (error) {
        console.log(error); 
    } 
};







static postLlamadasRecibidas = async (req: Request, res:Response ) =>{
    try {
        //parametro de header
        //alt +96 `
        let fechaini=req.body.fechaini
        let fechafin=req.body.fechafin   
        let empresa=req.body.empresa
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
        group by fecha_llamada,TELEFONO`,[fechaini ,fechafin, empresa] );

    if (res !== undefined) {
        return res.json(response.rows);        
      }
      
    } 
    catch (error) {
        console.log(error); 
    } 
};

static postCalificacionServicio = async (req: Request, res:Response ) =>{
    try {
        //parametro de header
        //alt +96 `
        let fechaini=req.body.fechaini
        let fechafin=req.body.fechafin   
        let empresa=req.body.empresa
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
        ORDER BY gp.fecha_grabacion`,[fechaini ,fechafin, empresa] );

    if (res !== undefined) {
        return res.json(response.rows);        
      }
      
    } 
    catch (error) {
        console.log(error); 
    } 
};



static postReporteTmoSaliente = async (req: Request, res:Response ) =>{
    try {
        //parametro de header
        //alt +96 `
        let fechaini=req.body.fechaini
        let fechafin=req.body.fechafin   
        let empresa=req.body.empresa

        const response = await poolcont.query(`SELECT TO_CHAR(fecha_grabacion,'YYYY-MM-DD')::TEXT AS fecha,
        id_Agente AS agente,
        login_agente AS login ,
        SUBSTRING((sum(duracion)::text||' secs')::TEXT,0,9) AS duracion,
        COUNT(numero_cliente) AS cantidad,
        TO_CHAR(((sum(duracion)::text||' secs')::interval/COUNT(numero_cliente)),'MI:SS')  AS segundos
        FROM grabaciones_pila gp LEFT JOIN ask_estado_extension ON id_agente=ltrim(nro_documento,'Agent/')
        WHERE  tipo_de_llamada='Saliente'  AND fecha_grabacion BETWEEN ($1) and ($2)
        and gp.empresa=($3)
        GROUP BY FECHA,id_Agente,login_agente
        ORDER BY cantidad desc `
        ,[fechaini ,fechafin, empresa] );

    if (res !== undefined) {
        return res.json(response.rows);        
      }
      
    } 
    catch (error) {
        console.log(error); 
    } 
};

static postDevolucionFiltrada = async (req: Request, res:Response ) =>{
    try {
        //parametro de header
        //alt +96 `
        let fechaini=req.body.fechaini
        let fechafin=req.body.fechafin   
        let empresa=req.body.empresa
        const response = await poolcont.query(`SELECT  empresa,id_asterisk,ll.id_Detalle_gestion,tipo_documento as tipo_doc, numero_documento,  CASE WHEN fecha_devolucion IS NOT NULL THEN 'DEVUELTA' ELSE 'PENDIENTE' END TIPO_GESTION,
        numero_devolucion, numero_origen, fecha_hora, fecha_devolucion,numero_de_intentos_fallidos AS intentos,
        gd.usuario AS usuario,
        intento1,intento2,intento3
        FROM llamada_entrante ll
        LEFT JOIN detallegestionDevolucion gd ON ll.id_Detalle_gestion=gd.id_Detalle_gestion
        WHERE desea_devolucion = 't'
        AND ll.empresa=($3)
        AND fecha_hora BETWEEN  ($1) AND ($2)
        ORDER BY fecha_hora DESC`,[fechaini ,fechafin, empresa] );

    if (res !== undefined) {
        return res.json(response.rows);        
      }
      
    } 
    catch (error) {
        console.log(error); 
    } 
};



static postReporteTmoDetallado = async (req: Request, res:Response ) =>{
    try {
        //parametro de header
        //alt +96 `
        let fechaini=req.body.fechaini
        let fechafin=req.body.fechafin   
        let empresa=req.body.empresa
        let usuario=req.body.usuario

        console.log( fechaini );
        console.log( fechafin );
        console.log( empresa );
        console.log( usuario );
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
        ,[fechaini ,fechafin, empresa] );

        //AND login_agente=($4)

    if (res !== undefined) {
        return res.json(response.rows);        
      }
      
    } 
    catch (error) {
        console.log(error); 
    } 
};


static postReporteTmo = async (req: Request, res:Response ) =>{
    try {
        //parametro de header
        //alt +96 `
        let fechaini=req.body.fechaini
        let fechafin=req.body.fechafin   
        let empresa=req.body.empresa
        console.log( fechaini );
        console.log( fechafin );
        console.log( empresa );
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
         ORDER BY segundos DESC) AS tmo`,[fechaini , fechafin, empresa] );

    if (res !== undefined) {
        return res.json(response.rows);        
      }
      
    } 
    catch (error) {
        console.log(error); 
    } 
};
    //Monitoreo

    static potsMonitoreo = async (req: Request, res:Response ) =>{
       // res.send('Hola mundo post final');
        try {

            let empresa=req.body.empresa;  

            let date = new Date();
            const formatDate = (date: Date)=>{
                let formatted_date = date.getFullYear() + "-" + (date.getMonth() + 1) + 
                "-" + date.getDate() ;
                return formatted_date;
            }
            let fechaFinal=formatDate(date);
        const response = await poolcont.query(`SELECT id_extension, login_agente, descripcion ,
        numero_origen,fechahora_inicio_Estado ,  SUBSTRING((now()-fechahora_inicio_Estado)::TEXT,0,9) as total
        FROM ask_estado_extension aee ,ask_estado ae
        WHERE aee.estado=ae.id_estado and cast(fechahora_inicio_Estado as date)=($1)
        AND empresa=($2) ORDER BY ae.id_estado,5 desc`,[fechaFinal, empresa ]);
        if (res !== undefined) {
            return res.json(response.rows);
            
          }          
        } 
        catch (error) {
            console.log(error); 
        } 
    };


    //DB ASTERISK_PAGOSGDE

    static postLlamadasFueradeHorario = async (req: Request, res:Response ) =>{
        try {
            //parametro de header
            //alt +96 `
            let fechaini=req.body.fechaini
            let fechafin=req.body.fechafin   
            let empresa=req.body.empresa
            
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
            WHERE fuerahorario = 0`,[fechaini , fechafin, empresa] );
    
        if (res !== undefined) {
            return res.json(response.rows);        
          }
          
        } 
        catch (error) {
            console.log(error); 
        } 
    };

    static postLlamadasFueradeHorarioEventual = async (req: Request, res:Response ) =>{
        try {
            //parametro de header
            //alt +96 `
            let fechaini=req.body.fechaini
            let fechafin=req.body.fechafin  
            let empresa=req.body.empresa
            let horaLista=req.body.horaEven
            console.log( fechaini );
            console.log( fechafin );
            console.log( horaLista );
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
            WHERE fuerahorario = 0`,[fechaini , fechafin, empresa, horaLista ] );
    
        if (res !== undefined) {
            return res.json(response.rows);        
          }
          
        } 
        catch (error) {
            console.log(error); 
        } 
    };


    static postLlamadasCalificadasGDE = async (req: Request, res:Response ) =>{
        try {
            //parametro de header
            //alt +96 `
            let fechaini=req.body.fechaini
            let fechafin=req.body.fechafin  
            let empresa=req.body.empresa
            let horaLista=req.body.horaLista
            console.log( fechaini );
            console.log( fechafin );
            console.log( empresa );
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
            ORDER BY gp.fecha_grabacion`,[fechaini , fechafin, empresa ] );
    
        if (res !== undefined) {
            return res.json(response.rows);        
          }
          
        } 
        catch (error) {
            console.log(error); 
        } 
    };



//DB GESTOR



// static getReportesprueba = async (req: Request, res:Response ) =>{
//     try {
//         //const response = await pool.query(`SELECT * FROM reportes WHERE estado=TRUE AND empresas like '%ASISTIDA%'`);
//         const response = await pool.query(`SELECT * FROM reportes WHERE id IN ('19','25','10','9','30','31','50','54','12')`);
//     if (res !== undefined) {
//         return res.json(response.rows);
//         pool.close();
//       }
      
//     } 
//     catch (error) {
//         console.log(error); 
//     } 
//  }


}
 export default ReporContact;
