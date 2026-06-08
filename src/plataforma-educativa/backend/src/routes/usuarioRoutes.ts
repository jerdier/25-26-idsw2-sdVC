import { Router } from 'express';
import { usuarioController } from '../controllers/UsuarioController';

const router = Router();

// CU: Consultar Usuario
router.get('/:id', usuarioController.getUsuario);

// CU: Editar Usuario
router.put('/:id', usuarioController.updateUsuario);

// CU: Eliminar Usuario
router.delete('/:id', usuarioController.deleteUsuario);

export default router;
