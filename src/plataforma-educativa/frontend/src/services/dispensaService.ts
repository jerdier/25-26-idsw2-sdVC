import api from './api';

export const dispensaService = {
  // CU: consultarSolicitudDispensa
  async consultarSolicitudDispensa(dispensaId: string) {
    return (await api.get(`/dispensas/${dispensaId}`)).data;
  },

  async getDispensasByProfesor(profesorId: string) {
    return (await api.get(`/dispensas/profesor/${profesorId}`)).data;
  },

  async deleteDispensa(id: string) {
    await api.delete(`/dispensas/${id}`);
  },

  // CU: crearSolicitudDispensa
  async crearSolicitudDispensa(data: { alumnoId: string; motivo: string; secretariaId: string; sesionesIds: string[]; asignaturasIds: string[] }) {
    return (await api.post('/dispensas', data)).data;
  },

  // CU: abrirDispensas
  async abrirDispensas(filtros?: { estado?: string; alumnoId?: string }) {
    return (await api.get('/dispensas', { params: filtros })).data;
  },

  // CU: editarSolicitudDispensa
  async editarSolicitudDispensa(id: string, data: { motivo?: string; sesionesIds?: string[]; asignaturasIds?: string[] }) {
    return (await api.put(`/dispensas/${id}/rectificar`, data)).data;
  },

  // CU: guardarSolicitudDispensa
  async guardarSolicitudDispensa(id: string, data: { estado: 'APROBADA' | 'RECHAZADA'; directorId: string; observaciones?: string }) {
    return (await api.patch(`/dispensas/${id}/status`, data)).data;
  },

  // CU: exportarDispensas
  async exportarDispensas(filtros?: object, formato: string = 'CSV') {
    return (await api.get('/dispensas/export', { params: { ...filtros, formato }, responseType: 'blob' })).data;
  }
};

export default dispensaService;
