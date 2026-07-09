import api from './api';

export const academicService = {
  // Helpers de consulta
  async getTeacherAsignaturas(profesorId: string) {
    return (await api.get(`/academic/teacher/${profesorId}/asignaturas`)).data;
  },
  async getTeacherSessions(profesorId: string) {
    return (await api.get(`/academic/teacher/${profesorId}/sessions`)).data;
  },
  async getSessionAlumnos(sesionId: string) {
    return (await api.get(`/academic/sessions/${sesionId}/alumnos`)).data;
  },
  async getSessionsForAlumno(alumnoId: string) {
    return (await api.get(`/academic/alumno/${alumnoId}/sessions`)).data;
  },
  async getSession(sesionId: string) {
    return (await api.get(`/academic/sessions/${sesionId}`)).data;
  },
  async getAlumno(alumnoId: string) {
    return (await api.get(`/academic/alumno/${alumnoId}`)).data;
  },
  async getAsignaturaAlumnos(asignaturaId: string) {
    return (await api.get(`/academic/asignatura/${asignaturaId}/alumnos`)).data;
  },

  // CU: crearSesionClase
  async crearSesionClase(asignaturaId: string, fecha: string, aula?: string, duracion?: number) {
    return (await api.post('/academic/sessions', { asignaturaId, fecha, aula, duracion })).data;
  },

  // CU: editarSesionClase
  async editarSesionClase(id: string, data: { aula?: string; duracion?: number }) {
    return (await api.put(`/academic/sessions/${id}`, data)).data;
  },

  // CU: cerrarSesionClase
  async cerrarSesionClase(id: string) {
    return (await api.put(`/academic/sessions/${id}/cerrar`)).data;
  },

  // CU: eliminarSesionClase
  async eliminarSesionClase(id: string) {
    await api.delete(`/academic/sessions/${id}`);
  },

  async getTeacherAlumnos(profesorId: string) {
    return (await api.get(`/academic/teacher/${profesorId}/alumnos`)).data;
  },

  async getAllAsignaturas() {
    return (await api.get('/academic/asignaturas')).data;
  }
};

export default academicService;
