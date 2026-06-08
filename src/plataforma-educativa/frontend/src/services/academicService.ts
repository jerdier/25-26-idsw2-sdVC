import api from './api';
import type { SesionDeClase } from '../types';

export const academicService = {
  /**
   * Obtiene asignaturas de un profesor
   */
  async getTeacherAsignaturas(profesorId: string) {
    const response = await api.get(`/academic/teacher/${profesorId}/asignaturas`);
    return response.data;
  },

  /**
   * Obtiene alumnos de una asignatura
   */
  async getAsignaturaAlumnos(asignaturaId: string) {
    const response = await api.get(`/academic/asignatura/${asignaturaId}/alumnos`);
    return response.data;
  },

  /**
   * Obtiene sesiones de una asignatura
   */
  async getSessions(asignaturaId: string): Promise<SesionDeClase[]> {
    const response = await api.get(`/academic/asignatura/${asignaturaId}/sessions`);
    return response.data;
  },

  /**
   * Crea una nueva sesión
   */
  async createSession(asignaturaId: string, fecha: string, aula?: string, duracion?: number) {
    const response = await api.post('/academic/sessions', { asignaturaId, fecha, aula, duracion });
    return response.data;
  },

  /**
   * Actualiza parámetros de una sesión
   */
  async updateSession(id: string, data: { aula?: string, duracion?: number }) {
    const response = await api.put(`/academic/sessions/${id}`, data);
    return response.data;
  },

  /**
   * Cierra una sesión
   */
  async closeSession(id: string) {
    const response = await api.put(`/academic/sessions/${id}/cerrar`);
    return response.data;
  },

  /**
   * Obtiene sesiones para un alumno
   */
  async getSessionsForAlumno(alumnoId: string): Promise<SesionDeClase[]> {
    const response = await api.get(`/academic/alumno/${alumnoId}/sessions`);
    return response.data;
  }
};

export default academicService;
