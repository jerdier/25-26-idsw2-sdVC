import api from './api';
import type { CreateAttendanceDTO } from '../types';

export const attendanceService = {
  /**
   * Registra una asistencia
   */
  async recordAttendance(data: CreateAttendanceDTO) {
    const response = await api.post('/attendance/record', data);
    return response.data;
  },

  /**
   * Obtiene la asistencia de una sesión
   */
  async getAttendanceBySession(sesionId: string) {
    const response = await api.get(`/attendance/session/${sesionId}`);
    return response.data;
  },

  /**
   * Obtiene el historial por grupo/asignatura
   */
  async getHistory(asignaturaId: string) {
    const response = await api.get(`/attendance/history/${asignaturaId}`);
    return response.data;
  }
};

export default attendanceService;
