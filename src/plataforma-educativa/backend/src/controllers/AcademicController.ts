import { Request, Response } from 'express';
import { academicService } from '../services/AcademicService';

export class AcademicController {
  async getTeacherAsignaturas(req: Request, res: Response) {
    try {
      const profesorId = req.params['profesorId'] as string;
      res.json(await academicService.getTeacherAsignaturas(profesorId));
    } catch (error: any) { res.status(500).json({ message: error.message }); }
  }

  async getAsignaturaAlumnos(req: Request, res: Response) {
    try {
      const asignaturaId = req.params['asignaturaId'] as string;
      res.json(await academicService.getAsignaturaAlumnos(asignaturaId));
    } catch (error: any) { res.status(500).json({ message: error.message }); }
  }

  async getSession(req: Request, res: Response) {
    try {
      const sesionId = req.params['sesionId'] as string;
      res.json(await academicService.getSession(sesionId));
    } catch (error: any) { res.status(500).json({ message: error.message }); }
  }

  async getAlumno(req: Request, res: Response) {
    try {
      const alumnoId = req.params['alumnoId'] as string;
      res.json(await academicService.getAlumno(alumnoId));
    } catch (error: any) { res.status(500).json({ message: error.message }); }
  }

  async getSessionAlumnos(req: Request, res: Response) {
    try {
      const id = req.params['id'] as string;
      res.json(await academicService.getSessionAlumnos(id));
    } catch (error: any) { res.status(500).json({ message: error.message }); }
  }

  async getTeacherSessions(req: Request, res: Response) {
    try {
      const profesorId = req.params['profesorId'] as string;
      res.json(await academicService.getTeacherSessions(profesorId));
    } catch (error: any) { res.status(500).json({ message: error.message }); }
  }

  async getSessionsForAlumno(req: Request, res: Response) {
    try {
      const alumnoId = req.params['alumnoId'] as string;
      res.json(await academicService.getSessionsForAlumno(alumnoId));
    } catch (error: any) { res.status(500).json({ message: error.message }); }
  }

  // CU: crearSesionClase
  async crearSesionClase(req: Request, res: Response) {
    try {
      const { asignaturaId, fecha, aula, duracion } = req.body;
      const sesion = await academicService.crearSesionClase(asignaturaId, new Date(fecha), aula, duracion);
      res.status(201).json(sesion);
    } catch (error: any) { res.status(500).json({ message: error.message }); }
  }

  // CU: editarSesionClase
  async editarSesionClase(req: Request, res: Response) {
    try {
      const id = req.params['id'] as string;
      res.json(await academicService.editarSesionClase(id, req.body));
    } catch (error: any) { res.status(500).json({ message: error.message }); }
  }

  // CU: cerrarSesionClase
  async cerrarSesionClase(req: Request, res: Response) {
    try {
      const id = req.params['id'] as string;
      res.json(await academicService.cerrarSesionClase(id));
    } catch (error: any) { res.status(500).json({ message: error.message }); }
  }
}

export const academicController = new AcademicController();
