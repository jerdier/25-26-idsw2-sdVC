import api from './api';
import type { CreateDispensaDTO, UpdateDispensaStatusDTO } from '../types';

export const dispensaService = {
  /**
   * Crea una nueva dispensa
   */
  async createDispensa(data: CreateDispensaDTO) {
    const response = await api.post('/dispensas', data);
    return response.data;
  },

  /**
   * Rectifica una dispensa
   */
  async updateDispensa(id: string, data: Partial<CreateDispensaDTO>) {
    const response = await api.put(`/dispensas/${id}/rectificar`, data);
    return response.data;
  },

  /**
   * Actualiza el estado (Director)
   */
  async updateStatus(id: string, data: UpdateDispensaStatusDTO) {
    const response = await api.patch(`/dispensas/${id}/status`, data);
    return response.data;
  },

  /**
   * Listado para el alumno
   */
  async getDispensasByAlumno(alumnoId: string) {
    const response = await api.get(`/dispensas/alumno/${alumnoId}`);
    return response.data;
  },

  /**
   * Listado para el profesor
   */
  async getDispensasByProfesor(profesorId: string) {
    const response = await api.get(`/dispensas/profesor/${profesorId}`);
    return response.data;
  },

  /**
   * Catálogo total (Secretaría)
   */
  async getAllDispensas() {
    const response = await api.get('/dispensas');
    return response.data;
  },

  async deleteDispensa(id: string) {
    await api.delete(`/dispensas/${id}`);
  }
};

export default dispensaService;
