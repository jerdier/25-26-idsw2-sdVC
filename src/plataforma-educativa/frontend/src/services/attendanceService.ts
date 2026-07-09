import api from './api';

export const attendanceService = {
  async getAttendanceBySession(sesionId: string) {
    return (await api.get(`/attendance/session/${sesionId}`)).data;
  },

  async getAttendanceByAlumno(alumnoId: string) {
    return (await api.get(`/attendance/alumno/${alumnoId}`)).data;
  },

  // CU: registrarTomaAsistencia
  async registrarTomaAsistencia(data: { sesionId: string; alumnoId: string; profesorId: string; presente: boolean }) {
    return (await api.post('/attendance/record', data)).data;
  },

  // CU: exportarHistorialAsistencias
  async exportarHistorialAsistencias(sesionId: string, formato: string = 'CSV') {
    return (await api.get(`/attendance/session/${sesionId}/export`, { params: { formato }, responseType: 'blob' })).data;
  }
};

export default attendanceService;
