import { Request, Response } from 'express';
import { secretariaService } from '../services/SecretariaService';

export class SecretariaController {
  // CU: consultarListaAlumnos / consultarDetalleAlumno
  async consultarListaAlumnos(req: Request, res: Response) {
    try {
      res.json(await secretariaService.consultarListaAlumnos());
    } catch (error: any) { res.status(500).json({ message: error.message }); }
  }

  // CU: consultarDetalleMatricula
  async consultarDetalleMatricula(req: Request, res: Response) {
    try {
      const alumnoId = req.params['alumnoId'] as string;
      res.json(await secretariaService.consultarDetalleMatricula(alumnoId));
    } catch (error: any) { res.status(500).json({ message: error.message }); }
  }

  // CU: importarListasAlumnos
  async importarListasAlumnos(req: Request, res: Response) {
    try {
      const archivo = req.body;
      if (!secretariaService.validarArchivo(archivo)) return res.status(400).json({ message: 'Formato no válido' });
      const informe = await secretariaService.importarListasAlumnos(archivo);
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
