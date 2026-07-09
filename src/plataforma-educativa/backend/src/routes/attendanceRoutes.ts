import { Router } from 'express';
import { attendanceController } from '../controllers/AttendanceController';

const router = Router();

// CU: registrarTomaAsistencia
router.post('/record', attendanceController.registrarTomaAsistencia);
router.get('/session/:sesionId', attendanceController.getAttendanceBySession);
router.get('/alumno/:alumnoId', attendanceController.getAttendanceByAlumno);

// CU: exportarHistorialAsistencias
router.get('/session/:sesionId/export', attendanceController.exportarHistorialAsistencias);

export default router;
