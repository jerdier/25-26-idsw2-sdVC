import prisma from '../lib/prisma';
import { CreateDispensaDTO, UpdateDispensaStatusDTO } from '../types';

export class DispensaService {
  /**
   * Crea una nueva solicitud de dispensa.
   */
  async createDispensa(data: CreateDispensaDTO) {
    return await prisma.dispensa.create({
      data: {
        alumnoId: data.alumnoId,
        motivo: data.motivo,
        secretariaId: data.secretariaId,
        sesionesEximidas: {
          connect: data.sesionesIds.map(id => ({ id })),
        },
        asignaturas: {
          connect: data.asignaturasIds.map(id => ({ id })),
        },
      },
      include: {
        alumno: true,
        sesionesEximidas: true,
        asignaturas: true,
      },
    });
  }

  /**
   * Actualiza el estado de una dispensa (Aprobada/Rechazada).
   */
  async updateStatus(id: string, data: UpdateDispensaStatusDTO) {
    return await prisma.dispensa.update({
      where: { id },
      data: {
        estado: data.estado,
        directorId: data.directorId,
      },
    });
  }

  /**
   * Actualiza los datos de una dispensa existente (rectificación).
   */
  async updateDispensa(id: string, data: Partial<CreateDispensaDTO>) {
    return await prisma.dispensa.update({
      where: { id },
      data: {
        motivo: data.motivo,
        sesionesEximidas: data.sesionesIds ? {
          set: data.sesionesIds.map(id => ({ id })),
        } : undefined,
        asignaturas: data.asignaturasIds ? {
          set: data.asignaturasIds.map(id => ({ id })),
        } : undefined,
      },
      include: {
        alumno: true,
        sesionesEximidas: true,
        asignaturas: true,
      },
    });
  }

  /**
   * Obtiene las dispensas aprobadas que afectan a las asignaturas de un profesor.
   */
  async getDispensasByProfesor(profesorId: string) {
    return await prisma.dispensa.findMany({
      where: {
        estado: 'APROBADA',
        asignaturas: {
          some: { profesorId },
        },
      },
      include: {
        alumno: true,
        asignaturas: true,
      },
    });
  }

  /**
   * Obtiene todas las dispensas de un alumno específico.
   */
  async getDispensasByAlumno(alumnoId: string) {
    return await prisma.dispensa.findMany({
      where: { alumnoId },
      include: {
        sesionesEximidas: {
          include: { asignatura: true },
        },
        asignaturas: true,
      },
      orderBy: { fechaSolicitud: 'desc' },
    });
  }

  /**
   * Obtiene todas las dispensas para revisión de secretaría o dirección.
   */
  async getAllDispensas() {
    return await prisma.dispensa.findMany({
      include: {
        alumno: true,
        asignaturas: true,
      },
      orderBy: { fechaSolicitud: 'desc' },
    });
  }

  async deleteDispensa(id: string) {
    await prisma.dispensa.update({
      where: { id },
      data: { sesionesEximidas: { set: [] }, asignaturas: { set: [] } }
    });
    return await prisma.dispensa.delete({ where: { id } });
  }
}

export const dispensaService = new DispensaService();
