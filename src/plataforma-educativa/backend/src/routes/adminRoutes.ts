import { Router } from 'express';
import { usuarioController } from '../controllers/UsuarioController';

const router = Router();

// CU: crearUsuario
router.post('/usuarios', usuarioController.crearUsuario);

export default router;
