// ==========================================
// ENTIDADES CORE (Basadas en Prisma)
// ==========================================

export interface Alumno {
  id: string;
  numeroRegistro: string;
  nombre: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profesor {
  id: string;
  nombre: string;
  email: string;
}

export interface SesionDeClase {
  id: string;
  fecha: Date;
  asignaturaId: string;
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
  estado: 'APROBADA' | 'RECHAZADA';
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

export interface CreateAsignaturaDTO {
  nombre: string;
  gradoId: string;
  profesorId: string;
}

export interface CreateMatriculaDTO {
  alumnoId: string;
  gradoId: string;
  secretariaId: string;
}

// ==========================================
// DTOs DE SALIDA (Responses)
// ==========================================

export interface AttendanceResponseDTO {
  id: string;
  presente: boolean;
  fechaHora: Date;
  alumno: {
    id: string;
    nombre: string;
    numeroRegistro: string;
  };
}

export interface DispensaResponseDTO {
  id: string;
  motivo: string;
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
  fechaSolicitud: Date;
  alumno: {
    nombre: string;
  };
  sesionesEximidas: {
    id: string;
    fecha: Date;
    asignatura: {
      nombre: string;
    };
  }[];
}
