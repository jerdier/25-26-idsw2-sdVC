import { Request, Response } from 'express';
import { attendanceService } from '../services/AttendanceService';

export class AttendanceController {
  async recordAttendance(req: Request, res: Response) {
    try {
      const attendance = await attendanceService.recordAttendance(req.body);
      res.status(200).json(attendance);
    } catch (error: any) {
      res.status(500).json({ 
        message: 'Error al registrar asistencia',
        error: error.message 
      });
    }
  }

  async getAttendanceBySession(req: Request, res: Response) {
    try {
      const { sesionId } = req.params;
      const attendance = await attendanceService.getAttendanceBySession(sesionId);
      res.status(200).json(attendance);
    } catch (error: any) {
      res.status(500).json({ 
        message: 'Error al obtener asistencia de la sesión',
        error: error.message 
      });
    }
  }
}

export const attendanceController = new AttendanceController();
