import { Router } from 'express';
import { academicController } from '../controllers/AcademicController';

const router = Router();

router.get('/teacher/:profesorId/asignaturas', academicController.getTeacherAsignaturas);
router.get('/asignatura/:asignaturaId/alumnos', academicController.getAsignaturaAlumnos);

// Gestión de Sesiones
router.get('/asignatura/:asignaturaId/sessions', academicController.getSessionsByAsignatura);
router.get('/alumno/:alumnoId/sessions', academicController.getSessionsForAlumno);
router.post('/sessions', academicController.createSession);
router.put('/sessions/:id', academicController.updateSession);
router.put('/sessions/:id/cerrar', academicController.closeSession);

export default router;
