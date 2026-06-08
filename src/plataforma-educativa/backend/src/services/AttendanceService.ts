import prisma from '../lib/prisma';
import { CreateAttendanceDTO } from '../types';

export class AttendanceService {
  /**
   * Registra o actualiza la asistencia de un alumno en una sesión.
   */
  async recordAttendance(data: CreateAttendanceDTO) {
    return await prisma.asistencia.upsert({
      where: {
        sesionId_alumnoId: {
          sesionId: data.sesionId,
          alumnoId: data.alumnoId,
        },
      },
      update: {
        presente: data.presente,
        profesorId: data.profesorId,
        fechaHora: new Date(),
      },
      create: {
        sesionId: data.sesionId,
        alumnoId: data.alumnoId,
        profesorId: data.profesorId,
        presente: data.presente,
      },
      include: {
        alumno: true,
        sesion: {
          include: {
            asignatura: true,
          },
        },
      },
    });
  }

  /**
   * Obtiene la asistencia de una sesión específica.
   */
  async getAttendanceBySession(sesionId: string) {
    return await prisma.asistencia.findMany({
      where: { sesionId },
      include: {
        alumno: {
          select: {
            id: true,
            nombre: true,
            numeroRegistro: true,
          },
        },
      },
    });
  }

  /**
   * Obtiene el historial de asistencia de una asignatura completa.
   */
  async getAttendanceHistoryByGroup(asignaturaId: string) {
    return await prisma.asistencia.findMany({
      where: {
        sesion: {
          asignaturaId: asignaturaId
        }
      },
      include: {
        alumno: true,
        sesion: true
      },
      orderBy: {
        sesion: {
          fecha: 'desc'
        }
      }
    });
  }
}

export const attendanceService = new AttendanceService();
