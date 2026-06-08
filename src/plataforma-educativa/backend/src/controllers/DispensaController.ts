import { Request, Response } from 'express';
import { dispensaService } from '../services/DispensaService';

export class DispensaController {
  async createDispensa(req: Request, res: Response) {
    try {
      const dispensa = await dispensaService.createDispensa(req.body);
      res.status(201).json(dispensa);
    } catch (error: any) {
      res.status(500).json({ 
        message: 'Error al crear la dispensa',
        error: error.message 
      });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dispensa = await dispensaService.updateStatus(id as string, req.body);
      res.status(200).json(dispensa);
    } catch (error: any) {
      res.status(500).json({ 
        message: 'Error al actualizar el estado de la dispensa',
        error: error.message 
      });
    }
  }

  async updateDispensa(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dispensa = await dispensaService.updateDispensa(id as string, req.body);
      res.status(200).json(dispensa);
    } catch (error: any) {
      res.status(500).json({ 
        message: 'Error al rectificar la dispensa',
        error: error.message 
      });
    }
  }

  async getByAlumno(req: Request, res: Response) {
    try {
      const { alumnoId } = req.params;
      const dispensas = await dispensaService.getDispensasByAlumno(alumnoId as string);
      res.status(200).json(dispensas);
    } catch (error: any) {
      res.status(500).json({ 
        message: 'Error al obtener las dispensas del alumno',
        error: error.message 
      });
    }
  }

  async getByProfesor(req: Request, res: Response) {
    try {
      const { profesorId } = req.params;
      const dispensas = await dispensaService.getDispensasByProfesor(profesorId as string);
      res.status(200).json(dispensas);
    } catch (error: any) {
      res.status(500).json({ 
        message: 'Error al obtener las dispensas para el profesor',
        error: error.message 
      });
    }
  }

  async getAllDispensas(req: Request, res: Response) {
    try {
      const dispensas = await dispensaService.getAllDispensas();
      res.status(200).json(dispensas);
    } catch (error: any) {
      res.status(500).json({ 
        message: 'Error al obtener las dispensas',
        error: error.message 
      });
    }
  }
}

export const dispensaController = new DispensaController();
