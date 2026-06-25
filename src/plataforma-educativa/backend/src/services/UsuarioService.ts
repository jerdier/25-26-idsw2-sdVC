import prisma from '../lib/prisma';

export class UsuarioService {
  async getUsuario(id: string) {
    const alumno = await prisma.alumno.findUnique({ where: { id } });
    if (alumno) return { ...alumno, rol: 'alumno' };
    const profesor = await prisma.profesor.findUnique({ where: { id } });
    if (profesor) return { ...profesor, rol: 'profesor' };
    const director = await prisma.directorDeGrado.findUnique({ where: { id } });
    if (director) return { ...director, rol: 'directorDeGrado' };
    const secretaria = await prisma.secretariaAcademica.findUnique({ where: { id } });
    if (secretaria) return { ...secretaria, rol: 'secretaria' };
    throw new Error('Usuario no encontrado');
  }

  async deleteUsuario(id: string) {
    if (await prisma.alumno.findUnique({ where: { id } })) return prisma.alumno.delete({ where: { id } });
    if (await prisma.profesor.findUnique({ where: { id } })) return prisma.profesor.delete({ where: { id } });
    if (await prisma.directorDeGrado.findUnique({ where: { id } })) return prisma.directorDeGrado.delete({ where: { id } });
    if (await prisma.secretariaAcademica.findUnique({ where: { id } })) return prisma.secretariaAcademica.delete({ where: { id } });
    throw new Error('Usuario no encontrado');
  }

  // CU: consultarUsuario
  async consultarUsuario(filtro?: string) {
    const where = filtro
      ? { OR: [{ nombre: { contains: filtro, mode: 'insensitive' as const } }, { email: { contains: filtro, mode: 'insensitive' as const } }] }
      : {};

    const [alumnos, profesores, directores, secretarias] = await Promise.all([
      prisma.alumno.findMany({ where, select: { id: true, nombre: true, email: true, numeroRegistro: true } }).then(r => r.map(u => ({ ...u, rol: 'alumno' }))),
      prisma.profesor.findMany({ where, select: { id: true, nombre: true, email: true } }).then(r => r.map(u => ({ ...u, rol: 'profesor' }))),
      prisma.directorDeGrado.findMany({ where, select: { id: true, nombre: true, email: true } }).then(r => r.map(u => ({ ...u, rol: 'directorDeGrado' }))),
      prisma.secretariaAcademica.findMany({ where, select: { id: true, nombre: true, email: true } }).then(r => r.map(u => ({ ...u, rol: 'secretaria' })))
    ]);

    return [...alumnos, ...profesores, ...directores, ...secretarias];
  }

  // CU: editarUsuario
  async editarUsuario(id: string, data: any) {
    const alumno = await prisma.alumno.findUnique({ where: { id } });
    if (alumno) {
      if (data.email && data.email !== alumno.email) {
        const yaExiste = await prisma.alumno.findUnique({ where: { email: data.email } });
        if (yaExiste) throw new Error('El email ya está en uso');
      }
      return await prisma.alumno.update({
        where: { id },
        data: { nombre: data.nombre, email: data.email, numeroRegistro: data.numeroRegistro, ...(data.password ? { password: data.password } : {}) }
      });
    }
    const profesor = await prisma.profesor.findUnique({ where: { id } });
    if (profesor) return await prisma.profesor.update({ where: { id }, data: { nombre: data.nombre, email: data.email, ...(data.password ? { password: data.password } : {}) } });
    const director = await prisma.directorDeGrado.findUnique({ where: { id } });
    if (director) return await prisma.directorDeGrado.update({ where: { id }, data: { nombre: data.nombre, email: data.email, ...(data.password ? { password: data.password } : {}) } });
    const secretaria = await prisma.secretariaAcademica.findUnique({ where: { id } });
    if (secretaria) return await prisma.secretariaAcademica.update({ where: { id }, data: { nombre: data.nombre, email: data.email, ...(data.password ? { password: data.password } : {}) } });
    throw new Error('Usuario no encontrado');
  }

  // CU: crearUsuario
  async crearUsuario(data: { nombre: string; email: string; password?: string; rol: string; numeroRegistro?: string }) {
    const password = data.password || 'password123';
    switch (data.rol) {
      case 'alumno':
        return await prisma.alumno.create({ data: { nombre: data.nombre, email: data.email, password, numeroRegistro: data.numeroRegistro || `REG-${Date.now()}` } });
      case 'profesor':
        return await prisma.profesor.create({ data: { nombre: data.nombre, email: data.email, password } });
      case 'directorDeGrado':
        return await prisma.directorDeGrado.create({ data: { nombre: data.nombre, email: data.email, password } });
      case 'secretaria':
        return await prisma.secretariaAcademica.create({ data: { nombre: data.nombre, email: data.email, password } });
      default:
        throw new Error(`Rol desconocido: ${data.rol}`);
    }
  }
}

export const usuarioService = new UsuarioService();
