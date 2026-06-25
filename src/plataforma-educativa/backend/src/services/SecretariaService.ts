import prisma from '../lib/prisma';

export class SecretariaService {
  validarArchivo(archivo: any): boolean {
    return archivo && (Array.isArray(archivo.alumnos) || Array.isArray(archivo.matriculas));
  }

  // CU: consultarListaAlumnos / consultarDetalleAlumno
  async consultarListaAlumnos() {
    return await prisma.alumno.findMany({
      include: { matriculas: { include: { grado: true } } }
    });
  }

  // CU: consultarDetalleMatricula
  async consultarDetalleMatricula(alumnoId: string) {
    return await prisma.matricula.findMany({
      where: { alumnoId },
      include: { grado: { include: { director: true, secretaria: true } } }
    });
  }

  // CU: importarListasAlumnos
  async importarListasAlumnos(archivo: { alumnos: { nombre: string; email: string; dni: string; numeroRegistro?: string }[] }) {
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
        if (existente) {
          resultados.actualizadas++;
        } else {
          await prisma.matricula.create({
            data: { alumnoId: alumno.id, gradoId: archivo.gradoId, secretariaId: archivo.secretariaId }
          });
          resultados.creadas++;
        }
      } catch { resultados.errores++; }
    }

    return resultados;
  }
}

export const secretariaService = new SecretariaService();
