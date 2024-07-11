import { NextFunction, Request , Response } from 'express';
import { AuthUsuario } from '../entitie/auth_usuario';
import { Usuarios } from '../entitie/usuariosMigra';
import { Empresa } from '../entitie/empresa';
import * as jwt from 'jsonwebtoken';
import config from '../config/config'
import { validate } from 'class-validator';
import { UsuariosRol } from '../entitie/usuario_rolMigra';
import { UsuariosGestor } from '../entitie/usuariosGestor';
import { Console } from 'console';



class AuthController{

    static logins = async (req: Request, res: Response)=>{
        res.send("Hola")
    }
    

    //Ruta para logueo

    static login = async (req: Request, res: Response)=>{

    const { usuario, clave } = req.body;
    console.log(req.body,'logeo 2');
    
    
    if(!(usuario && clave)){
    return res.status(400).json({message: 'Usuario y Contraseña son Requeridos'})
    }


    //**********prueba tabla usuarios
    let usuarios = new Usuarios();
    let usuarioRol;

    //TRAER EL USUARIO EN LOGEO
    try {
        //  usuarioRol = await UsuariosRol
        // .createQueryBuilder(usuarioRol)
        // .innerJoinAndSelect('usuarioRol.idusuario', 'usuario')
        // .addSelect(['usuarioRol.idusuario', 'usuarioRol.correo'])
        // .getMany();

        usuarios = await Usuarios.findOneOrFail({
                    where: {
                        nombre: usuario,
                    },
                })
        
    } catch (error) {
        return res.status(400).json({message: 'Usuario y Contraseña son incorrectos 1'})
        
    }

    if(!usuarios.checkPassword(clave)){
        return res.status(400).json({message: 'Usuario y Contraseña son Incorrectos'})
    }

       //TRAER ROL
       let rol = new UsuariosRol();
       const idUsuario = usuarios.idusuario;
       try {
           rol = await UsuariosRol.findOneOrFail({
               where: {
                   id_usuario: idUsuario,
               },
           })        
       } catch (error) {
           return res.status(400).json({message: 'Rol no valida'})
           
       }




    //TRAER EMPRESA

        //TRAER EMPRESA
        let usuarioG = new UsuariosGestor();        
        try {
            usuarioG = await UsuariosGestor.findOneOrFail({
                where: {
                    usuario: usuario,
                },
            })     
             
        } catch (error) {
            return res.status(400).json({message: 'Usuario Gestor  no valida'})
            
        }
        
    let empresa = new Empresa();
    const idEmpresa = usuarioG.empresa;
    try {
        empresa = await Empresa.findOneOrFail({
            where: {
                id_empresa: idEmpresa,
            },
        })  
             
    } catch (error) {
        return res.status(400).json({message: 'Empresa no valida'})
        
    }

    console.log(usuarios,'usuarios') 
    console.log(usuarioG,'usuarioG')  
    console.log(empresa,'empresa') ;  
    let usuarioLog=usuarios.nombre;
    let rolLog=rol.id_rol;
    let id_empresa=empresa.pseudonimo;
    
    const token = jwt.sign({ id: usuarios.idusuario, usuario: usuarios.nombre }, config.jwtSecret, { expiresIn:'1h'})
    //res.send(authUsuario);
    res.json({message: 'OK', token, usuarioLog, rolLog, id_empresa })

    
    
    // let authUsuario = new AuthUsuario();

    // //TRAER EL USUARIO EN LOGEO
    // try {
    //     authUsuario = await AuthUsuario.findOneOrFail({
    //         where: {
    //             usuario: usuario,
    //         },
    //     })
        
    // } catch (error) {
    //     return res.status(400).json({message: 'Usuario y Contraseña son incorrectos'})
        
    // }

    // if(!authUsuario.checkPassword(clave)){
    //     return res.status(400).json({message: 'Usuario y Contraseña son Incorrectos'})
    // }

    // //TRAER EMPRESA
    // let empresa = new Empresa();
    // const idEmpresa = authUsuario.id_empresa;
    // try {
    //     empresa = await Empresa.findOneOrFail({
    //         where: {
    //             id_empresa: idEmpresa,
    //         },
    //     })        
    // } catch (error) {
    //     return res.status(400).json({message: 'Empresa no valida'})
        
    // }

    // let usuarioLog=authUsuario.usuario;
    // let rolLog=authUsuario.id_rol;
    // let id_empresa=empresa.pseudonimo;
    
    // const token = jwt.sign({ id: authUsuario.id_usuario, usuario: authUsuario.usuario }, config.jwtSecret, { expiresIn:'1h'})
    // //res.send(authUsuario);
    // res.json({message: 'OK', token, usuarioLog, rolLog, id_empresa })

    
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

