import prisma from '../lib/prisma';

export class SecretariaService {
  validarArchivo(archivo: any): boolean {
    return archivo && (Array.isArray(archivo.alumnos) || Array.isArray(archivo.matriculas));
  }

  // CU: abrirAlumnos (con filtro opcional)
  async abrirAlumnos(filtro?: string) {
    const where: any = filtro
      ? { OR: [
          { nombre: { contains: filtro, mode: 'insensitive' as const } },
          { email: { contains: filtro, mode: 'insensitive' as const } },
          { numeroRegistro: { contains: filtro, mode: 'insensitive' as const } }
        ]}
      : {};
    return await prisma.alumno.findMany({
      where,
      include: { matriculas: { include: { grado: true } } }
    });
  }

  // CU: consultarAlumno
  async consultarAlumno(alumnoId: string) {
    const alumno = await prisma.alumno.findUnique({
      where: { id: alumnoId },
      include: { matriculas: { include: { grado: true } }, dispensas: true }
    });
    if (!alumno) throw new Error('Alumno no encontrado');
    return alumno;
  }

  // CU: abrirMatriculas (con filtro opcional)
  async abrirMatriculas(filtro?: string) {
    const where: any = filtro
      ? { alumno: { OR: [
          { nombre: { contains: filtro, mode: 'insensitive' as const } },
          { numeroRegistro: { contains: filtro, mode: 'insensitive' as const } }
        ]}}
      : {};
    return await prisma.matricula.findMany({
      where,
      include: {
        alumno: { select: { id: true, nombre: true, numeroRegistro: true, email: true } },
        grado: true
      },
      orderBy: { fecha: 'desc' }
    });
  }

  // CU: cerrarCicloAcademico
  async cerrarCicloAcademico() {
    const count = await prisma.matricula.count();
    return { matriculasArchivadas: count };
  }

  // CU: consultarDetalleMatricula
  async consultarDetalleMatricula(alumnoId: string) {
    return await prisma.matricula.findMany({
      where: { alumnoId },
      include: { grado: { include: { director: true, secretaria: true } } }
    });
  }

  // CU: importarAlumnos
  async importarAlumnos(archivo: { alumnos: { nombre: string; email: string; dni: string; numeroRegistro?: string }[] }) {
    const resultados = { creados: 0, actualizados: 0, errores: 0 };
    for (const fila of archivo.alumnos) {
      try {
        const existing = fila.dni ? await prisma.alumno.findUnique({ where: { dni: fila.dni } }) : null;
        if (existing) {
          await prisma.alumno.update({ where: { dni: fila.dni! }, data: { nombre: fila.nombre, email: fila.email } });
          resultados.actualizados++;
        } else {
          await prisma.alumno.create({
            data: { nombre: fila.nombre, email: fila.email, dni: fila.dni, numeroRegistro: fila.numeroRegistro || `REG-${Date.now()}` }
          });
          resultados.creados++;
        }
      } catch { resultados.errores++; }
    }
    return resultados;
  }

  // CU: importarMatriculas
  async importarMatriculas(archivo: { matriculas: { dni: string; asignaturaId: string }[]; secretariaId: string; gradoId: string }) {
    const resultados = { creadas: 0, actualizadas: 0, errores: 0 };
    for (const fila of archivo.matriculas) {
      try {
        const alumno = await prisma.alumno.findUnique({ where: { dni: fila.dni } });
        if (!alumno) { resultados.errores++; continue; }
        const existente = await prisma.matricula.findFirst({ where: { alumnoId: alumno.id, gradoId: archivo.gradoId } });
        if (existente) { resultados.actualizadas++; }
        else {
          await prisma.matricula.create({ data: { alumnoId: alumno.id, gradoId: archivo.gradoId, secretariaId: archivo.secretariaId } });
          resultados.creadas++;
        }
      } catch { resultados.errores++; }
    }
    return resultados;
  }
}

export const secretariaService = new SecretariaService();
