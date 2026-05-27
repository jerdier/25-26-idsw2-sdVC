# Diseño Técnico > Especificación de API (Fase 3)

Este documento define los contratos de la API REST para el sistema CGU, traduciendo las clases de análisis en endpoints técnicos.

## 1. Módulo de Asistencia (Profesor)

### Registrar/Actualizar Asistencia
Permite al profesor marcar el estado de presencia de un alumno en una sesión.

- **URL**: `/api/attendance`
- **Método**: `POST`
- **Cuerpo (JSON)**:
  ```json
  {
    "sesionId": "uuid",
    "alumnoId": "uuid",
    "profesorId": "uuid",
    "presente": boolean
  }
  ```
- **Respuesta Exitosa (200 OK)**: La entidad Asistencia creada o actualizada.

### Consultar Asistencia de Sesión
Recupera todos los registros de asistencia para una sesión específica.

- **URL**: `/api/attendance/session/:sesionId`
- **Método**: `GET`
- **Respuesta Exitosa (200 OK)**: Lista de objetos Asistencia con datos del Alumno incluidos.

## 2. Módulo de Dispensas (Alumno/Director)

### Crear Solicitud de Dispensa
El alumno envía una nueva solicitud vinculada a sesiones específicas.

- **URL**: `/api/dispensas`
- **Método**: `POST`
- **Cuerpo (JSON)**:
  ```json
  {
    "alumnoId": "uuid",
    "motivo": "string",
    "secretariaId": "uuid",
    "sesionesIds": ["uuid", "uuid"]
  }
  ```

### Actualizar Estado de Dispensa
El Director de Grado aprueba o rechaza el trámite.

- **URL**: `/api/dispensas/:id/status`
- **Método**: `PATCH`
- **Cuerpo (JSON)**:
  ```json
  {
    "estado": "APROBADA | RECHAZADA",
    "directorId": "uuid"
  }
  ```

## 3. Módulo de Secretaría (Carga Masiva)

### Importar Alumnos
- **URL**: `/api/import/alumnos`
- **Método**: `POST` (Multipart/form-data o JSON Array)
