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

router.get('/', [checkJwt], checkRole([1]), selectAuthUsuario );
router.get('/:id', [checkJwt], checkRole([1]), selectAuthUsuarioId );
router.post('/', [checkJwt], checkRole([1]), insertAuthUsuario );
router.put('/:id', [checkJwt], checkRole([1]),updateAuthUsuario );
router.delete('/:id',[checkJwt], checkRole([1]), deleteAuthUsuario);
export default router;

//checkRole(['1'])]
//[checkJwt], checkRole([2]), insertAuthUsuario 