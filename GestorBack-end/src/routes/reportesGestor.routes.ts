import { Router } from "express";
import ReporGestor  from "../controller/reportesGestorController";
const router =  Router();

router.get('/reportes', ReporGestor.getReportes );
router.get('/reportes/:id', ReporGestor.getReportesid );
router.post('/reportess', ReporGestor.postReportesNuevo );
router.post('/reportes', ReporGestor.postReportesEmpresa );
router.get('/gestion', ReporGestor.getReportesGestion );
router.post('/gestion', ReporGestor.postReportesGestion );
router.post('/detallegestiones', ReporGestor.postDetalleGestiones );
router.post('/porcentaje', ReporGestor.postPorcentajeTipificacion );
router.post('/monitoreoLLamadas', ReporGestor.postMonitoreoLlamadas );
router.get('/empresas', ReporGestor.getEmpresas );
router.post('/campanas', ReporGestor.postCampanas );
router.post('/compromisos', ReporGestor.postCompromisos );
router.post('/gestionComercial', ReporGestor.postGestionComercial );
router.post('/ConsolidadodeCicloVida', ReporGestor.postConsolidadoCicloVida );



export default router;
 