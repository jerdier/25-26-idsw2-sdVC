import { Request, Response } from 'express';
import { attendanceService } from '../services/AttendanceService';

export class AttendanceController {
  async getAttendanceBySession(req: Request, res: Response) {
    try {
      const sesionId = req.params['sesionId'] as string;
      res.json(await attendanceService.getAttendanceBySession(sesionId));
    } catch (error: any) { res.status(500).json({ message: error.message }); }
  }

  // CU: registrarTomaAsistencia
  async registrarTomaAsistencia(req: Request, res: Response) {
    try {
      res.json(await attendanceService.registrarTomaAsistencia(req.body));
    } catch (error: any) { res.status(500).json({ message: error.message }); }
  }

  // CU: exportarHistorialAsistencias
  async exportarHistorialAsistencias(req: Request, res: Response) {
    try {
      const sesionId = req.params['sesionId'] as string;
      const formato = (req.query['formato'] as string) || 'CSV';
      const archivo = await attendanceService.exportarHistorialAsistencias(sesionId, formato);
      res.setHeader('Content-Disposition', `attachment; filename="historial-${sesionId}.csv"`);
      res.setHeader('Content-Type', 'text/csv');
      res.send(archivo);
    } catch (error: any) { res.status(500).json({ message: error.message }); }
  }
}

export const attendanceController = new AttendanceController();
