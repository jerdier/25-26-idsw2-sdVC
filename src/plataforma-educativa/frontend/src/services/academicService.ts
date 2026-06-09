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
  },

  /**
   * Obtiene todas las asignaturas del sistema
   */
  async getAllAsignaturas() {
    const response = await api.get('/academic/asignaturas');
    return response.data;
  },

  /**
   * Obtiene las asignaturas asignadas directamente a un alumno
   */
  async getStudentAsignaturas(alumnoId: string) {
    const response = await api.get(`/academic/alumno/${alumnoId}/asignaturas`);
    return response.data;
  },

  /**
   * Asigna un profesor a una asignatura
   */
  async assignProfesorToAsignatura(asignaturaId: string, profesorId: string) {
    const response = await api.put(`/academic/asignatura/${asignaturaId}/profesor`, { profesorId });
    return response.data;
  },

  /**
   * Desasigna el profesor de una asignatura
   */
  async unassignProfesorFromAsignatura(asignaturaId: string) {
    const response = await api.delete(`/academic/asignatura/${asignaturaId}/profesor`);
    return response.data;
  },

  /**
   * Añade un alumno a una asignatura
   */
  async addAlumnoToAsignatura(asignaturaId: string, alumnoId: string) {
    const response = await api.post(`/academic/asignatura/${asignaturaId}/alumnos/${alumnoId}`, {});
    return response.data;
  },

  /**
   * Elimina un alumno de una asignatura
   */
  async removeAlumnoFromAsignatura(asignaturaId: string, alumnoId: string) {
    const response = await api.delete(`/academic/asignatura/${asignaturaId}/alumnos/${alumnoId}`);
    return response.data;
  },

  /**
   * Obtiene los alumnos de una sesión excluyendo los dispensados (APROBADA)
   */
  async getSessionAlumnos(sesionId: string) {
    const response = await api.get(`/academic/sessions/${sesionId}/alumnos`);
    return response.data;
  },

  /**
   * Elimina una sesión y todos sus registros de asistencia
   */
  async deleteSession(id: string) {
    await api.delete(`/academic/sessions/${id}`);
  }
};

export default academicService;
