import { Router } from 'express';
import { 
    selectAuthUsuario,
    selectAuthUsuarioId,
    insertAuthUsuario,
    updateAuthUsuario,
    deleteAuthUsuario
      } from '../controller/auth_usuario.controller'
      
import { checkJwt } from '../middewares/jwt';
import { checkRole } from '../middewares/rol';


const router = Router();

router.get('/', selectAuthUsuario );
router.get('/:id', selectAuthUsuarioId );
router.post('/', [checkJwt], checkRole([2]), insertAuthUsuario );
router.put('/:id', updateAuthUsuario );
router.delete('/:id',deleteAuthUsuario);
export default router;

//checkRole(['1'])]