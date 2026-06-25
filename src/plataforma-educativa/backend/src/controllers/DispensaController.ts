import { Request, Response } from 'express';
import { dispensaService } from '../services/DispensaService';

export class DispensaController {
  async getDispensa(req: Request, res: Response) {
    try {
      const id = req.params['id'] as string;
      res.json(await dispensaService.getDispensa(id));
    } catch (error: any) { res.status(404).json({ message: error.message }); }
  }

  async getDispensasByProfesor(req: Request, res: Response) {
    try {
      const profesorId = req.params['profesorId'] as string;
      res.json(await dispensaService.getDispensasByProfesor(profesorId));
    } catch (error: any) { res.status(500).json({ message: error.message }); }
  }

  async deleteDispensa(req: Request, res: Response) {
    try {
      const id = req.params['id'] as string;
      await dispensaService.deleteDispensa(id);
      res.status(204).send();
    } catch (error: any) { res.status(500).json({ message: error.message }); }
  }

  // CU: crearSolicitudDispensa
  async crearSolicitudDispensa(req: Request, res: Response) {
    try {
      res.status(201).json(await dispensaService.crearSolicitudDispensa(req.body));
    } catch (error: any) { res.status(500).json({ message: error.message }); }
  }

  // CU: consultarSolicitudDispensa
  async consultarSolicitudDispensa(req: Request, res: Response) {
    try {
      res.json(await dispensaService.consultarSolicitudDispensa(req.query));
    } catch (error: any) { res.status(500).json({ message: error.message }); }
  }

  // CU: editarSolicitudDispensa
  async editarSolicitudDispensa(req: Request, res: Response) {
    try {
      const id = req.params['id'] as string;
      res.json(await dispensaService.editarSolicitudDispensa(id, req.body));
    } catch (error: any) { res.status(500).json({ message: error.message }); }
  }

  // CU: guardarSolicitudDispensa
  async guardarSolicitudDispensa(req: Request, res: Response) {
    try {
      const id = req.params['id'] as string;
      res.json(await dispensaService.guardarSolicitudDispensa(id, req.body));
    } catch (error: any) { res.status(500).json({ message: error.message }); }
  }

  // CU: exportarDispensas
  async exportarDispensas(req: Request, res: Response) {
    try {
      const formato = (req.query['formato'] as string) || 'CSV';
      const archivo = await dispensaService.exportarDispensas(req.query, formato);
      res.setHeader('Content-Disposition', 'attachment; filename="dispensas.csv"');
      res.setHeader('Content-Type', 'text/csv');
      res.send(archivo);
    } catch (error: any) { res.status(500).json({ message: error.message }); }
  }
}

export const dispensaController = new DispensaController();
