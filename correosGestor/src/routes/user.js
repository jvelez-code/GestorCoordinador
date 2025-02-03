const {Router} = require('express');
const { usuariosGet, correosCalidad } = require('../controller/user');

const router = Router();


router.get('/', usuariosGet);
router.post('/', correosCalidad)


module.exports = router;