import api from './api';

export const usuarioService = {
  /**
   * Obtiene un usuario por su ID
   * CU: Consultar Usuario
   */
  async getUsuario(id: string) {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  /**
   * Actualiza un usuario
   * CU: Editar Usuario
   */
  async updateUsuario(id: string, data: any) {
    const response = await api.put(`/usuarios/${id}`, data);
    return response.data;
  },

  /**
   * Elimina un usuario
   * CU: Eliminar Usuario
   */
  async deleteUsuario(id: string) {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  }
};

export default usuarioService;
