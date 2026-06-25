import { Request, Response } from 'express';
import { usuarioService } from '../services/UsuarioService';

export class UsuarioController {
  async getUsuario(req: Request, res: Response) {
    try {
      const id = req.params['id'] as string;
      res.json(await usuarioService.getUsuario(id));
    } catch (error: any) { res.status(404).json({ message: error.message }); }
  }

  async deleteUsuario(req: Request, res: Response) {
    try {
      const id = req.params['id'] as string;
      await usuarioService.deleteUsuario(id);
      res.status(204).send();
    } catch (error: any) { res.status(400).json({ message: error.message }); }
  }

  // CU: consultarUsuario
  async consultarUsuario(req: Request, res: Response) {
    try {
      const filtro = req.query['filtro'] as string | undefined;
      res.json(await usuarioService.consultarUsuario(filtro));
    } catch (error: any) { res.status(500).json({ message: error.message }); }
  }

  // CU: editarUsuario
  async editarUsuario(req: Request, res: Response) {
    try {
      const id = req.params['id'] as string;
      res.json(await usuarioService.editarUsuario(id, req.body));
    } catch (error: any) { res.status(400).json({ message: error.message }); }
  }

  // CU: crearUsuario
  async crearUsuario(req: Request, res: Response) {
    try {
      res.status(201).json(await usuarioService.crearUsuario(req.body));
    } catch (error: any) { res.status(400).json({ message: error.message }); }
  }
}

export const usuarioController = new UsuarioController();
