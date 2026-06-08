import prisma from '../lib/prisma';

export class UsuarioService {
  /**
   * Obtiene un usuario por ID buscando en todas las tablas relevantes.
   */
  async getUsuario(id: string) {
    const alumno = await prisma.alumno.findUnique({ where: { id } });
    if (alumno) return { ...alumno, role: 'student' };

    const profesor = await prisma.profesor.findUnique({ where: { id } });
    if (profesor) return { ...profesor, role: 'professor' };

    const director = await prisma.directorDeGrado.findUnique({ where: { id } });
    if (director) return { ...director, role: 'director' };

    const secretaria = await prisma.secretariaAcademica.findUnique({ where: { id } });
    if (secretaria) return { ...secretaria, role: 'secretaria' };

    throw new Error('Usuario no encontrado');
  }

  /**
   * Actualiza los datos de un usuario.
   */
  async updateUsuario(id: string, data: any) {
    const alumno = await prisma.alumno.findUnique({ where: { id } });
    if (alumno) {
      return await prisma.alumno.update({
        where: { id },
        data: {
          nombre: data.nombre,
          email: data.email,
          numeroRegistro: data.numeroRegistro,
          ...(data.password ? { password: data.password } : {})
        }
      });
    }

    const profesor = await prisma.profesor.findUnique({ where: { id } });
    if (profesor) {
      return await prisma.profesor.update({
        where: { id },
        data: {
          nombre: data.nombre,
          email: data.email,
          ...(data.password ? { password: data.password } : {})
        }
      });
    }

    const director = await prisma.directorDeGrado.findUnique({ where: { id } });
    if (director) {
      return await prisma.directorDeGrado.update({
        where: { id },
        data: {
          nombre: data.nombre,
          email: data.email,
          ...(data.password ? { password: data.password } : {})
        }
      });
    }

    const secretaria = await prisma.secretariaAcademica.findUnique({ where: { id } });
    if (secretaria) {
      return await prisma.secretariaAcademica.update({
        where: { id },
        data: {
          nombre: data.nombre,
          email: data.email,
          ...(data.password ? { password: data.password } : {})
        }
      });
    }

    throw new Error('No se puede actualizar: Usuario no identificado');
  }

  /**
   * Elimina un usuario por su ID.
   */
  async deleteUsuario(id: string) {
    const alumno = await prisma.alumno.findUnique({ where: { id } });
    if (alumno) return await prisma.alumno.delete({ where: { id } });

    const profesor = await prisma.profesor.findUnique({ where: { id } });
    if (profesor) return await prisma.profesor.delete({ where: { id } });

    const director = await prisma.directorDeGrado.findUnique({ where: { id } });
    if (director) return await prisma.directorDeGrado.delete({ where: { id } });

    const secretaria = await prisma.secretariaAcademica.findUnique({ where: { id } });
    if (secretaria) return await prisma.secretariaAcademica.delete({ where: { id } });

    throw new Error('No se puede eliminar: Usuario no identificado');
  }
}

export const usuarioService = new UsuarioService();
