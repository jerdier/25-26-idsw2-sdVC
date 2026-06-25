import { Router } from 'express';
import { usuarioController } from '../controllers/UsuarioController';

const router = Router();

// CU: consultarUsuario
router.get('/', usuarioController.consultarUsuario);
router.get('/:id', usuarioController.getUsuario);

// CU: editarUsuario
router.put('/:id', usuarioController.editarUsuario);
router.delete('/:id', usuarioController.deleteUsuario);

export default router;
