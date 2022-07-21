
import { Request , Response } from 'express';
import { resourceLimits } from 'worker_threads';
import { Usuario } from '../entitie/usuario'

export const selectUsuario = async ( req: Request,res:Response)=>{
     const usuario= await Usuario.find()
return res.json(usuario);
}

export const insertUsuario = async (req: Request , res: Response )=>{
    console.log("Hola TestSS", req.body);
    const { firsname , lastname} = req.body

    const usuario = new Usuario();
    usuario.firsname=firsname;
    usuario.lastname=lastname;

    await usuario.save();

    res.send('Hola Post')
    }


    export const updateUsuario = async (req: Request , res: Response )=>{
         try {

               console.log(req.params);
               console.log(req.body);
               const {firsname, lastname}= req.body
               const { id } = req.params;

               const usuario= await Usuario.findOneBy({id : parseInt(req.params.id)})

               if(!usuario) return res.status(404).json({ message: "usuario no se encuentra"});
            

               await Usuario.update({ id : parseInt(id) }, req.body);

               return res.json('Recibido')
              
         } catch (error) {
          if (error instanceof Error){
               return res.status(500).json({ message: error.message})
          }
              
         }
     }


     export const deleteUsuario = async (req: Request , res: Response )=>{
          try {
          const { id } = req.params;
      
          const result= await Usuario.delete({ id : parseInt(id) });
          console.log(result)
          if(result.affected===0) {
               return res.status(404).json({ message: "usuario no encontrado"});            
          }
      
          return res.status(204).json({ message: "Eliminado"});
               
          } catch (error) {
               if (error instanceof Error){
                    return res.status(500).json({ message: error.message})
               }          
               
          }         

     }