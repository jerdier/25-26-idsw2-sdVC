import { Request, Response } from 'express';
import { secretariaService } from '../services/SecretariaService';

export class SecretariaController {
  async getStats(req: Request, res: Response) {
    try {
      const stats = await secretariaService.getDashboardStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createAlumno(req: Request, res: Response) {
    try {
      const alumno = await secretariaService.createAlumno(req.body);
      res.status(201).json(alumno);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAlumnos(req: Request, res: Response) {
    try {
      const alumnos = await secretariaService.getAllAlumnos();
      res.json(alumnos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createProfesor(req: Request, res: Response) {
    try {
      const profesor = await secretariaService.createProfesor(req.body);
      res.status(201).json(profesor);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProfesores(req: Request, res: Response) {
    try {
      const profesores = await secretariaService.getAllProfesores();
      res.json(profesores);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createDirector(req: Request, res: Response) {
    try {
      const director = await secretariaService.createDirector(req.body);
      res.status(201).json(director);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getDirectores(req: Request, res: Response) {
    try {
      const directores = await secretariaService.getAllDirectores();
      res.json(directores);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createSecretaria(req: Request, res: Response) {
    try {
      const secretaria = await secretariaService.createSecretaria(req.body);
      res.status(201).json(secretaria);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getSecretarias(req: Request, res: Response) {
    try {
      const secretarias = await secretariaService.getAllSecretarias();
      res.json(secretarias);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createGrado(req: Request, res: Response) {
    try {
      const grado = await secretariaService.createGrado(req.body);
      res.status(201).json(grado);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getGrados(req: Request, res: Response) {
    try {
      const grados = await secretariaService.getAllGrados();
      res.json(grados);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createMatricula(req: Request, res: Response) {
    try {
      const matricula = await secretariaService.createMatricula(req.body);
      res.status(201).json(matricula);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async importAlumnos(req: Request, res: Response) {
    try {
      const result = await secretariaService.importAlumnos(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export const secretariaController = new SecretariaController();
