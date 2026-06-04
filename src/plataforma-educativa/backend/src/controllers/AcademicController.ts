import { Request, Response } from 'express';
import { academicService } from '../services/AcademicService';

export class AcademicController {
  async getTeacherAsignaturas(req: Request, res: Response) {
    try {
      const { profesorId } = req.params;
      const asignaturas = await academicService.getTeacherAsignaturas(profesorId as string);
      res.json(asignaturas);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAsignaturaAlumnos(req: Request, res: Response) {
    try {
      const { asignaturaId } = req.params;
      const alumnos = await academicService.getAsignaturaAlumnos(asignaturaId as string);
      res.json(alumnos);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createSession(req: Request, res: Response) {
    try {
      const { asignaturaId, fecha } = req.body;
      const session = await academicService.createSession(asignaturaId as string, new Date(fecha));
      res.status(201).json(session);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getSessionsByAsignatura(req: Request, res: Response) {
    try {
      const { asignaturaId } = req.params;
      const sessions = await academicService.getSessionsByAsignatura(asignaturaId as string);
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getSessionsForAlumno(req: Request, res: Response) {
    try {
      const { alumnoId } = req.params;
      const sessions = await academicService.getSessionsForAlumno(alumnoId as string);
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export const academicController = new AcademicController();
