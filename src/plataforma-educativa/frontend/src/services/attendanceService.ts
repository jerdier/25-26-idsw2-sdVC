import api from './api';
import { CreateAttendanceDTO, AttendanceResponseDTO } from '../types';

export const attendanceService = {
  /**
   * Registra o actualiza la asistencia de un alumno
   */
  async recordAttendance(data: CreateAttendanceDTO): Promise<AttendanceResponseDTO> {
    const response = await api.post<AttendanceResponseDTO>('/attendance', data);
    return response.data;
  },

  /**
   * Obtiene la lista de asistencia de una sesión específica
   */
  async getAttendanceBySession(sesionId: string): Promise<AttendanceResponseDTO[]> {
    const response = await api.get<AttendanceResponseDTO[]>(`/attendance/session/${sesionId}`);
    return response.data;
  },
};

export default attendanceService;
