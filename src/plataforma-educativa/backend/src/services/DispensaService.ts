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
      },
      include: {
        alumno: true,
        sesionesEximidas: true,
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
   * Obtiene todas las dispensas de un alumno específico.
   */
  async getDispensasByAlumno(alumnoId: string) {
    return await prisma.dispensa.findMany({
      where: { alumnoId },
      include: {
        sesionesEximidas: {
          include: {
            asignatura: true,
          },
        },
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
        sesionesEximidas: {
          include: {
            asignatura: true,
          },
        },
      },
    });
  }
}

export const dispensaService = new DispensaService();
