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
      include: { asignatura: true },
      orderBy: { fecha: 'desc' },
    });
  }

  /**
   * Obtiene todas las sesiones de las asignaturas en las que el alumno está matriculado.
   */
  async getSessionsForAlumno(alumnoId: string) {
    // 1. Encontrar los grados en los que está el alumno
    const matriculas = await prisma.matricula.findMany({
      where: { alumnoId },
      select: { gradoId: true }
    });

    const gradoIds = matriculas.map(m => m.gradoId);

    // 2. Obtener sesiones de asignaturas de esos grados
    return await prisma.sesionDeClase.findMany({
      where: {
        asignatura: {
          gradoId: { in: gradoIds }
        }
      },
      include: {
        asignatura: true
      },
      orderBy: { fecha: 'desc' }
    });
  }
}

export const academicService = new AcademicService();
