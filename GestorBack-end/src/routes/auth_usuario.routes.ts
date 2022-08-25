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

router.get('/', [checkJwt], checkRole([1]),selectAuthUsuario );
router.get('/:id', selectAuthUsuarioId );
router.post('/',  insertAuthUsuario );
router.put('/:id', updateAuthUsuario );
router.delete('/:id',deleteAuthUsuario);
export default router;

//checkRole(['1'])]
//[checkJwt], checkRole([2]), insertAuthUsuario 