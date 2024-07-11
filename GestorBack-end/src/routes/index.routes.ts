import { Router } from "express";

import  usuario from "./usuario.routes";
import  authUsuario from "./auth_usuario.routes";
import  askEstadoExtension from "./askEstadoExtension.routes ";
import  auth from "./auth"

import reporContact from "./reportesContact.routes";
import reporGestor  from "./reportesGestor.routes";
import askEstados   from "./askEstado.routes ";



const router = Router();

router.use('/auth', auth)
router.use('/authUsuario', authUsuario);
router.use('/askEstadoExtension', askEstadoExtension);
router.use('/usuario', usuario);
router.use('/reporContact', reporContact);
router.use('/reporGestor', reporGestor );
router.use('/askEstado', askEstados );


export default router;

