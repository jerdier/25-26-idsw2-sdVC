import api from './api';
import type { CreateDispensaDTO, Dispensa } from '../types';

export class DispensaService {
  /**
   * Obtiene todas las dispensas (útil para administración/secretaría)
   */
  async getAllDispensas(): Promise<Dispensa[]> {
    const response = await api.get<Dispensa[]>('/dispensas');
    return response.data;
  }

  /**
   * Crea una nueva solicitud de dispensa por parte del alumno
   */
  async createDispensa(data: CreateDispensaDTO): Promise<Dispensa> {
    const response = await api.post<Dispensa>('/dispensas', data);
    return response.data;
  }

  /**
   * Actualiza el estado de una dispensa (Aprobada/Rechazada)
   */
  async updateDispensaStatus(id: string, estado: 'APROBADA' | 'RECHAZADA', directorId: string): Promise<Dispensa> {
    const response = await api.patch<Dispensa>(`/dispensas/${id}/status`, {
      estado,
      directorId
    });
    return response.data;
  }

  async getDispensasByAlumno(alumnoId: string): Promise<Dispensa[]> {
    const response = await api.get<Dispensa[]>(`/dispensas/alumno/${alumnoId}`);
    return response.data;
  }
}

export const dispensaService = new DispensaService();
