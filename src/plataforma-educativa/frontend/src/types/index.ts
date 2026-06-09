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
  aula?: string;
  duracion?: number;
  estado?: 'ACTIVA' | 'CERRADA';
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
  asignaturasIds: string[];
}

export interface UpdateDispensaStatusDTO {
  estado: EstadoDispensa;
  directorId: string;
}

// Secretaria DTOs
export interface CreateAlumnoDTO {
  nombre: string;
  email: string;
  numeroRegistro: string;
}

export interface CreateProfesorDTO {
  nombre: string;
  email: string;
}

export interface CreateGradoDTO {
  nombre: string;
  directorId?: string;
}

export interface CreateMatriculaDTO {
  alumnoId: string;
  gradoId: string;
  secretariaId: string;
}

export interface SecretariaStats {
  alumnos: number;
  profesores: number;
  grados: number;
  dispensasPendientes: number;
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
