import { Request , Response } from 'express';
import { AuthUsuario } from '../entitie/auth_usuario';
import { validate } from 'class-validator';
import { createQueryBuilder } from 'typeorm';
import { DataSourceGestor } from '../db';
import { Empresa } from '../entitie/empresa';
import { Console } from 'console';

export const selectAuthUsuario = async ( req: Request,res:Response)=>{
     const authUsuario= await AuthUsuario.find()


     /* const authUsuario = await DataSourceGestor
    .getRepository(AuthUsuario)
    .createQueryBuilder("authUsuario")
    .where("authUsuario.id_usuario = :id AND authUsuario.usuario = :name", { id: 23, name: "jvelez_9" })
    .getOne()


    const authUsuario = await DataSourceGestor
    .getRepository(AuthUsuario)
    .createQueryBuilder("authUsuario")
    .leftJoinAndSelect("authUsuario.empresa", "empresa")
    .getMany()*/
    console.log(authUsuario);

return res.json(authUsuario);
}

export const selectAuthUsuarioId = async ( req: Request,res:Response)=>{
     try {
          const { id } = req.params;
          const authUsuario = await DataSourceGestor.getRepository(AuthUsuario)
          .findOneByOrFail( { id_usuario : parseInt(id) });
          return res.json(authUsuario);
          
     } catch (error) {
          if (error instanceof Error){
               return res.status(500).json({ message: error.message})
          }
          
     }
 
}

export const insertAuthUsuario = async (req: Request , res: Response )=>{
   
   try {
     
     const { usuario , clave, nombre,
             apellido, documento, estado, 
             correo, id_empresa, id_rol} = req.body
 
     const authUsuario = new AuthUsuario();
     authUsuario.usuario=usuario;
     authUsuario.clave=clave;
     authUsuario.nombre=nombre;
     authUsuario.apellido=apellido;
     authUsuario.documento=documento;
     authUsuario.estado=estado;
     authUsuario.correo=correo;
     authUsuario.id_empresa=id_empresa;
     authUsuario.id_rol=id_rol;

     authUsuario.hashPassword();
     await authUsuario.save();
 
     //return res.send('Hola Post')
     return res.json(authUsuario);
        
   } catch (error) {
     if (error instanceof Error){
          return res.status(500).json({ message: error.message})
     }
        
   }  
}


    export const updateAuthUsuario = async (req: Request , res: Response )=>{
      

               const { clave }= req.body
               const { id } = req.body.id_usuario;
               try {
               const authUsuario= await AuthUsuario.findOneBy({id_usuario : parseInt(req.body.id_usuario)})

               if(!authUsuario) return res.status(404).json({ message: "AuthUsuario no se encuentra"});
            

               await AuthUsuario.update({ id_usuario : parseInt(req.body.id_usuario) }, req.body);

               return res.json('Recibido')
              
         } catch (error) {
          if (error instanceof Error){
               return res.status(500).json({ message: error.message})
          }
              
         }
     }


     export const deleteAuthUsuario = async (req: Request , res: Response )=>{
          try {
          const { id } = req.params;
      
          const result= await AuthUsuario.delete({ id_usuario : parseInt(id) });
          console.log(result)
          if(result.affected===0) {
               return res.status(404).json({ message: "AuthUsuario no encontrado"});            
          }
      
          return res.status(204).json({ message: "Eliminado"});
               
          } catch (error) {
               if (error instanceof Error){
                    return res.status(500).json({ message: error.message})
               }          
               
          }         

     }

function id_usuario(id_usuario: any, arg1: number) {
     throw new Error('Function not implemented.');
}
