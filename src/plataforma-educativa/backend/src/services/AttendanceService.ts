import prisma from '../lib/prisma';
import { CreateAttendanceDTO } from '../types';

export class AttendanceService {
  async getAttendanceBySession(sesionId: string) {
    return await prisma.asistencia.findMany({
      where: { sesionId },
      include: { alumno: { select: { id: true, nombre: true, numeroRegistro: true } } }
    });
  }

  // CU: registrarTomaAsistencia
  async registrarTomaAsistencia(data: CreateAttendanceDTO) {
    return await prisma.asistencia.upsert({
      where: { sesionId_alumnoId: { sesionId: data.sesionId, alumnoId: data.alumnoId } },
      update: { presente: data.presente, profesorId: data.profesorId, fechaHora: new Date() },
      create: { sesionId: data.sesionId, alumnoId: data.alumnoId, profesorId: data.profesorId, presente: data.presente },
      include: { alumno: true, sesion: { include: { asignatura: true } } }
    });
  }

  // CU: exportarHistorialAsistencias
  async exportarHistorialAsistencias(sesionId: string, formato: string) {
    const asistencias = await prisma.asistencia.findMany({
      where: { sesionId },
      include: { alumno: { select: { nombre: true, numeroRegistro: true } } },
      orderBy: { alumno: { nombre: 'asc' } }
    });

    const csv = [
      'Nombre,Número de Registro,Presente',
      ...asistencias.map(a => `${a.alumno.nombre},${a.alumno.numeroRegistro},${a.presente ? 'Sí' : 'No'}`)
    ].join('\n');

    return csv;
  }
}

export const attendanceService = new AttendanceService();
