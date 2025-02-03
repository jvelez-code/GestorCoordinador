import { Request, Response, NextFunction } from "express";
const jwt = require('jsonwebtoken');

const validarJwt = ( req: Request, res: Response, next: NextFunction ) => {

    const token = req.header('x-token')
    if(!token) {
        return res.status(401).json({
            msg: "No hay token en la petición"
        })
    }
    try {
        jwt.verify(token, process.env.SECRET );

        next();
        
    } catch (error) {
        res.status(401).json({
            msg: 'Token no valido'
        })

        
    }
   

}

export {
    validarJwt
}