import { Router } from 'express';
import { academicController } from '../controllers/AcademicController';

const router = Router();

router.get('/teacher/:profesorId/asignaturas', academicController.getTeacherAsignaturas);
router.get('/asignatura/:asignaturaId/alumnos', academicController.getAsignaturaAlumnos);
router.get('/asignatura/:asignaturaId/sessions', academicController.getSessionsByAsignatura);
router.post('/sessions', academicController.createSession);

export default router;
