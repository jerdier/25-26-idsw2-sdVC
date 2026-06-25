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
  estado: 'APROBADA' | 'RECHAZADA';
  directorId: string;
  observaciones?: string;
}

export interface ImportResult {
  creados?: number;
  actualizados?: number;
  creadas?: number;
  actualizadas?: number;
  errores: number;
}
