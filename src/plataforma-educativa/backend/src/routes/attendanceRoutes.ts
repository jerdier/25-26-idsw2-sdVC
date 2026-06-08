import { Router } from 'express';
import { attendanceController } from '../controllers/AttendanceController';

const router = Router();

router.post('/record', attendanceController.recordAttendance);
router.get('/session/:sesionId', attendanceController.getAttendanceBySession);
router.get('/history/:asignaturaId', attendanceController.getHistory);

export default router;
