import { NextFunction, Request , Response } from 'express';
import { AuthUsuario } from '../entitie/auth_usuario';
import * as jwt from 'jsonwebtoken';
import config from '../config/config'
import { validate } from 'class-validator';

class AuthController{

    static logins = async (req: Request, res: Response)=>{
        res.send("Hola")
    }

    static login = async (req: Request, res: Response)=>{

    const { usuario, clave } = req.body;
    console.log(req.body);
    
    
    if(!(usuario && clave)){
    return res.status(400).json({message: 'Usuario y Contraseña son Requeridos'})
    }
    
    let authUsuario = new AuthUsuario();

    try {
        authUsuario = await AuthUsuario.findOneOrFail({
            where: {
                usuario: usuario,
            },
        })
        
    } catch (error) {
        return res.status(400).json({message: 'Usuario y Contraseña son Incorrectos'})
        
    }

    if(!authUsuario.checkPassword(clave)){
        return res.status(400).json({message: 'Usuario y Contraseña son Incorrectos'})
    }

    let usuarioLog=authUsuario.usuario;
    let rolLog=authUsuario.id_rol;
    let empLog=authUsuario.id_empresa;
    
    const token = jwt.sign({ id: authUsuario.id_usuario, usuario: authUsuario.usuario }, config.jwtSecret, { expiresIn:'1h'})
    //res.send(authUsuario);
    res.json({message: 'OK', token, usuarioLog, rolLog, empLog})

    
    } 

    static cambioContrasena= async (req:Request ,  res: Response )=>{

        //const {id } = res.locals.jwtPayload
        const {id } = res.locals.jwtPayload; 
        console.log(res.locals.jwtPayload);
        const { anteriorContraena, nuevaContrasena } = req.body;

        if(!(anteriorContraena && nuevaContrasena)){
            res.status(400).json({message: 'Antigua y nueva contraseña son requeridas'});

        }

       let authUsuario = new AuthUsuario();
     
       
        try {
            
          authUsuario = await AuthUsuario.findOneByOrFail({id_usuario:id});
            
           
        } catch (error) {
            res.status(400).json({message:'Usuario no se encuentra en el sistema'});
            
        }

        if(!authUsuario.checkPassword(anteriorContraena)){
            return res.status(400).json({message: 'Revise su contraseña'});
        }
          

        authUsuario.clave= nuevaContrasena;
        const validationOps={validationError:{ target: false, value:false}};
        const errors = await validate(authUsuario, validationOps);

        if (errors.length> 0){
            return res.status(400).json(errors)

        }

        authUsuario.hashPassword();
        AuthUsuario.save(authUsuario);

        res.json({message: 'Csontraseña cambiada con exito'});
    }


}
export default AuthController;

