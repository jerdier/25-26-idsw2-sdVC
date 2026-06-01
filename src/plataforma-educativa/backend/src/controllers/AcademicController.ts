import { Request, Response } from 'express';
import { academicService } from '../services/AcademicService';

export class AcademicController {
  async getTeacherAsignaturas(req: Request, res: Response) {
    try {
      const { profesorId } = req.params;
      const asignaturas = await academicService.getTeacherAsignaturas(profesorId);
      res.json(asignaturas);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAsignaturaAlumnos(req: Request, res: Response) {
    try {
      const { asignaturaId } = req.params;
      const alumnos = await academicService.getAsignaturaAlumnos(asignaturaId);
      res.json(alumnos);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createSession(req: Request, res: Response) {
    try {
      const { asignaturaId, fecha } = req.body;
      const session = await academicService.createSession(asignaturaId, new Date(fecha));
      res.status(201).json(session);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getSessionsByAsignatura(req: Request, res: Response) {
    try {
      const { asignaturaId } = req.params;
      const sessions = await academicService.getSessionsByAsignatura(asignaturaId);
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export const academicController = new AcademicController();
