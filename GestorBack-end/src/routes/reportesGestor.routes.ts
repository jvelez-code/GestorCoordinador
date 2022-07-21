import { Router } from "express";
import ReporGestor  from "../controller/reportesGestorController";
import AuthController from "../controller/authController";
import { checkJwt } from "../middewares/jwt";
const router =  Router();

router.get('/reportes', ReporGestor.getReportes );
router.get('/reportes/:id', ReporGestor.getReportesid );
router.post('/reportes', ReporGestor.postReportes );
router.get('/gestion', ReporGestor.getReportesGestion );
router.post('/gestion', ReporGestor.postReportesGestion );
router.post('/detallegestiones', ReporGestor.postDetalleGestiones );
router.post('/porcentaje', ReporGestor.postPorcentajeTipificacion );

export default router;
 