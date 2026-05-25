# Diseño de la API (Fase 3)

## Descripción
Este documento define los endpoints de la API necesarios para satisfacer los Casos de Uso identificados en la fase de análisis. La API seguirá principios RESTful.

## Endpoints de Alumnos
- `GET /api/alumnos`: Listar todos los alumnos.
- `GET /api/alumnos/:id`: Obtener detalles de un alumno específico.
- `POST /api/alumnos`: Registrar un nuevo alumno.

## Endpoints de Asistencias
- `GET /api/asistencias/sesion/:sesionId`: Obtener el registro de asistencia de una sesión.
- `POST /api/asistencias`: Registrar o actualizar asistencia masiva para una sesión.

## Endpoints de Dispensas
- `GET /api/dispensas`: Listar todas las solicitudes (según rol).
- `POST /api/dispensas`: Crear una nueva solicitud de dispensa.
- `PATCH /api/dispensas/:id`: Actualizar el estado de una dispensa (Aprobar/Rechazar).

## Trazabilidad con Casos de Uso
| Caso de Uso | Endpoint API | Actor |
|-------------|--------------|-------|
| Registrar Asistencia | `POST /api/asistencias` | Profesor |
| Solicitar Dispensa | `POST /api/dispensas` | Alumno |
| Validar Dispensa | `PATCH /api/dispensas/:id` | Dirección de Grado |
| Gestionar Inscripciones | `POST /api/alumnos` | Secretaría |
