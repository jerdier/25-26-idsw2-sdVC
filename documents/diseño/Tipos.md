# Diseño Técnico > Definición de Tipos y DTOs (Fase 3)

Este documento define las interfaces de TypeScript que garantizan la integridad de los datos entre el Backend y el Frontend.

## 1. Tipos de Entidad (Core)

```typescript
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
```

## 2. DTOs de Entrada (Requests)

### Módulo de Asistencia
```typescript
export interface CreateAttendanceDTO {
  sesionId: string;
  alumnoId: string;
  profesorId: string;
  presente: boolean;
}
```

### Módulo de Dispensas
```typescript
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
```

## 3. DTOs de Salida (Responses)

### Listado de Asistencia
```typescript
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
```

### Detalle de Dispensa
```typescript
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
```
