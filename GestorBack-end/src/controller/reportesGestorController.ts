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



/// conexiones a las bases de datos
const pool = new Pool(configes);


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
        FROM gestion WHERE fecha_gestion>=$1 ORDER BY fecha_gestion `,[fecha2] );
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

static getReportes = async (req: Request, res:Response ) =>{
    try {
        //const response = await pool.query(`SELECT * FROM reportes WHERE estado=TRUE AND empresas like '%ASISTIDA%'`);
        const response = await pool.query(`SELECT * FROM reportes WHERE id IN ('25','10','30','31','50','54','12') ORDER BY  nombre_reporte`);
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

static postReportes =async (req: Request, res:Response) => {
    const {id, nombre_reporte, nombre_jasper, nombre_descarga, estado, aplica_bd_asterisk, empresas} = req.body;
    const response = await pool.query('insert into reportes values ($1, $2, $3, $4, $5, $6, $7 )', [id, nombre_reporte, nombre_jasper, nombre_descarga, estado, aplica_bd_asterisk, empresas] );
   
    res.send('Hola mundo post final');
    pool.close();
};


}
 export default reporGestor;
