import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export class AuthController {
  /**
   * Login simplificado por email para el prototipo CGU
   */
  async login(req: Request, res: Response) {
    try {
      const { email } = req.body;
      console.log(`[AUTH] Intento de login para: ${email}`);

      if (!email) {
        return res.status(400).json({ message: 'El email es obligatorio' });
      }

      // 1. Buscar si es Alumno
      const alumno = await prisma.alumno.findUnique({
        where: { email },
        include: { matriculas: true }
      });
      if (alumno) {
        console.log(`[AUTH] Alumno encontrado: ${alumno.nombre}`);
        return res.json({ user: alumno, role: 'student' });
      }

      // 2. Buscar si es Profesor
      const profesor = await prisma.profesor.findUnique({
        where: { email },
        include: { 
          directorDeGrado: true,
          asignaturas: true
        }
      });

      if (profesor) {
        console.log(`[AUTH] Profesor encontrado: ${profesor.nombre}`);
        // Si es profesor, verificar si también es director
        if (profesor.directorDeGrado) {
          console.log(`[AUTH] El profesor es también Director`);
          return res.json({ user: profesor, role: 'director', directorId: profesor.directorDeGrado.id });
        }
        return res.json({ user: profesor, role: 'professor' });
      }

      // 3. Buscar si es Secretaría
      if (email.includes('secretaria')) {
        console.log(`[AUTH] Entrando como Secretaría (Mock)`);
        return res.json({ user: { nombre: 'Personal de Secretaría', email }, role: 'secretaria' });
      }

      console.warn(`[AUTH] Usuario no encontrado para: ${email}`);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export const authController = new AuthController();
