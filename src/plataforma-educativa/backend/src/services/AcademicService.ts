import prisma from '../lib/prisma';

export class AcademicService {
  /**
   * Obtiene las asignaturas que imparte un profesor.
   */
  async getTeacherAsignaturas(profesorId: string) {
    return await prisma.asignatura.findMany({
      where: { profesorId: { equals: profesorId } },
      include: { grado: true },
    });
  }

  /**
   * Obtiene los alumnos asignados directamente a una asignatura (relación m2m).
   */
  async getAsignaturaAlumnos(asignaturaId: string) {
    const asignatura = await prisma.asignatura.findUnique({
      where: { id: asignaturaId },
      include: {
        alumnos: {
          select: { id: true, nombre: true, numeroRegistro: true, email: true }
        }
      }
    });
    if (!asignatura) throw new Error('Asignatura no encontrada');
    return asignatura.alumnos;
  }

  /**
   * Obtiene los alumnos para una sesión, excluyendo los que tienen dispensa APROBADA que cubre esa sesión.
   */
  async getSessionAlumnos(sesionId: string) {
    const sesion = await prisma.sesionDeClase.findUnique({
      where: { id: sesionId },
      select: { asignaturaId: true }
    });
    if (!sesion) throw new Error('Sesión no encontrada');

    const asignatura = await prisma.asignatura.findUnique({
      where: { id: sesion.asignaturaId },
      include: {
        alumnos: { select: { id: true, nombre: true, numeroRegistro: true, email: true } }
      }
    });
    if (!asignatura) throw new Error('Asignatura no encontrada');

    const dispensasAprobadas = await prisma.dispensa.findMany({
      where: {
        estado: 'APROBADA',
        sesionesEximidas: { some: { id: sesionId } }
      },
      select: { alumnoId: true }
    });

    const eximidos = new Set(dispensasAprobadas.map(d => d.alumnoId));
    return asignatura.alumnos.filter(a => !eximidos.has(a.id));
  }

  /**
   * Crea una nueva sesión de clase.
   */
  async createSession(asignaturaId: string, fecha: Date, aula?: string, duracion?: number) {
    return await prisma.sesionDeClase.create({
      data: {
        asignaturaId,
        fecha,
        aula,
        duracion,
      },
    });
  }

  /**
   * Actualiza los parámetros de una sesión de clase.
   */
  async updateSession(id: string, data: { aula?: string, duracion?: number }) {
    return await prisma.sesionDeClase.update({
      where: { id },
      data: {
        aula: data.aula,
        duracion: data.duracion,
      },
    });
  }

  /**
   * Cierra una sesión de clase.
   */
  async closeSession(id: string) {
    return await prisma.sesionDeClase.update({
      where: { id },
      data: { estado: 'CERRADA' },
    });
  }

  /**
   * Elimina una sesión de clase y desconecta sus dispensas asociadas.
   */
  async deleteSession(id: string) {
    await prisma.sesionDeClase.update({
      where: { id },
      data: { dispensas: { set: [] } }
    });
    return await prisma.sesionDeClase.delete({ where: { id } });
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
   * Obtiene todas las asignaturas del sistema con sus relaciones.
   */
  async getAllAsignaturas() {
    return await prisma.asignatura.findMany({
      include: {
        grado: true,
        profesor: true,
        alumnos: { select: { id: true, nombre: true } }
      },
      orderBy: { nombre: 'asc' }
    });
  }

  /**
   * Obtiene las asignaturas directamente asignadas a un alumno.
   */
  async getStudentAsignaturas(alumnoId: string) {
    const alumno = await prisma.alumno.findUnique({
      where: { id: alumnoId },
      include: {
        asignaturas: {
          include: { grado: true, profesor: true }
        }
      }
    });
    if (!alumno) throw new Error('Alumno no encontrado');
    return alumno.asignaturas;
  }

  /**
   * Asigna un profesor a una asignatura (reemplaza al actual).
   */
  async assignProfesorToAsignatura(asignaturaId: string, profesorId: string) {
    return await prisma.asignatura.update({
      where: { id: asignaturaId },
      data: { profesor: { connect: { id: profesorId } } },
      include: { grado: true, profesor: true }
    });
  }

  /**
   * Desasigna el profesor de una asignatura.
   */
  async unassignProfesorFromAsignatura(asignaturaId: string) {
    return await prisma.asignatura.update({
      where: { id: asignaturaId },
      data: { profesor: { disconnect: true } },
      include: { grado: true }
    });
  }

  /**
   * Añade un alumno a una asignatura.
   */
  async addAlumnoToAsignatura(asignaturaId: string, alumnoId: string) {
    return await prisma.asignatura.update({
      where: { id: asignaturaId },
      data: { alumnos: { connect: { id: alumnoId } } },
      include: { alumnos: { select: { id: true, nombre: true } } }
    });
  }

  /**
   * Elimina un alumno de una asignatura.
   */
  async removeAlumnoFromAsignatura(asignaturaId: string, alumnoId: string) {
    return await prisma.asignatura.update({
      where: { id: asignaturaId },
      data: { alumnos: { disconnect: { id: alumnoId } } },
      include: { alumnos: { select: { id: true, nombre: true } } }
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
