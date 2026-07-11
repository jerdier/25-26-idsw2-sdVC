import { Request, Response } from 'express';
import { secretariaService } from '../services/SecretariaService';

export class SecretariaController {
  // CU: abrirAlumnos
  async abrirAlumnos(req: Request, res: Response) {
    try {
      const filtro = req.query['filtro'] as string | undefined;
      res.json(await secretariaService.abrirAlumnos(filtro));
    } catch (error: any) { res.status(500).json({ message: error.message }); }
  }

  // CU: consultarAlumno
  async consultarAlumno(req: Request, res: Response) {
    try {
      res.json(await secretariaService.consultarAlumno(req.params['alumnoId'] as string));
    } catch (error: any) { res.status(404).json({ message: error.message }); }
  }

  // CU: abrirMatriculas
  async abrirMatriculas(req: Request, res: Response) {
    try {
      const filtro = req.query['filtro'] as string | undefined;
      res.json(await secretariaService.abrirMatriculas(filtro));
    } catch (error: any) { res.status(500).json({ message: error.message }); }
  }

  // CU: cerrarCicloAcademico
  async cerrarCicloAcademico(req: Request, res: Response) {
    try {
      res.json(await secretariaService.cerrarCicloAcademico());
    } catch (error: any) { res.status(500).json({ message: error.message }); }
  }

  // CU: consultarDetalleMatricula
  async consultarDetalleMatricula(req: Request, res: Response) {
    try {
      res.json(await secretariaService.consultarDetalleMatricula(req.params['alumnoId'] as string));
    } catch (error: any) { res.status(500).json({ message: error.message }); }
  }

  // CU: importarAlumnos
  async importarAlumnos(req: Request, res: Response) {
    try {
      const archivo = req.body;
      if (!secretariaService.validarArchivo(archivo)) return res.status(400).json({ message: 'Formato no válido' });
      const informe = await secretariaService.importarAlumnos(archivo);
      res.json({ informe });
    } catch (error: any) { res.status(500).json({ message: error.message }); }
  }

  // CU: importarMatriculas
  async importarMatriculas(req: Request, res: Response) {
    try {
      const archivo = req.body;
      if (!secretariaService.validarArchivo(archivo)) return res.status(400).json({ message: 'Formato no válido' });
      const informe = await secretariaService.importarMatriculas(archivo);
      res.json({ informe });
    } catch (error: any) { res.status(500).json({ message: error.message }); }
  }
}

export const secretariaController = new SecretariaController();
