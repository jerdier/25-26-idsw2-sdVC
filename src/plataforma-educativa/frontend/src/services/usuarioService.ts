import api from './api';

export const usuarioService = {
  async getUsuario(id: string) {
    return (await api.get(`/usuarios/${id}`)).data;
  },

  async deleteUsuario(id: string) {
    await api.delete(`/usuarios/${id}`);
  },

  // CU: consultarUsuario
  async consultarUsuario(filtro?: string) {
    return (await api.get('/usuarios', { params: filtro ? { filtro } : undefined })).data;
  },

  // CU: editarUsuario
  async editarUsuario(id: string, data: any) {
    return (await api.put(`/usuarios/${id}`, data)).data;
  },

  // CU: crearUsuario
  async crearUsuario(data: { nombre: string; email: string; password?: string; rol: string; numeroRegistro?: string }) {
    return (await api.post('/admin/usuarios', data)).data;
  },

  async getAlumnoAsignaturas(alumnoId: string) {
    return (await api.get(`/usuarios/${alumnoId}/asignaturas`)).data;
  },

  async asignarAsignaturas(alumnoId: string, asignaturaIds: string[]) {
    return (await api.put(`/usuarios/${alumnoId}/asignaturas`, { asignaturaIds })).data;
  }
};

export default usuarioService;
