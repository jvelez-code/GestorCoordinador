import { Router } from 'express';
import { 
    selectUsuario,
    insertUsuario,
    updateUsuario,
    deleteUsuario
      } from '../controller/usuario.controller'

      
const router = Router();

router.get('/', selectUsuario );
router.post('/', insertUsuario );
router.put('/:id', updateUsuario );
router.delete('/:id',deleteUsuario);
export default router;