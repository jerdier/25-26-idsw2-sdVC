import { Router } from 'express';
import { academicController } from '../controllers/AcademicController';

const router = Router();

// CU: crearSesionClase
router.post('/sessions', academicController.crearSesionClase);
// CU: editarSesionClase / cerrarSesionClase / eliminarSesionClase (rutas estáticas antes que :id)
router.put('/sessions/:id/cerrar', academicController.cerrarSesionClase);
router.put('/sessions/:id', academicController.editarSesionClase);
router.delete('/sessions/:id', academicController.eliminarSesionClase);

// Helpers de consulta
router.get('/asignaturas', academicController.getAllAsignaturas);
router.get('/teacher/:profesorId/asignaturas', academicController.getTeacherAsignaturas);
router.get('/teacher/:profesorId/sessions', academicController.getTeacherSessions);
router.get('/teacher/:profesorId/alumnos', academicController.getTeacherAlumnos);
router.get('/sessions/:sesionId', academicController.getSession);
router.get('/sessions/:id/alumnos', academicController.getSessionAlumnos);
router.get('/alumno/:alumnoId/sessions', academicController.getSessionsForAlumno);
router.get('/alumno/:alumnoId', academicController.getAlumno);
router.get('/asignatura/:asignaturaId/alumnos', academicController.getAsignaturaAlumnos);

export default router;
