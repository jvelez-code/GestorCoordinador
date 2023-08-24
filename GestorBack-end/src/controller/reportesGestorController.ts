import { Request , Response } from 'express';

const c = require('../config/configBd');
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



    /// conexiones a las bases de datos
    const pool = new Pool(c.config_bd_gc);
    //const pool = new Pool(configes);


class reporGestor {


        static logins = async (req: Request, res: Response)=>{
            res.send("Mundo")
    }


    static inicio =((req: Request, res:Response ) => {
    res.send('Hola mundo inicio');
     });



    //BD CONTACT






    //DB GESTOR

    static getEmpresas = async (req: Request, res:Response ) =>{
    try {
        
        const response = await pool.query(`SELECT * FROM empresa WHERE id_empresa >0  ORDER BY id_empresa`);
          

    if (res !== undefined) {
        return res.json(response.rows);        
      }
      
    } 
    catch (error) {
        console.log(error); 
    } 
    };


    static postMonitoreoLlamadas= async (req: Request, res:Response ) =>{
    try {
         
        let fechaini=req.body.fechaini
        let fechafin=req.body.fechafin
    
        console.log(fechaini);
        console.log(fechafin);
        const response = await pool.query(`SELECT m.fecha_monitoreo as fecha , monitoreo_calidad as calidad , u.usuario as usuario,pseudonimo as empresa, monitoreo_cliente as cliente,
        plandeaccion as plan,canal_comunicacion as canal,monitoreo_observacion as observacion,calificacion_total as calificacion
        FROM monitoreo_grabaciones m,usuario u,monitoteo_plandeaccion mp, empresa e
        WHERE  m.monitoreo_usuario=u.id_usuario::text AND m.plan_accion=mp.id_plan::text AND u.empresa=e.id_empresa
        AND m.fecha_monitoreo BETWEEN   ($1) AND ($2)
        ORDER BY m.fecha_monitoreo`,[fechaini , fechafin]);
        //,[fechaini , fechafin]
    
        if (res !== undefined) {
            return res.json(response.rows);
            
          }
        
    } catch (error) {
        /**WHERE g.fecha_gestion  BETWEEN $1 AND $2/ */
        
        console.log(error); 
    }
    }
    


    static postPorcentajeTipificacion = async (req: Request, res:Response ) =>{
    try {
        //parametro de header
        //alt +96 `
        let fechaini=req.body.fechaini
        let fechafin=req.body.fechafin 
        const response = await pool.query(`SELECT Prin.IdTipificacion, est.nombre, count(Prin.id_detalle_gestion),
        Prin.tipificacionPadre
        from (
            SELECT case when eg.id_estado_gestion_padre is null
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
        ORDER BY Prin.IdTipificacion`,[fechaini ,fechafin] );

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
    let empresa=req.body.empresa
    let campana=req.body.campana

    console.log(fechaini);
    console.log(fechafin);
    console.log( empresa );
    console.log( campana );
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
    egdg.nombre as tipicacion,
    dg.fecha_gestion as fechaGestion,
    c.id_campana as numeroCampana,
    replace(replace(replace(replace(replace(replace(dg.observacion,chr(10), ' '),chr(11),' '),chr(13),' '),chr(27),' '),chr(32),' '),chr(39),' ') as observacion,
    cont.nro_empleado as empleados
    FROM gestion g
    INNER JOIN estado_gestion eg ON g.id_estado_gestion=eg.id_estado_gestion
    INNER JOIN campana c ON g.id_campana=c.id_campana
    INNER JOIN tipo_campana tc ON c.id_tipo_campana=tc.id_tipo_campana
    LEFT JOIN detalle_gestion dg ON g.id_gestion=dg.id_gestion
    LEFT JOIN estado_gestion egdg ON dg.id_estado_gestion=egdg.id_estado_gestion
    LEFT JOIN estado_gestion egpdg ON egdg.id_estado_gestion_padre=egpdg.id_estado_gestion
    INNER JOIN cliente clte ON g.id_cliente=clte.id_cliente
    LEFT OUTER JOIN contacto cont ON g.id_gestion = cont.id_gestion AND clte.id_cliente = cont.id_cliente
    LEFT JOIN usuario ag ON dg.id_agente=ag.id_usuario
    LEFT JOIN empresa emp ON ag.empresa=emp.id_empresa
    WHERE  dg.fecha_hora_sis BETWEEN ($1) AND ($2) AND pseudonimo=($3) 
    ORDER BY dg.fecha_gestion`,[fechaini , fechafin, empresa ]);

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
        FROM gestion WHERE fecha_gestion>=$1 ORDER BY fecha_gestion `,[fecha2] );
    if (res !== undefined) {
        return res.json(response.rows);
        
      }
      
    } 
    catch (error) {
        console.log(error); 
    } 
    };

    // CCOMERCIAL registro de compromisos 45

    static postCompromisos= async (req: Request, res:Response ) =>{
    try {
         
        let fechaini=req.body.fechaini
        let fechafin=req.body.fechafin
    
        console.log(fechaini);
        console.log(fechafin);
        const response = await pool.query(`select area_comercial as areaComercial,
        u.usuario as funcionario,
        g.fecha_gestion as fechagestion,
        eg.nombre as motivo,
        tipo_id as tipo,
        nit as documento,
        cg.empresa,
        cg.telefono_fijo,
        cg.telefono_celular,
        cg.correo_electronico,
        cg.persona_visitada,
        cg.cargo,
        cg.numero_empleados,
        cg.direccion,
        cg.operador_actual,
        cg.tipo_compromiso,
        cg.fecha_compromiso,
        cg.area_responsable,
        cg.estado_compromiso,
        cg.requiere_apoyo,
        dg.observacion,
        dv.nombre as ciudad,
        dvs.nombre as departamento
         FROM comerciales_gestiones cg,gestion g,detalle_gestion dg,usuario u,
        estado_gestion eg, cliente cl,divipola dv,divipola dvs
         WHERE cg.id_gestion=g.id_gestion and g.id_gestion=dg.id_gestion and g.id_agente=u.id_usuario
         and g.id_estado_gestion=eg.id_estado_gestion and g.id_cliente=cl.id_cliente
         and cl.id_zona=dv.id_zona and dv.id_zona_padre=dvs.id_zona and
        g.fecha_gestion between ($1) and ($2) `,[fechaini , fechafin ]);

        if (res !== undefined) {
            return res.json(response.rows);
            }
        
    } catch (error) {
        console.log(error); 
    }
    }

    // COMERCIAL registro de compromisos 35

    static postGestionComercial= async (req: Request, res:Response ) =>{
        try {
             
            let fechaini=req.body.fechaini
            let fechafin=req.body.fechafin
        
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
            dg.fecha_gestion as fechaGestion,
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
            INNER JOIN empresa emp ON ag.empresa=emp.id_empresa AND emp.pseudonimo='COMERCIAL'
            WHERE g.fecha_gestion  BETWEEN  ($1) and ($2) ORDER BY g.fecha_gestion  `,[fechaini , fechafin ]);
    
            if (res !== undefined) {
                return res.json(response.rows);
                }
            
        } catch (error) {
            console.log(error); 
        }
        }

        // COMERCIAL registro de compromisos 35

    static postConsolidadoCicloVida= async (req: Request, res:Response ) =>{
        try {
             
            let fechaini=req.body.fechaini
            let fechafin=req.body.fechafin
        
            console.log(fechaini);
            console.log(fechafin);
            const response = await pool.query(`SELECT agen.usuario as usuario,
            c.nombre as contacto,
            dept.nombre as departamento,
            mun.nombre as municipio,
            eg.nombre as tipificacion,
            regexp_replace(substr(dg.observacion,1,600), E'\n+|\\\\s+', ' ', 'g') as observacion,
            scv.fecha_seguimiento as fechaGestion,
            cl.tipo_documento as tipoDocumento,
            cl.nro_documento as nroDocumento,
            cl.razon_social as razonSocial,
            eg2.nombre as estado,
            tipo_camp.nombre as tipoGestion,
            CASE WHEN arch.nombre_archivo  IS NULL
                THEN  CAST(camp.id_campana as varchar)
                ELSE arch.nombre_archivo
                END as archivo,
            c.telefono_celular as telefonoCelular,
            c.numero_contacto as numeroContacto,
            c.telefono_directo as telefonoDirecto,
            cv.nombre as cicloVida,
            g.id_gestion as idGestion,
            c.nro_empleado as nroempleado
            FROM detalle_gestion dg INNER JOIN gestion g ON g.id_gestion=dg.id_gestion
            INNER JOIN estado_gestion eg ON eg.id_estado_gestion=dg.id_estado_gestion
            INNER JOIN detalle_gestion_comercial dgc on dgc.id_gestion=g.id_gestion
            LEFT JOIN contacto c ON (c.id_gestion = g.id_gestion AND c.id_cliente = g.id_cliente)
            LEFT JOIN divipola mun ON c.id_zona=mun.id_zona
            LEFT JOIN divipola dept ON mun.id_zona_padre=dept.id_zona
            INNER JOIN cliente cl ON cl.id_cliente=g.id_cliente
            LEFT JOIN estado_gestion eg2 ON eg2.id_estado_gestion=eg.id_estado_gestion_padre
            INNER JOIN usuario agen ON agen.id_usuario=dg.id_agente
            LEFT JOIN archivo arch ON arch.id_archivo=g.id_archivo
            INNER JOIN campana camp ON camp.id_campana=g.id_campana 
            INNER JOIN tipo_campana tipo_camp ON tipo_camp.id_tipo_campana=camp.id_tipo_campana
            INNER JOIN seguimiento_ciclo_vida scv on scv.id_detalle_gestion_comercial=dgc.id_detalle_gestion_comercial
            LEFT JOIN  ciclo_de_vida cv on      cv.id_ciclo=scv.ciclo
            WHERE  g.fecha_gestion between ($1) and ($2)
            ORDER BY fechaGestion DESC NULLS last`,[fechaini , fechafin ]);
    
            if (res !== undefined) {
                return res.json(response.rows);
                }
            
        } catch (error) {
            console.log(error); 
        }
        }



    

    static getReportesGestion = async (req: Request, res:Response ) =>{
    try {
        const response = await pool.query(`SELECT id_gestion,id_campana,id_agente,fecha_gestion 
        FROM gestion WHERE fecha_gestion is not null ORDER BY fecha_gestion limit 5 `);
    if (res !== undefined) {
        return res.json(response.rows);
      }
      
    } 
    catch (error) {
        console.log(error); 
    } 
    };





    //Consulta de parametros;



    static postUsuariosXempresa = async (req: Request, res:Response ) =>{
        try {   
        
            let empresa=req.body.empresa
            const response = await pool.query(`SELECT id_usuario, usuario, nro_documento,primer_nombre, primer_apellido, 
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


    static postReportesEmpresa= async (req: Request, res:Response ) =>{
    try {
         
        let empresa=req.body.empresa;
        console.log(empresa);
        //const response = await pool.query(`SELECT * FROM reportes WHERE id IN ('25','10','30','31','50','54',
        //'12','19','48','49','11',
        //'36','38','40','56','45','33','51')     
        const response = await pool.query(`SELECT * FROM reportes WHERE estado is true
        AND empresas LIKE '%'||$1||'%' ORDER BY  nombre_reporte `,[empresa]);
        //,[fechaini , fechafin]
    
        if (res !== undefined) {
            return res.json(response.rows);
            
          }
        
    } catch (error) {
        /**WHERE g.fecha_gestion  BETWEEN $1 AND $2/ */
        
        console.log(error); 
    }
    }
    


    static getReportesprueba = async (req: Request, res:Response ) =>{
    try {
        //const response = await pool.query(`SELECT * FROM reportes WHERE estado=TRUE AND empresas like '%ASISTIDA%'`);
        const response = await pool.query(`SELECT * FROM reportes WHERE id IN ('25','10','30','31','50','54','12')`);
    if (res !== undefined) {
        return res.json(response.rows);
        pool.close();
      }
      
    } 
    catch (error) {
        console.log(error); 
    } 
 }

    static getReportesid = async (req: Request, res:Response ) => {
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

    static postReportesNuevo =async (req: Request, res:Response) => {
    const {id, nombre_reporte, nombre_jasper, nombre_descarga, estado, aplica_bd_asterisk, empresas} = req.body;
    const response = await pool.query('insert into reportes values ($1, $2, $3, $4, $5, $6, $7 )', [id, nombre_reporte, nombre_jasper, nombre_descarga, estado, aplica_bd_asterisk, empresas] );
   
    res.send('Hola mundo post final');
    pool.close();
    };

    static getReportes = async (req: Request, res:Response ) =>{
    try {
        //const response = await pool.query(`SELECT * FROM reportes WHERE estado=TRUE AND empresas like '%ASISTIDA%'`);
        const response = await pool.query(`SELECT * FROM reportes WHERE id IN ('25','10','30','31','50','54',
        '12','19','48','49','11') ORDER BY  nombre_reporte`);
    if (res !== undefined) {
        return res.json(response.rows);
        pool.close();
      }
      
    } 
    catch (error) {
        console.log(error); 
    } 
    };
    static postCampanas= async (req: Request, res:Response ) =>{
        try {
         
        let empresa=req.body.empresa;
        console.log('PRUEBA',empresa);
        const response = await pool.query(`SELECT  * FROM campana WHERE grupo_rol= ($1) ORDER BY 1 DESC LIMIT 20`, [empresa]);
        //const response = await pool.query(`SELECT  * FROM campana  ORDER BY 1 DESC LIMIT 20`);    
    
        if (res !== undefined) {
            return res.json(response.rows);
            
          }
        
    } catch (error) {
         
        console.log(error); 
    }

    }
    





}
 export default reporGestor;
