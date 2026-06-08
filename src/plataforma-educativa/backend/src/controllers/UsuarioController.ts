import { Request, Response } from 'express';
import { usuarioService } from '../services/UsuarioService';

export class UsuarioController {
  /**
   * GET /api/usuarios/:id
   * CU: Consultar Usuario
   */
  async getUsuario(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const usuario = await usuarioService.getUsuario(id as string);
      res.json(usuario);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  /**
   * PUT /api/usuarios/:id
   * CU: Editar Usuario
   */
  async updateUsuario(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const usuario = await usuarioService.updateUsuario(id as string, req.body);
      res.json(usuario);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * DELETE /api/usuarios/:id
   * CU: Eliminar Usuario
   */
  async deleteUsuario(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await usuarioService.deleteUsuario(id as string);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export const usuarioController = new UsuarioController();
