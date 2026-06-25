export interface Alumno {
  id: string;
  numeroRegistro: string;
  dni?: string;
  nombre: string;
  email: string;
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
  asignatura?: { id: string; nombre: string };
}

export type EstadoDispensa = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';

export interface Dispensa {
  id: string;
  motivo: string;
  observaciones?: string;
  estado: EstadoDispensa;
  fechaSolicitud: string;
  alumnoId: string;
  secretariaId: string;
  directorId?: string;
  alumno?: Alumno;
  sesionesEximidas?: SesionDeClase[];
  asignaturas?: { id: string; nombre: string }[];
}

export interface ImportResult {
  creados?: number;
  actualizados?: number;
  creadas?: number;
  actualizadas?: number;
  errores: number;
}
