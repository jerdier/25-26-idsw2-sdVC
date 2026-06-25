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

      const admin = await prisma.administrador.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } });
      if (admin) {
        if (admin.password !== password) return res.status(401).json({ message: 'Clave incorrecta' });
        return res.json({ user: admin, role: 'administrador' });
      }

      const secretaria = await prisma.secretariaAcademica.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } });
      if (secretaria) {
        if (secretaria.password !== password) return res.status(401).json({ message: 'Clave incorrecta' });
        return res.json({ user: secretaria, role: 'secretaria' });
      }

      const alumno = await prisma.alumno.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } });
      if (alumno) {
        if (alumno.password !== password) return res.status(401).json({ message: 'Clave incorrecta' });
        return res.json({ user: alumno, role: 'alumno' });
      }

      const director = await prisma.directorDeGrado.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } });
      if (director) {
        if (director.password !== password) return res.status(401).json({ message: 'Clave incorrecta' });
        return res.json({ user: director, role: 'directorDeGrado', directorId: director.id });
      }

      const profesor = await prisma.profesor.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } });
      if (profesor) {
        if (profesor.password !== password) return res.status(401).json({ message: 'Clave incorrecta' });
        return res.json({ user: profesor, role: 'profesor' });
      }

      return res.status(404).json({ message: 'Identidad no reconocida' });
    } catch (error: any) {
      res.status(500).json({ message: 'Error de infraestructura', error: error.message });
    }
  }
}

export const authController = new AuthController();
