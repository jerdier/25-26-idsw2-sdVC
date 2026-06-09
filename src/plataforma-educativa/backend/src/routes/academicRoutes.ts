import { Router } from 'express';
import { academicController } from '../controllers/AcademicController';

const router = Router();

router.get('/asignaturas', academicController.getAllAsignaturas);
router.get('/teacher/:profesorId/asignaturas', academicController.getTeacherAsignaturas);
router.get('/asignatura/:asignaturaId/alumnos', academicController.getAsignaturaAlumnos);
router.get('/alumno/:alumnoId/asignaturas', academicController.getStudentAsignaturas);
router.put('/asignatura/:id/profesor', academicController.assignProfesorToAsignatura);
router.delete('/asignatura/:id/profesor', academicController.unassignProfesorFromAsignatura);
router.post('/asignatura/:id/alumnos/:alumnoId', academicController.addAlumnoToAsignatura);
router.delete('/asignatura/:id/alumnos/:alumnoId', academicController.removeAlumnoFromAsignatura);

// Gestión de Sesiones
router.get('/asignatura/:asignaturaId/sessions', academicController.getSessionsByAsignatura);
router.get('/alumno/:alumnoId/sessions', academicController.getSessionsForAlumno);
router.get('/sessions/:id/alumnos', academicController.getSessionAlumnos);
router.post('/sessions', academicController.createSession);
router.put('/sessions/:id', academicController.updateSession);
router.put('/sessions/:id/cerrar', academicController.closeSession);
router.delete('/sessions/:id', academicController.deleteSession);

export default router;
