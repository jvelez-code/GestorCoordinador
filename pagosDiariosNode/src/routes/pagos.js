const { Router } =require('express');
const { pagosGet, pagosPost, dataPost } = require('../controllers/pagos');

const router = Router();

router.post('/obtenerPagos', dataPost)
router.get('/', pagosGet);
router.post('/', pagosPost)

module.exports = router;