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
    id: string;
    nombre: string;
  };
}

export type EstadoDispensa = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';

export interface Dispensa {
  id: string;
  motivo: string;
  estado: EstadoDispensa;
  fechaSolicitud: string;
  alumnoId: string;
  secretariaId: string;
  directorId?: string;
  alumno?: Alumno;
  sesionesEximidas?: SesionDeClase[];
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

export interface CreateDispensaDTO {
  alumnoId: string;
  motivo: string;
  secretariaId: string;
  sesionesIds: string[];
}

export interface UpdateDispensaStatusDTO {
  estado: EstadoDispensa;
  directorId: string;
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
