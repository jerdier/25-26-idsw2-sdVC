import { Router } from 'express';
import { attendanceController } from '../controllers/AttendanceController';

const router = Router();

// POST /api/attendance
router.post('/', attendanceController.recordAttendance);

// GET /api/attendance/session/:sesionId
router.get('/session/:sesionId', attendanceController.getAttendanceBySession);

export default router;
