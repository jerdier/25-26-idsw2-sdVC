import { Router } from 'express';
import { dispensaController } from '../controllers/DispensaController';

const router = Router();

// POST /api/dispensas
router.post('/', dispensaController.createDispensa);

// PUT /api/dispensas/:id/rectificar (Para Alumno y Secretaría)
router.put('/:id/rectificar', dispensaController.updateDispensa);

// PATCH /api/dispensas/:id/status (Para Director de Grado)
router.patch('/:id/status', dispensaController.updateStatus);

// GET /api/dispensas/alumno/:alumnoId (Para Alumno)
router.get('/alumno/:alumnoId', dispensaController.getByAlumno);

// GET /api/dispensas/profesor/:profesorId (Para Profesor)
router.get('/profesor/:profesorId', dispensaController.getByProfesor);

// GET /api/dispensas (Para Secretaría - Catálogo Total)
router.get('/', dispensaController.getAllDispensas);

export default router;
