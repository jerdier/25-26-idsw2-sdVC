import { Router } from 'express';
import { dispensaController } from '../controllers/DispensaController';

const router = Router();

// Rutas estáticas primero (antes de /:id)
router.post('/', dispensaController.crearSolicitudDispensa);
router.get('/export', dispensaController.exportarDispensas);
router.get('/profesor/:profesorId', dispensaController.getDispensasByProfesor);
router.get('/', dispensaController.consultarSolicitudDispensa);

// Rutas dinámicas después
router.get('/:id', dispensaController.getDispensa);
router.put('/:id/rectificar', dispensaController.editarSolicitudDispensa);
router.patch('/:id/status', dispensaController.guardarSolicitudDispensa);
router.delete('/:id', dispensaController.deleteDispensa);

export default router;
