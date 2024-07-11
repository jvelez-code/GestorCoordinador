import { Router } from 'express';
import { postMonitoreo, selectUsuarios } from '../controller/askEstadoExtension.controller';



const router = Router();

router.post('/monitoreo', postMonitoreo );
router.get('/monitoreo', selectUsuarios );

export default router;