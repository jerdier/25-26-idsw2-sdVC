import { Router } from 'express';
import { secretariaController } from '../controllers/SecretariaController';

const router = Router();

router.get('/stats', secretariaController.getStats);

router.get('/alumnos', secretariaController.getAlumnos);
router.post('/alumnos', secretariaController.createAlumno);

router.get('/profesores', secretariaController.getProfesores);
router.post('/profesores', secretariaController.createProfesor);

router.get('/grados', secretariaController.getGrados);
router.post('/grados', secretariaController.createGrado);

router.post('/matriculas', secretariaController.createMatricula);

export default router;
