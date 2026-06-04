import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export class AuthController {
  /**
   * Login simplificado por email para el prototipo CGU
   */
  async login(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'El email es obligatorio' });
      }

      // 1. Buscar si es Alumno
      const alumno = await prisma.alumno.findUnique({
        where: { email },
        include: { matriculas: true }
      });
      if (alumno) return res.json({ user: alumno, role: 'student' });

      // 2. Buscar si es Profesor
      const profesor = await prisma.profesor.findUnique({
        where: { email },
        include: { 
          director: true,
          asignaturas: true
        }
      });

      if (profesor) {
        // Si es profesor, verificar si también es director
        if (profesor.director) {
          return res.json({ user: profesor, role: 'director', directorId: profesor.director.id });
        }
        return res.json({ user: profesor, role: 'professor' });
      }

      // 3. Buscar si es Secretaría (En un sistema real habría una tabla, aquí usamos un mock o el primer registro)
      if (email.includes('secretaria')) {
        return res.json({ user: { nombre: 'Personal de Secretaría', email }, role: 'secretaria' });
      }

      return res.status(404).json({ message: 'Usuario no encontrado' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export const authController = new AuthController();
