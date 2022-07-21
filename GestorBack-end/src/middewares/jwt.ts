import { Request, Response, NextFunction } from "express";
import * as jwt from 'jsonwebtoken';
import config from '../config/config'

export const checkJwt = (req: Request, res: Response, next: NextFunction)=>{
    console.log('Hola jwt:', req.headers);
const token = <string>req.headers['auth'];
let jwtPayload;

try {
    jwtPayload = <any>jwt.verify(token, config.jwtSecret);
    res.locals.jwtPayload = jwtPayload;
    
} catch (error) {
    return res.status(401).json({message: 'No Autorizado'});
    
}

const {id_usuario, usuario, id_rol } = jwtPayload;

const newToken = jwt.sign({id_usuario, usuario, id_rol}, config.jwtSecret , {expiresIn: '1h'});
res.setHeader('token', newToken);

next();

}