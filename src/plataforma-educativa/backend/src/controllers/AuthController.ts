import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      let { email, password } = req.body;
      if (email) email = email.trim().toLowerCase();

      if (!email || !password) {
        return res.status(400).json({ message: 'Identidad y clave obligatorias' });
      }

      // 1. SISTEMA ADMINISTRATIVO (ADMIN)
      const admin = await prisma.administrador.findFirst({
        where: { email: { equals: email, mode: 'insensitive' } }
      });
      if (admin) {
        if (admin.password !== password) return res.status(401).json({ message: 'Clave de administrador incorrecta' });
        return res.json({ user: admin, role: 'administrador' });
      }

      // 2. SECRETARÍA
      const secretaria = await prisma.secretariaAcademica.findFirst({
        where: { email: { equals: email, mode: 'insensitive' } }
      });
      if (secretaria) {
        if (secretaria.password !== password) return res.status(401).json({ message: 'Clave incorrecta' });
        return res.json({ user: secretaria, role: 'secretaria' });
      }

      // 3. ALUMNOS
      const alumno = await prisma.alumno.findFirst({
        where: { email: { equals: email, mode: 'insensitive' } }
      });
      if (alumno) {
        if (alumno.password !== password) return res.status(401).json({ message: 'Clave incorrecta' });
        return res.json({ user: alumno, role: 'student' });
      }

      // 4. DIRECTORES DE GRADO
      const director = await prisma.directorDeGrado.findFirst({
        where: { email: { equals: email, mode: 'insensitive' } }
      });
      if (director) {
        if (director.password !== password) return res.status(401).json({ message: 'Clave incorrecta' });
        return res.json({ user: director, role: 'director', directorId: director.id });
      }

      // 5. PROFESORES
      const profesor = await prisma.profesor.findFirst({
        where: { email: { equals: email, mode: 'insensitive' } }
      });
      if (profesor) {
        if (profesor.password !== password) return res.status(401).json({ message: 'Clave incorrecta' });
        return res.json({ user: profesor, role: 'professor' });
      }

      return res.status(404).json({ message: 'Identidad no reconocida' });

    } catch (error: any) {
      console.error('[AUTH ERROR DETAIL]', error);
      res.status(500).json({ message: 'Error de infraestructura', error: error.message, stack: error.stack });
    }
  }
}

export const authController = new AuthController();
