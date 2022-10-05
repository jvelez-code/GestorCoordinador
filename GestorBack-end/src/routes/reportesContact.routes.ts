import { Router } from "express";
import ReporContact  from "../controller/reportesContactController";
import AuthController from "../controller/authController";
import { checkJwt } from "../middewares/jwt";
const router =  Router();

router.post('/monitoreo',ReporContact.potsMonitoreo );
router.get('/a', AuthController.logins );
router.get('/', ReporContact.logins );

//reportes Contact
router.post('/tmo'         , ReporContact.postReporteTmo );
router.post('/tmodetallado', ReporContact.postReporteTmoDetallado );
router.post('/tmoSaliente' , ReporContact.postReporteTmoSaliente );
router.post('/devolucionfiltrada', ReporContact.postDevolucionFiltrada );
router.post('/calificacionServicio', ReporContact.postCalificacionServicio );
router.post('/llamadasRecibidas', ReporContact.postLlamadasRecibidas );
router.post('/tmoEntranteSaliente', ReporContact.postTmoEntranteSaliente );
router.post('/SecretariaVirtual', ReporContact.postSecretariaVirtual );
router.post('/llamadasporHora', ReporContact.postllamadasporHora);
router.post('/duracionEstado', ReporContact.postDuracionEstados);
router.post('/ivr', ReporContact.postIVR);

//reportes asterisk_pagosgde

router.post('/llamadasFueradeHorario', ReporContact.postLlamadasFueradeHorario);
router.post('/llamadasFueradeHorarioEventual', ReporContact.postLlamadasFueradeHorarioEventual);
router.post('/llamadasCalificadasGDE', ReporContact.postLlamadasCalificadasGDE);

export default router;
 