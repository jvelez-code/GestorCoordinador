import { Router } from "express";

import  usuario from "./usuario.routes";
import  askEstadoExtension from "./askEstadoExtension.routes ";
import reporContact from "./reportesContact.routes";
import reporGestor  from "./reportesGestor.routes";
import askEstados   from "./askEstado.routes ";

const jwt = require("jsonwebtoken");
const secret = process.env.SECRET



const router = Router();
router.use('/apinode/askEstadoExtension', askEstadoExtension);
router.use('/apinode/usuario', usuario);
router.use('/apinode/reporContact', reporContact);
router.use('/apinode/reporGestor', reporGestor );
router.use('/apinode/askEstado', askEstados );

router.use('/token',(req, res)=>{
    const {id:sub, name} = {id: "jaime", name: "velez"}
    const token =jwt.sign({
        sub,
        name,
        exp: Math.floor(Date.now() / 1000) + 60, // Expira en 60 segundos
    }, secret)
    res.send({ token })
});



router.get('/private', (req, res)=> {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).send({ error: 'Token missing or malformed' });
        }

        const token = authHeader.split(' ')[1];

        // Verificar y decodificar el token
        const payload = jwt.verify(token, secret);

        // Si el token es válido, responde con un mensaje de éxito
        res.send({ message: 'Access granted', payload });
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).send({ error: "Token expired" });
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).send({ error: "Invalid token" });
        } else {
            return res.status(500).send({ error: "An unexpected error occurred" });
        }
    }
});

export default router;

