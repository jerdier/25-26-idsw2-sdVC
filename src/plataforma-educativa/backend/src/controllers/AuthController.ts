import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export class AuthController {
  /**
   * Login simplificado por email para el prototipo CGU
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      console.log(`[AUTH] Intento de login para: ${email}`);

      if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
      }

      // 1. Buscar si es Alumno
      const alumno = await prisma.alumno.findUnique({
        where: { email },
        include: { matriculas: true }
      });
      if (alumno) {
        if (alumno.password !== password) {
          return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
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
        if (profesor.password !== password) {
          return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
        console.log(`[AUTH] Profesor encontrado: ${profesor.nombre}`);
        if (profesor.directorDeGrado) {
          return res.json({ user: profesor, role: 'director', directorId: profesor.directorDeGrado.id });
        }
        return res.json({ user: profesor, role: 'professor' });
      }

      // 3. Buscar si es Secretaría
      const secretaria = await prisma.secretariaAcademica.findUnique({
        where: { email }
      });

      if (secretaria) {
        if (secretaria.password !== password) {
          return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
        console.log(`[AUTH] Secretaría encontrada: ${secretaria.nombre}`);
        return res.json({ user: secretaria, role: 'secretaria' });
      }

      console.warn(`[AUTH] Usuario no encontrado para: ${email}`);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export const authController = new AuthController();
