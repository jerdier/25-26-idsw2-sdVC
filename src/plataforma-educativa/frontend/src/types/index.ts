// ==========================================
// ENTIDADES CORE
// ==========================================

export interface Alumno {
  id: string;
  numeroRegistro: string;
  nombre: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Profesor {
  id: string;
  nombre: string;
  email: string;
}

export interface SesionDeClase {
  id: string;
  fecha: string;
  asignaturaId: string;
  asignatura?: {
    nombre: string;
  };
}

// ==========================================
// DTOs DE ENTRADA (Requests)
// ==========================================

export interface CreateAttendanceDTO {
  sesionId: string;
  alumnoId: string;
  profesorId: string;
  presente: boolean;
}

// ==========================================
// DTOs DE SALIDA (Responses)
// ==========================================

export interface AttendanceResponseDTO {
  id: string;
  presente: boolean;
  fechaHora: string;
  alumno: {
    id: string;
    nombre: string;
    numeroRegistro: string;
  };
}
