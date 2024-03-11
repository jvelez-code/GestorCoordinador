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


    static postPorcentajeTipificacion= async (req: Request, res:Response ) =>{
        try {
         
        let fechaini=req.body.fechaini
        let fechafin=req.body.fechafin
        let empresa=req.body.empresa

        console.log(fechaini);
        console.log(fechafin);
        console.log( empresa );

        const response = await pool.query(`WITH gestiones AS ( 
            SELECT g.id_campana as campana ,dg.id_estado_gestion  ,eg.nombre as tipificacion,
            egs.nombre as subtipificacion,count(eg.nombre) AS cantidad
            FROM gestion g,detalle_gestion dg , campana c ,estado_gestion eg, estado_gestion egs, tipo_campana tc 
            WHERE g.id_gestion=dg.id_gestion AND g.id_campana =c.id_campana and g.id_estado_gestion =eg.id_estado_gestion 
            AND dg.id_estado_gestion =egs.id_estado_gestion
            AND c.id_tipo_campana=tc.id_tipo_campana
            AND g.fecha_gestion BETWEEN ($1) AND ($2)
            AND c.grupo_rol=($3)
            GROUP  BY  g.id_campana ,dg.id_estado_gestion,eg.nombre,egs.nombre
            ORDER BY g.id_campana ,dg.id_estado_gestion,eg.nombre,egs.nombre ),
            totalGestiones as (
            SELECT g.id_campana,c.nombre, count(*) AS suma_total from gestion g ,campana c
            WHERE g.id_campana =c.id_campana 
            AND g.fecha_gestion BETWEEN ($1) AND ($2)
            AND c.grupo_rol=($3)
            GROUP BY g.id_campana,c.nombre
            ORDER BY g.id_campana)
            
            SELECT  g.campana,t.nombre AS nombrecampana,g.tipificacion,t.suma_total,g.subtipificacion,g.cantidad,
            (ROUND((cantidad::NUMERIC / t.suma_total) * 100, 2)::text || '%') AS porcentaje 
            FROM gestiones g, totalGestiones t
            WHERE g.campana=t.id_campana 
            GROUP BY g.campana, t.nombre, g.tipificacion,t.suma_total,g.subtipificacion,g.cantidad
            ORDER BY g.campana, g.tipificacion,g.cantidad  DESC`,[fechaini , fechafin, empresa ]);
    
        if (res !== undefined) {
            return res.json(response.rows);
            
          }
        
        } catch (error) {
        console.log(error); 
        }
        }
    


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
    WHERE  dg.fecha_hora_sis BETWEEN ($1) AND ($2) AND c.grupo_rol=($3) 
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

    // COMERCIAL registro de compromisos 51

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

    // COMERCIAL registro de compromisos 33

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

    // COMERCIAL Agenda 32

    static postAgendaComercial= async (req: Request, res:Response ) =>{
        try {
             
            let fechaini=req.body.fechaini
            let fechafin=req.body.fechafin
        
            console.log(fechaini);
            console.log(fechafin);
            const response = await pool.query(`SELECT g.id_campana,
            to_char(g.fecha_hora_sis,'YYYY-MM-DD HH24:MI:SS') AS fecha_hora_sis,
            g.fecha_Agenda,c.tipo_documento,c.nro_documento,c.razon_social,
            regexp_replace(substr(dt.observacion,1,600), E'\n+|\\\\s+', ' ', 'g') as obsAgenda,
            u.usuario,
            to_char(g.fecha_Agenda,'YYYY-MM-DD') AS fecha_agenda,
            to_char(g.fecha_Agenda,'HH24:MI') AS hora_agenda,
            to_char(dt2.fecha_gestion,'YYYY-MM-DD') AS fecha_gestion,
            to_char(dt2.fecha_gestion,'HH24:MI') AS hora_gestion,
            case when dt2.observacion is null then 'PENDIENTE' else regexp_replace(substr(dt2.observacion,1,600), E'\n+|\\\\s+', ' ', 'g') end as obsGestionada,
            to_date (dt2.fecha_gestion::TEXT,'YYYY-MM-DD') - to_date (g.fecha_Agenda::TEXT,'YYYY-MM-DD') AS diferenciaDias
            FROM gestion g
            inner join cliente c on g.id_cliente=c.id_cliente
            inner join detalle_gestion dt on g.id_gestion_padre=dt.id_gestion
            inner join usuario u on g.id_Agente=u.id_usuario
            inner join campana cam on g.id_campana=cam.id_campana
            left join detalle_gestion dt2 on dt2.id_gestion=g.id_gestion
            WHERE g.fecha_hora_sis between ($1) and ($2) and cam.id_tipo_campana='7'
            ORDER BY g.fecha_hora_sis `,[fechaini , fechafin ]);
    
            if (res !== undefined) {
                return res.json(response.rows);
                }
            
        } catch (error) {
            console.log(error); 
        }
        }

     // COMERCIAL Visita 27

    static postVisitaComercial= async (req: Request, res:Response ) =>{
        try {
             
            let fechaini=req.body.fechaini
            let fechafin=req.body.fechafin
        
            console.log(fechaini);
            console.log(fechafin);
            const response = await pool.query(` SELECT
            EG.nombre as motivo,
            CL.razon_social,
            CL.tipo_documento,
            CL.nro_documento,
            CO.numero_contacto,
            CO.correo_electronico,
            CO.nombre as contacto,
            CO.cargo,
            CL.cantidad_empleados,
            MUN.nombre as municipio,
            DEP.nombre as departamento,
            CL.direccion,
            SC.fecha_ingreso_visita,
            SC.fecha_salida_visita,
            SC.fecha_gestion_seguimiento,
            USU.usuario,
            SC.operador_actual,
            SC.encuesta_n1,
            SC.encuesta_n2,
            SC.encuesta_n3,
            SC.encuesta_n4,
            SC.encuesta_n5,
            SC.encuesta_n6,
            SC.encuesta_f1,
            SC.encuesta_f2,
            SC.encuesta_f3,
            SC.encuesta_f4,
            SC.encuesta_f5,
            SC.encuesta_observaciones,
            DG.observacion,
            CC.compromiso,
            CC.responsable,
            CC.fecha_compromiso,
            SC.referidos_empresa,
            SC.referidos_contacto,
            SC.referidos_email,
            SC.referidos_telefono,
            SC.fecha_liquidacion_pago
       FROM
            seguimiento_comercial SC INNER JOIN gestion G ON SC.id_gestion = G.id_gestion
            INNER JOIN compromiso_comercial CC ON SC.id_seguimiento = CC.id_seguimiento_comercial
            INNER JOIN estado_gestion EG ON G.id_estado_gestion = EG.id_estado_gestion
            INNER JOIN detalle_gestion DG ON SC.id_detalle_gestion = DG.id_detalle_gestion
            INNER JOIN cliente CL ON SC.id_cliente = CL.id_cliente
            INNER JOIN contacto CO ON SC.id_contacto = CO.id_contacto
            INNER JOIN usuario USU ON SC.id_agente = USU.id_usuario
            INNER JOIN divipola MUN ON CL.id_zona = MUN.id_zona
            INNER JOIN divipola DEP ON MUN.id_zona_padre = DEP.id_zona
       WHERE SC.fecha_gestion_seguimiento BETWEEN ($1) and ($2)`,[fechaini , fechafin ]);
    
            if (res !== undefined) {
                return res.json(response.rows);
                }
            
        } catch (error) {
            console.log(error); 
        }
        }
        



         // COMERCIAL Registro nuevos fidelizacion 26

    static postFidelizacionComercial= async (req: Request, res:Response ) =>{
        try {
             
            let fechaini=req.body.fechaini
            let fechafin=req.body.fechafin
        
            console.log(fechaini);
            console.log(fechafin);
            const response = await pool.query(`SELECT USU.usuario, FID.cod_caja, CLI.tipo_documento, CLI.nro_documento, CLI.razon_social, FID.sucursal, FID.registros_nuevos,
            FID.registros_recuperados, FID.fecha_pago, FID.numero_planilla, FID.observacion, FID.migracion, FID.fecha_gestion
            FROM fidelizacion_comercial FID
            INNER JOIN cliente CLI on (FID.id_cliente = CLI.id_cliente)
            INNER JOIN usuario USU on (FID.id_agente = USU.id_usuario)
            WHERE FID.fecha_gestion BETWEEN ($1) and ($2)
            ORDER BY FID.fecha_gestion`,[fechaini , fechafin ]);
    
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
