const { Router } =require('express');
const { ReporGestor } = require('../controllers/reportesGestorController');
const router =  Router();



router.get('/reportes',ReporGestor.getReportes );
router.get('/reportes/:id', ReporGestor.getReportesid );
router.get('/empresas', ReporGestor.getEmpresas );
router.post('/reportess', ReporGestor.postReportesNuevo );
router.post('/reportes', ReporGestor.postReportesEmpresa );
router.get('/gestion', ReporGestor.getReportesGestion );
router.post('/gestion', ReporGestor.postReportesGestion );
router.post('/detallegestiones', ReporGestor.postDetalleGestiones );
router.post('/porcentaje', ReporGestor.postPorcentajeTipificacion );
router.post('/monitoreoLLamadas', ReporGestor.postMonitoreoLlamadas );
router.post('/campanas', ReporGestor.postCampanas );
router.post('/compromisos', ReporGestor.postCompromisos );
router.post('/gestionComercial', ReporGestor.postGestionComercial );
router.post('/ConsolidadodeCicloVida', ReporGestor.postConsolidadoCicloVida );
router.post('/ReporteAgenda', ReporGestor.postAgendaComercial);
router.post('/ControlVisitas', ReporGestor.postVisitaComercial);
router.post('/registrosnuevos', ReporGestor.postFidelizacionComercial);
router.post('/porcentaje', ReporGestor.postPorcentajeTipificacion);
router.post('/menus', ReporGestor.postMenus);
router.post('/seguimiento', ReporGestor.postSeguimientoAgente);


module.exports = router;
 