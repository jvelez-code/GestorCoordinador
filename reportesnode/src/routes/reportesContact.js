const { Router } = require('express');
const { ReporContact } = require('../controllers/reportesContactController');
const router =  Router();

router.post('/monitoreo',ReporContact.potsMonitoreo);
router.get('/', ReporContact.logins );

//Reportes Contact /reporContact'
router.post('/tmo', ReporContact.postReporteTmo );
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
router.post('/llamadasPerdidas', ReporContact.postLlamadasPerdidas);
router.post('/filtradosSecretaria', ReporContact.postFiltradosSecretaria);
router.post('/grabacionesPila', ReporContact.postGrabacionesPila);
router.post('/seguimientoAgentes', ReporContact.postSeguimientoAgentes);
router.post('/detalleAgentes', ReporContact.postDetalleAgentes);
router.post('/consultaApisIvr', ReporContact.postApisIvr);

//ask Estados
router.post('/askLogEstados', ReporContact.postAskEstados );

//reportes asterisk_pagosgde
router.post('/llamadasFueradeHorario', ReporContact.postLlamadasFueradeHorario);
router.post('/llamadasFueradeHorarioEventual', ReporContact.postLlamadasFueradeHorarioEventual);
router.post('/llamadasCalificadasGDE', ReporContact.postLlamadasCalificadasGDE);

//reportes EMBARGOS
router.post('/detalleEstadosEmb', ReporContact.detalleEstadosEmb);

module.exports = router;
 