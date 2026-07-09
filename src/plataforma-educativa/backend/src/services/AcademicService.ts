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
      select: { id: true, nombre: true, numeroRegistro: true, email: true, dni: true, asignaturas: true }
    });
    if (!alumno) throw new Error('Alumno no encontrado');
    
    // Obtener asignaturas a partir de las matrículas (grados)
    const matriculas = await prisma.matricula.findMany({
      where: { alumnoId },
      select: { grado: { select: { asignaturas: true } } }
    });
    
    const asignaturasPorGrado = matriculas.flatMap(m => m.grado?.asignaturas || []);
    const asignaturasTotales = [...(alumno.asignaturas || []), ...asignaturasPorGrado];
    
    // Eliminar duplicados
    const map = new Map(asignaturasTotales.map(a => [a.id, a]));
    
    return { ...alumno, asignaturas: Array.from(map.values()) };
  }

  async getSessionAlumnos(sesionId: string) {
    const sesion = await prisma.sesionDeClase.findUnique({
      where: { id: sesionId },
      select: { asignaturaId: true }
    });
    if (!sesion) throw new Error('Sesión no encontrada');

    const asignatura = await prisma.asignatura.findUnique({
      where: { id: sesion.asignaturaId },
      include: {
        alumnos: { select: { id: true, nombre: true, numeroRegistro: true, email: true } },
        grado: {
          include: {
            matriculas: {
              include: { alumno: { select: { id: true, nombre: true, numeroRegistro: true, email: true } } }
            }
          }
        }
      }
    });
    if (!asignatura) throw new Error('Asignatura no encontrada');

    const alumnosTotales = [
      ...asignatura.alumnos,
      ...(asignatura.grado?.matriculas.map(m => m.alumno) || [])
    ];

    const map = new Map(alumnosTotales.map(a => [a.id, a]));
    const alumnosUnicos = Array.from(map.values());

    const dispensasAprobadas = await prisma.dispensa.findMany({
      where: { estado: 'APROBADA', asignaturas: { some: { id: sesion.asignaturaId } } },
      select: { alumnoId: true }
    });

    const eximidos = new Set(dispensasAprobadas.map(d => d.alumnoId));
    // Devuelve los alumnos filtrando completamente a los que tienen dispensa aprobada
    return alumnosUnicos.filter(a => !eximidos.has(a.id)).map(a => ({ ...a, dispensado: false }));
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

  // CU: eliminarSesionClase
  async eliminarSesionClase(id: string) {
    return await prisma.sesionDeClase.delete({ where: { id } });
  }

  async getTeacherAlumnos(profesorId: string) {
    const asignaturas = await prisma.asignatura.findMany({
      where: { profesorId },
      include: {
        alumnos: { select: { id: true, nombre: true, numeroRegistro: true, email: true } },
        grado: {
          select: {
            nombre: true,
            matriculas: {
              include: { alumno: { select: { id: true, nombre: true, numeroRegistro: true, email: true } } }
            }
          }
        }
      }
    });
    const seen = new Set<string>();
    const result: any[] = [];
    for (const a of asignaturas) {
      const alumnosTotales = [
        ...a.alumnos,
        ...(a.grado?.matriculas.map(m => m.alumno) || [])
      ];
      
      for (const al of alumnosTotales) {
        if (!seen.has(al.id)) {
          seen.add(al.id);
          result.push({ ...al, asignatura: { id: a.id, nombre: a.nombre } });
        }
      }
    }
    return result;
  }

  async getAllAsignaturas() {
    return await prisma.asignatura.findMany({
      include: {
        grado: { select: { nombre: true } },
        profesor: { select: { nombre: true } }
      },
      orderBy: { nombre: 'asc' }
    });
  }
}

export const academicService = new AcademicService();
