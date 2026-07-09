import prisma from '../lib/prisma';
import { CreateDispensaDTO, UpdateDispensaStatusDTO } from '../types';

export class DispensaService {
  async getDispensa(dispensaId: string) {
    const dispensa = await prisma.dispensa.findUnique({
      where: { id: dispensaId },
      include: { alumno: true, sesionesEximidas: { include: { asignatura: true } }, asignaturas: true }
    });
    if (!dispensa) throw new Error('Dispensa no encontrada');
    return dispensa;
  }

  async getDispensasByProfesor(profesorId: string) {
    return await prisma.dispensa.findMany({
      where: { estado: 'APROBADA', asignaturas: { some: { profesorId } } },
      include: { alumno: true, asignaturas: true }
    });
  }

  async deleteDispensa(id: string) {
    return await prisma.dispensa.delete({ where: { id } });
  }

  // CU: crearSolicitudDispensa
  async crearSolicitudDispensa(data: CreateDispensaDTO) {
    return await prisma.dispensa.create({
      data: {
        alumnoId: data.alumnoId,
        motivo: data.motivo,
        secretariaId: data.secretariaId || undefined,
        sesionesEximidas: { connect: data.sesionesIds?.map(id => ({ id })) || [] },
        asignaturas: { connect: data.asignaturasIds?.map(id => ({ id })) || [] }
      },
      include: { alumno: true, sesionesEximidas: true, asignaturas: true }
    });
  }

  // CU: consultarSolicitudDispensa
  async consultarSolicitudDispensa(filtros: any) {
    const where: any = {};
    if (filtros.estado) where.estado = filtros.estado;
    if (filtros.alumnoId) where.alumnoId = filtros.alumnoId;
    return await prisma.dispensa.findMany({
      where,
      include: { alumno: true, asignaturas: true },
      orderBy: { fechaSolicitud: 'desc' }
    });
  }

  // CU: editarSolicitudDispensa
  async editarSolicitudDispensa(id: string, data: Partial<CreateDispensaDTO>) {
    return await prisma.dispensa.update({
      where: { id },
      data: {
        motivo: data.motivo,
        sesionesEximidas: data.sesionesIds ? { set: data.sesionesIds.map(id => ({ id })) } : undefined,
        asignaturas: data.asignaturasIds ? { set: data.asignaturasIds.map(id => ({ id })) } : undefined
      },
      include: { alumno: true, sesionesEximidas: true, asignaturas: true }
    });
  }

  // CU: guardarSolicitudDispensa
  async guardarSolicitudDispensa(id: string, data: UpdateDispensaStatusDTO & { observaciones?: string }) {
    return await prisma.dispensa.update({
      where: { id },
      data: { estado: data.estado, directorId: data.directorId, observaciones: data.observaciones }
    });
  }

  // CU: exportarDispensas
  async exportarDispensas(filtros: any, formato: string) {
    const dispensas = await this.consultarSolicitudDispensa(filtros);
    const csv = [
      'Fecha,Alumno,Motivo,Estado',
      ...dispensas.map((d: any) =>
        `${d.fechaSolicitud.toISOString().split('T')[0]},${d.alumno.nombre},${d.motivo},${d.estado}`
      )
    ].join('\n');
    return csv;
  }
}

export const dispensaService = new DispensaService();
