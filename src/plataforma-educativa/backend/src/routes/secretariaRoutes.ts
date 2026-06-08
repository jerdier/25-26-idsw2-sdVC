import { Router } from 'express';
import { secretariaController } from '../controllers/SecretariaController';

const router = Router();

router.get('/stats', secretariaController.getStats);

router.get('/alumnos', secretariaController.getAlumnos);
router.post('/alumnos', secretariaController.createAlumno);

router.get('/profesores', secretariaController.getProfesores);
router.post('/profesores', secretariaController.createProfesor);

router.get('/directores', secretariaController.getDirectores);
router.post('/directores', secretariaController.createDirector);

router.get('/secretarias', secretariaController.getSecretarias);
router.post('/secretarias', secretariaController.createSecretaria);

router.get('/grados', secretariaController.getGrados);
router.post('/grados', secretariaController.createGrado);

router.post('/matriculas', secretariaController.createMatricula);

router.post('/import/alumnos', secretariaController.importAlumnos);

export default router;
