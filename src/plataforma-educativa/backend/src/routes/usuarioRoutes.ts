import { Router } from 'express';
import { usuarioController } from '../controllers/UsuarioController';

const router = Router();

// CU: abrirUsuarios
router.get('/', usuarioController.abrirUsuarios);
// CU: consultarUsuario
router.get('/:id', usuarioController.consultarUsuario);

// CU: editarUsuario
router.put('/:id', usuarioController.editarUsuario);
router.delete('/:id', usuarioController.deleteUsuario);

// Asignación de asignaturas a alumno
router.get('/:id/asignaturas', usuarioController.getAlumnoAsignaturas);
router.put('/:id/asignaturas', usuarioController.asignarAsignaturas);

export default router;
