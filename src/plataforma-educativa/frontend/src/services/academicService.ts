import api from './api';

export const academicService = {
  /**
   * Obtiene las asignaturas de un profesor
   */
  async getTeacherAsignaturas(profesorId: string) {
    const response = await api.get(`/academic/teacher/${profesorId}/asignaturas`);
    return response.data;
  },

  /**
   * Obtiene los alumnos de una asignatura
   */
  async getAsignaturaAlumnos(asignaturaId: string) {
    const response = await api.get(`/academic/asignatura/${asignaturaId}/alumnos`);
    return response.data;
  },

  /**
   * Obtiene las sesiones de una asignatura
   */
  async getSessions(asignaturaId: string) {
    const response = await api.get(`/academic/asignatura/${asignaturaId}/sessions`);
    return response.data;
  },

  /**
   * Crea una nueva sesión
   */
  async createSession(asignaturaId: string, fecha: string) {
    const response = await api.post('/academic/sessions', { asignaturaId, fecha });
    return response.data;
  }
};

export default academicService;
