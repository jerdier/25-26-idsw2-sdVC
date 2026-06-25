import prisma from '../lib/prisma';

export class AcademicService {
  async getTeacherAsignaturas(profesorId: string) {
    return await prisma.asignatura.findMany({
      where: { profesorId },
      include: { grado: true },
    });
  }

  async getAsignaturaAlumnos(asignaturaId: string) {
    const asignatura = await prisma.asignatura.findUnique({
      where: { id: asignaturaId },
      include: { alumnos: { select: { id: true, nombre: true, numeroRegistro: true, email: true } } }
    });
    if (!asignatura) throw new Error('Asignatura no encontrada');
    return asignatura.alumnos;
  }

  async getSession(sesionId: string) {
    const sesion = await prisma.sesionDeClase.findUnique({
      where: { id: sesionId },
      include: { asignatura: true }
    });
    if (!sesion) throw new Error('Sesión no encontrada');
    return sesion;
  }

  async getAlumno(alumnoId: string) {
    const alumno = await prisma.alumno.findUnique({
      where: { id: alumnoId },
      select: { id: true, nombre: true, numeroRegistro: true, email: true, dni: true }
    });
    if (!alumno) throw new Error('Alumno no encontrado');
    return alumno;
  }

  async getSessionAlumnos(sesionId: string) {
    const sesion = await prisma.sesionDeClase.findUnique({
      where: { id: sesionId },
      select: { asignaturaId: true }
    });
    if (!sesion) throw new Error('Sesión no encontrada');

    const asignatura = await prisma.asignatura.findUnique({
      where: { id: sesion.asignaturaId },
      include: { alumnos: { select: { id: true, nombre: true, numeroRegistro: true, email: true } } }
    });
    if (!asignatura) throw new Error('Asignatura no encontrada');

    const dispensasAprobadas = await prisma.dispensa.findMany({
      where: { estado: 'APROBADA', asignaturas: { some: { id: sesion.asignaturaId } } },
      select: { alumnoId: true }
    });

    const eximidos = new Set(dispensasAprobadas.map(d => d.alumnoId));
    return asignatura.alumnos.filter(a => !eximidos.has(a.id));
  }

  async getTeacherSessions(profesorId: string) {
    const asignaturas = await prisma.asignatura.findMany({ where: { profesorId } });
    const ids = asignaturas.map(a => a.id);
    return await prisma.sesionDeClase.findMany({
      where: { asignaturaId: { in: ids } },
      include: { asignatura: { select: { nombre: true } } },
      orderBy: { fecha: 'desc' }
    });
  }

  async getSessionsForAlumno(alumnoId: string) {
    const matriculas = await prisma.matricula.findMany({
      where: { alumnoId },
      select: { gradoId: true }
    });
    const gradoIds = matriculas.map(m => m.gradoId);
    return await prisma.sesionDeClase.findMany({
      where: { asignatura: { gradoId: { in: gradoIds } } },
      include: { asignatura: true },
      orderBy: { fecha: 'desc' }
    });
  }

  // CU: crearSesionClase
  async crearSesionClase(asignaturaId: string, fecha: Date, aula?: string, duracion?: number) {
    return await prisma.sesionDeClase.create({
      data: { asignaturaId, fecha, aula, duracion }
    });
  }

  // CU: editarSesionClase
  async editarSesionClase(id: string, data: { aula?: string; duracion?: number }) {
    return await prisma.sesionDeClase.update({
      where: { id },
      data: { aula: data.aula, duracion: data.duracion }
    });
  }

  // CU: cerrarSesionClase
  async cerrarSesionClase(id: string) {
    return await prisma.sesionDeClase.update({
      where: { id },
      data: { estado: 'CERRADA' }
    });
  }
}

export const academicService = new AcademicService();
