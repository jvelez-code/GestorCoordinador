import { Request, Response, NextFunction } from "express";
import { AuthUsuario } from '../entitie/auth_usuario'


export const checkRole =(roles: Array<number>)=>{

     return async (req: Request, res: Response, next: NextFunction)=>{
         
         const {id } = res.locals.jwtPayload; 
         console.log("Hola Rol",res.locals.jwtPayload)

         let authUsuario = new AuthUsuario();

          try {
            authUsuario = await AuthUsuario.findOneByOrFail({id_usuario:id });
            
             
         } catch (error) {
             return res.status(401).send();
             
         }

         //check
         
         const { id_rol } = authUsuario;

                
         if (roles.includes(id_rol))
         {
             next();
         }
         else {
             res.status(401).json({message: 'No autorizado el Rol'})

         }

     }

}


