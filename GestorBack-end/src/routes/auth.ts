import { Router } from "express";
import AuthController from "../controller/authController";
import { checkJwt } from "../middewares/jwt";
const router= Router();

//login
router.post('/login', AuthController.login );
router.get('/', AuthController.logins );

//Cambio de contraseña
router.post('/cambio-contrasena', [checkJwt] ,AuthController.cambioContrasena)


export default router; 

