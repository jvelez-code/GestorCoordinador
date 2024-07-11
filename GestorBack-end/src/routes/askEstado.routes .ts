import { Router } from 'express';
import askEstados from '../controller/askEstados.Controler';



const router = Router();

router.post('/askLogEstados', askEstados.postAskEstados );

export default router;