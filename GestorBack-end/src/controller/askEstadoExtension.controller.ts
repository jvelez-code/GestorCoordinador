import { Request , Response } from 'express';
import { Usuario } from '../entitie/usuario';
import { askEstadoExtension } from '../entitie/ask_estado_extension'



export const selectUsuarios = async ( req: Request,res:Response)=>{
    const usuario= await Usuario.find()
    console.log("holaaa")
return res.json(usuario);
}


export const postMonitoreo = async (req: Request, res:Response)=>{
    try {
        console.log("Holaas",req.body);
        let fecha=req.body.fecha  
        let now= new Date();
        console.log('La fecha actual es',now);
        
        now= new Date();
        const formatDate = (now:any)=>{
            let formatted_date = now.getFullYear() + "-" + (now.getMonth() + 1) + 
            "-" + now.getDate() ;
            return formatted_date;
        }
        let fechaFinal =formatDate(now);

        return res.json(fechaFinal);

    // const response = await query(`SELECT id_extension, login_agente, descripcion ,
    // fechahora_inicio_Estado ,  SUBSTRING((now()-fechahora_inicio_Estado)::TEXT,0,9) as total
    // FROM ask_estado_extension aee ,ask_estado ae
    // WHERE aee.estado=ae.id_estado and cast(fechahora_inicio_Estado as date)=($1)
    // AND empresa='ASISTIDA' ORDER BY ae.id_estado,5 desc`,[fechaFinal]);
    // if (res !== undefined) {
    //     return res.json(response.rows);
        
     // }          
    } 
    catch (error) {
        console.log(error); 
    } 
};


