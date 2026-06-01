import prisma from '../lib/prisma';

export class AcademicService {
  /**
   * Obtiene las asignaturas que imparte un profesor.
   */
  async getTeacherAsignaturas(profesorId: string) {
    return await prisma.asignatura.findMany({
      where: { profesorId },
      include: {
        grado: true,
      },
    });
  }

  /**
   * Obtiene los alumnos matriculados en una asignatura (vía el grado de la asignatura).
   */
  async getAsignaturaAlumnos(asignaturaId: string) {
    const asignatura = await prisma.asignatura.findUnique({
      where: { id: asignaturaId },
      select: { gradoId: true },
    });

    if (!asignatura) throw new Error('Asignatura no encontrada');

    return await prisma.alumno.findMany({
      where: {
        matriculas: {
          some: {
            gradoId: asignatura.gradoId,
          },
        },
      },
      select: {
        id: true,
        nombre: true,
        numeroRegistro: true,
        email: true,
      },
    });
  }

  /**
   * Crea una nueva sesión de clase.
   */
  async createSession(asignaturaId: string, fecha: Date) {
    return await prisma.sesionDeClase.create({
      data: {
        asignaturaId,
        fecha,
      },
    });
  }

  /**
   * Obtiene las sesiones de una asignatura.
   */
  async getSessionsByAsignatura(asignaturaId: string) {
    return await prisma.sesionDeClase.findMany({
      where: { asignaturaId },
      orderBy: { fecha: 'desc' },
    });
  }
}

export const academicService = new AcademicService();
