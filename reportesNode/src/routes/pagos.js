const { Router } =require('express');
const { pagosGet, postComercial, pagosPost } = require('../controllers/pagosDiarios');

const router = Router();
router.get('/', pagosGet);
router.post('/comercial', postComercial);
router.post('/', pagosPost);

module.exports = router;