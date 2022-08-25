import { Request , Response } from 'express';

const { Pool }= require('pg');

const configes ={
    host: '10.1.1.7',
    //host: '10.1.1.25',
    user: 'postgres',
    password: '' ,
    database: 'gestorclientes',
    //database: 'gestorclientes20210204',
    port: '5432'
}

const configcont ={
    host: '10.1.1.7',
    //host: '10.1.1.25',
    user: 'postgres',
    password: '' ,
    database: 'contact_center',
    //database: 'contact_center20210204',
    port: '5432'
}

/// conexiones a las bases de datos
const pool = new Pool(configes);
const poolcont = new Pool(configcont);

class ReporContact {


    static logins = async (req: Request, res: Response)=>{
        res.send("Mundo")
    }


    static inicio =((req: Request, res:Response ) => {
    res.send('Hola mundo inicio');
});



//BD CONTACT


static postSecretariaVirtual = async (req: Request, res:Response ) =>{
    try {
        //parametro de header
        //alt +96 `
        let fechaini=req.body.fechaini
        let fechafin=req.body.fechafin   
        let empresa=req.body.empresa
        
        const response = await poolcont.query(`SELECT fecha, sum (total_dia) as total, SUM(cant_devueltas_dia) AS devueltas,
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
            SUM(a.duracionE)AS duracione,
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
            a.entrante As entrante,SUM(COALESCE(a.duracionE,'00:00:00'))AS duracione,
            SUM(COALESCE(a.cantidadE,0)) AS cantidade,
            b.documento AS documentos,b.agente AS agenteS,
            b.Saliente As Saliente, SUM(COALESCE(b.duracions,'00:00:00')) AS duracions,
            SUM(COALESCE(b.cantidadS,0)) AS cantidadS,
            SUM(COALESCE(a.duracionE,'00:00:00')+COALESCE(b.duracions,'00:00:00')) AS totalTiempo,
            SUM(COALESCE(a.cantidadE,0)+COALESCE(b.cantidads,0)) AS totalCantidad,
            date_trunc('second',(SUM(COALESCE(a.duracionE,'00:00:00')+COALESCE(b.duracions,'00:00:00')) )/
            (SUM(COALESCE(a.cantidadE,0)+COALESCE(b.cantidads,0)))) AS totalDuracion
            
            FROM entrante a FULL JOIN saliente b
            ON a.documento=b.documento
            LEFT JOIN usuario u ON a.documento=u.nro_documento
            
            GROUP BY a.documento,a.agente,a.entrante,
            b.documento,b.agente,b.Saliente,
            u.primer_nombre,u.segundo_nombre,primer_apellido,segundo_apellido
            ORDER BY totalCantidad DESC`,[fechaini ,fechafin, empresa] );

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
        const response = await poolcont.query(`select fecha_llamada ,
        sum(COALESCE(llamadas,'0'))-sum(COALESCE(positiva,'0'))-sum(COALESCE(negativas,'0'))-sum(COALESCE(no_atendidas,'0')) AS no_calificadas,
        sum(COALESCE(positiva,'0')) AS calif_positiva,
        sum(COALESCE(negativas,'0')) AS calif_negativo,
        sum(COALESCE(llamadas,'0'))-sum(COALESCE(no_atendidas,'0'))AS atendidas,
        sum(COALESCE(llamadas,'0')) AS total_llamadas,linea_servicio as telefono FROM
        (select date(fecha_grabacion) AS fecha_llamada ,COUNT(uniqueid) AS llamadas , CASE WHEN calificacion =1 THEN 1 END AS positiva,CASE WHEN calificacion =2 THEN 1 END AS negativas,
        CASE WHEN id_agente='777777777' THEN 1 END AS no_atendidas, linea_servicio FROM
        (select fecha_grabacion,uniqueid,calificacion,linea_servicio,id_agente
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

        const response = await poolcont.query(`SELECT TO_CHAR(fecha_grabacion,'YYYY-MM-DD')AS fecha,
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
        const response = await poolcont.query(`SELECT c.time AS fechainicio ,c.callid AS id,
        login_agente AS agente ,numero_cliente AS telCliente,
        SUBSTRING((to_timestamp (t.time,'yyyy/mm/dd HH24:MI:ss')::time-to_timestamp (c.time,'yyyy/mm/dd HH24:MI:ss')::time)::TEXT,0,9) AS duracion
        FROM (
        SELECT time,callid,agent,event,numero_cliente,login_Agente
        FROM grabaciones_pila g, queue_log q, ask_estado_extension a
        WHERE uniqueid=callid  AND agent=nro_documento
        AND id_agente=agent AND fecha_grabacion BETWEEN ($1)  AND ($2) 
        AND g.empresa=($3)  AND tipo_de_llamada='Entrante' AND event='CONNECT' AND activo=true 
            AND login_agente=($4)
        ) AS c
        INNER JOIN (
        SELECT time,callid,agent,event
        FROM grabaciones_pila, queue_log
        WHERE uniqueid=callid AND event IN ('COMPLETEAGENT','COMPLETECALLER','BLINDTRANSFER','ATTENDEDTRANSFER')) AS t
        ON c.callid=t.callid AND c.agent=t.agent
        ORDER BY c.time`
        ,[fechaini ,fechafin, empresa, usuario ] );

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
        const response = await poolcont.query(`SELECT c.time::date AS fecha ,
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
        GROUP BY c.time::date,c.agent,login_Agente
        ORDER BY cantidadGrabaciones desc 
        `,[fechaini , fechafin, empresa] );

    if (res !== undefined) {
        return res.json(response.rows);        
      }
      
    } 
    catch (error) {
        console.log(error); 
    } 
};




//DB GESTOR

static postPorcentajeTipificacion = async (req: Request, res:Response ) =>{
    try {
        //parametro de header
        //alt +96 `
        let fechaini=req.body.fechaini
        let fechafin=req.body.fechafin 
        let empresa=req.body.empresa;  
        const response = await pool.query(`Select Prin.IdTipificacion, est.nombre, count(Prin.id_detalle_gestion),
        Prin.tipificacionPadre
        from (
            select case when eg.id_estado_gestion_padre is null
                        then null
                        else egp.id_estado_gestion
                        end as EstadoPrincipal,
            dg.id_detalle_gestion, eg.nombre as Tipificacion, eg.id_estado_gestion as IdTipificacion,
            egp.nombre as tipificacionPadre, egp.id_estado_gestion as IdPadreTipificacion,
            g.id_campana, dg.fecha_hora_sis
            from gestion g
            INNER JOIN detalle_gestion dg
                ON g.id_gestion=dg.id_gestion
            INNER JOIN estado_gestion eg
                ON dg.id_estado_gestion=eg.id_estado_gestion
            LEFT JOIN estado_gestion egp
                ON eg.id_estado_gestion_padre=egp.id_estado_gestion
        ) as Prin
        INNER JOIN estado_gestion est
            on Prin.IdTipificacion = est.id_estado_gestion
        where 	  Prin.fecha_hora_sis between ($1) and ($2)
        group by Prin.IdTipificacion, est.nombre,Prin.tipificacionPadre
        order by Prin.IdTipificacion`,[fechaini ,fechafin] );

        //Prin.id_campana IN ($P!{idCampanas}) and
           

    if (res !== undefined) {
        return res.json(response.rows);        
      }
      
    } 
    catch (error) {
        console.log(error); 
    } 
};


static postDetalleGestiones= async (req: Request, res:Response ) =>{
try {
     
    let fechaini=req.body.fechaini
    let fechafin=req.body.fechafin
    let empresa=req.body.empresa;  

    console.log(fechaini);
    console.log(fechafin);
    const response = await pool.query(`SELECT
    CAST(c.id_campana as varchar) || '_' || c.nombre as nombreCampana,
    clte.tipo_documento as tipoDocAportante,
    clte.nro_documento as numDocAporta,
    clte.razon_social as razonSocial,
    tc.nombre as tipoGestion,
    cont.nombre as nombreContacto,
    cont.telefono_celular as telefono1,
    cont.numero_contacto as telefono2,
    cont.telefono_directo as telefono3,
    dg.num_real_marcado as numeroRealMarcado,
    ag.usuario as usuario,
    emp.descripcion as empresa,
    egpdg.nombre as padreTipificacion,
    egdg.nombre as tipificacion,
    g.fecha_gestion as fechaGestion,
    c.id_campana as numeroCampana,
    replace(replace(replace(replace(replace(replace(dg.observacion,chr(10), ' '),chr(11),' '),chr(13),' '),chr(27),' '),chr(32),' '),chr(39),' ') as observacion,
    g.id_gestion as idGestion
    FROM gestion g
    INNER JOIN estado_gestion eg ON g.id_estado_gestion=eg.id_estado_gestion
    INNER JOIN campana c ON g.id_campana=c.id_campana
    INNER JOIN tipo_campana tc ON c.id_tipo_campana=tc.id_tipo_campana
    INNER JOIN detalle_gestion dg ON g.id_gestion=dg.id_gestion
    LEFT JOIN estado_gestion egdg ON dg.id_estado_gestion=egdg.id_estado_gestion
    LEFT JOIN estado_gestion egpdg ON egdg.id_estado_gestion_padre=egpdg.id_estado_gestion
    INNER JOIN cliente clte ON g.id_cliente=clte.id_cliente
    LEFT OUTER JOIN contacto cont ON g.id_gestion = cont.id_gestion AND clte.id_cliente = cont.id_cliente
    LEFT JOIN usuario ag ON dg.id_agente=ag.id_usuario
    INNER JOIN empresa emp ON ag.empresa=emp.id_empresa 
    WHERE g.fecha_gestion BETWEEN ($1) AND ($2) AND emp.id_empresa='3'
    ORDER BY g.fecha_gestion `,[fechaini , fechafin]);
    //,[fechaini , fechafin]

    if (res !== undefined) {
        return res.json(response.rows);
        
      }
    
} catch (error) {
    /**WHERE g.fecha_gestion  BETWEEN $1 AND $2/ */
    
    console.log(error); 
}
}

static postReportesGestion = async (req: Request, res:Response ) =>{
    try {
         
        //parametro de url
        //let fecha1=req.query.fecha;
        //console.log(req.query.fecha);
        
        //parametro de header
        //alt +96 `
        let fecha2=req.body.fecha   
        console.log(req.body.fecha);
        const response = await pool.query(`SELECT id_gestion,id_campana,id_agente,fecha_gestion 
        FROM gestion WHERE fecha_gestion>=$1 order by fecha_gestion `,[fecha2] );
    if (res !== undefined) {
        return res.json(response.rows);
        
      }
      
    } 
    catch (error) {
        console.log(error); 
    } 
};

static getReportesGestion = async (req: Request, res:Response ) =>{
    try {
        const response = await pool.query(`SELECT id_gestion,id_campana,id_agente,fecha_gestion 
        FROM gestion WHERE fecha_gestion is not null order by fecha_gestion limit 5 `);
    if (res !== undefined) {
        return res.json(response.rows);
      }
      
    } 
    catch (error) {
        console.log(error); 
    } 
};




static getEstados = async (req: Request, res:Response ) =>{
    try {
        const response = await poolcont.query('SELECT * FROM ask_estado' );
    if (res !== undefined) {
        return res.json(response.rows);
      }
      poolcont.close();
    } 
    
    catch (error) {
        console.log(error); 
    } 
};

static getReportesid = async (req: Request, res: Response) => {
    //console.log(req.params.id);
    //res.end();
    //El parametro viaja desde la url en el get
 
        const id = req.params.id;
        try {
            const response = await pool.query
            ("SELECT * FROM reportes WHERE id = $1 ORDER BY 2 ", [id]);
        if (res !== undefined) {
            return res.json(response.rows);
          }
          pool.close();
        } 
        catch (error) {
            console.log(error); 
        } 
} 

static postReportes =async (req: Request, res:Response ) => {
        const {id, nombre_reporte, nombre_jasper, nombre_descarga, estado, aplica_bd_asterisk, empresas} = req.body;
        const response = await pool.query('insert into reportes values ($1, $2, $3, $4, $5, $6, $7 )', [id, nombre_reporte, nombre_jasper, nombre_descarga, estado, aplica_bd_asterisk, empresas] );
       
        res.send('Hola mundo post final');
        pool.close();
    };

    //Monitoreo

    static potsMonitoreo = async (req: Request, res:Response ) =>{
       // res.send('Hola mundo post final');
        try {
            let fecha=req.body.fecha;
            let empresa=req.body.empresa;  

            let date = new Date();
            const formatDate = (date: Date)=>{
                let formatted_date = date.getFullYear() + "-" + (date.getMonth() + 1) + 
                "-" + date.getDate() ;
                return formatted_date;
            }
            let fechaFinal=formatDate(date);
        const response = await poolcont.query(`SELECT id_extension, login_agente, descripcion ,
        fechahora_inicio_Estado ,  SUBSTRING((now()-fechahora_inicio_Estado)::TEXT,0,9) as total
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




    // const getmonitoreo = async(req: Request, res:Response )=>{

    
    //     try {

    //           date = new Date();
    //             const formatDate = (current_datetime)=>{
    //                 let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + 
    //                 "-" + current_datetime.getDate() ;
    //                 return formatted_date;
    //             }
    //             fecha=formatDate(date);

    //         const response = await poolcont.query(`SELECT id_extension, login_agente, descripcion ,
    //         fechahora_inicio_Estado ,  SUBSTRING((now()-fechahora_inicio_Estado)::TEXT,0,9) as total
    //         FROM ask_estado_extension aee ,ask_estado ae
    //         WHERE aee.estado=ae.id_estado and cast(fechahora_inicio_Estado as date)=($1)
    //         AND empresa='ASISTIDA' ORDER BY ae.id_estado`,[fecha]);
    //         if (res !== undefined) {
    //             return res.json(response.rows);
                
    //           }
    //     } catch (error) {
    //         console.log('Monitoreo', error);
    //     }
    // }



//Consulta de parametros;



static postUsuariosXempresa = async (req: Request, res:Response ) =>{
        try {   
        
            let empresa=req.body.empresa
            const response = await pool.query(`select id_usuario, usuario, nro_documento,primer_nombre, primer_apellido, 
            id_empresa, pseudonimo from usuario u,empresa e 
            where u.empresa=e.id_empresa AND pseudonimo=($1) and estado<5 ORDER BY usuario`,[empresa] );

            if (res !== undefined) {
            return res.json(response.rows);
        
      }
      
        } 
            catch (error) {
            console.log('UsuariosXempresa',error); 
    } 
};

static getReportes = async (req: Request, res:Response ) =>{
    try {
        //const response = await pool.query(`SELECT * FROM reportes WHERE estado=TRUE AND empresas like '%ASISTIDA%'`);
        const response = await pool.query(`SELECT * FROM reportes WHERE id IN ('19','25','10','9','30','31','50','54','12')`);
    if (res !== undefined) {
        return res.json(response.rows);
        pool.close();
      }
      
    } 
    catch (error) {
        console.log(error); 
    } 
};


static getReportesprueba = async (req: Request, res:Response ) =>{
    try {
        //const response = await pool.query(`SELECT * FROM reportes WHERE estado=TRUE AND empresas like '%ASISTIDA%'`);
        const response = await pool.query(`SELECT * FROM reportes WHERE id IN ('19','25','10','9','30','31','50','54','12')`);
    if (res !== undefined) {
        return res.json(response.rows);
        pool.close();
      }
      
    } 
    catch (error) {
        console.log(error); 
    } 
 }


}
 export default ReporContact;
