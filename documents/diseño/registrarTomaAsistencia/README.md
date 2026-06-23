# CGU > registrarTomaAsistencia > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/registrarTomaAsistencia/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** Profesor

---

## información del artefacto

| Campo | Valor |
|-------|-------|
| **Proyecto** | CGU - Centro de Gestión Universitaria |
| **Disciplina** | Análisis y Diseño |

---

## diagrama de secuencia

![secuencia](../../../images/diseño/registrarTomaAsistencia/secuencia.svg)

> fuente: [secuencia.puml](../../../modelosUML/diseño/registrarTomaAsistencia/secuencia.puml)

---

## clases de diseño identificadas

### frontend (Vue 3)

| Clase | Responsabilidad |
|-------|----------------|
| `ProfessorDashboard.vue` | Presenta el listado de alumnos de la sesión y permite marcar la asistencia de cada uno |

### backend (Express + TypeScript)

| Clase | Responsabilidad |
|-------|----------------|
| `AcademicController` | Gestiona la carga del listado de alumnos matriculados en la sesión |
| `AcademicService` | Recupera los alumnos de la asignatura asociada a la sesión |
| `AttendanceController` | Gestiona el registro de asistencia por alumno |
| `AttendanceService` | Persiste el registro de asistencia con `INSERT ... ON CONFLICT DO UPDATE` |

### base de datos (PostgreSQL)

| Tabla | Responsabilidad |
|-------|----------------|
| `Alumno` | Proporciona el listado de alumnos matriculados en la asignatura de la sesión |
| `Asistencia` | Almacena el estado de asistencia por alumno y sesión (PRESENTE / AUSENTE / TARDE) |

---

## flujo de secuencia

1. El caso se activa por `<<include>> registrarTomaAsistencia(sesionCreada)` desde `crearSesionClase`.
2. El frontend llama `GET /api/academic/sessions/:sesionId/alumnos` → `AcademicController` → `AcademicService.getSessionAlumnos(sesionId)`.
3. `AcademicService` ejecuta `SELECT * FROM Alumno WHERE id IN (SELECT alumnoId FROM _AlumnoToAsignatura WHERE asignaturaId = ?)` → devuelve `Alumno[]`.
4. El frontend muestra la lista de alumnos para pasar lista.
5. El Profesor marca la asistencia de un alumno (PRESENTE / AUSENTE / TARDE).
6. El frontend llama `POST /api/attendance/record { sesionId, alumnoId, presente }`.
7. `AttendanceController` → `AttendanceService.recordAttendance(sesionId, alumnoId, presente)`.
8. `AttendanceService` ejecuta `INSERT INTO Asistencia ... ON CONFLICT DO UPDATE` → devuelve `asistencia`.
9. `AttendanceController` responde `200 OK { asistencia }` → el frontend actualiza la lista. Los pasos 5-9 se repiten por cada alumno.
10. El Profesor solicita cerrar la sesión → el frontend inicia `<<include>> cerrarSesionClase(sesionId)`.

---

## referencias

- [Índice de diseño](../README.md)
- [Análisis de este caso](../../analisis/registrarTomaAsistencia/README.md)
- [Modelo del dominio](../../requisitado/00-modelo-del-dominio/README.md)
- [secuencia.puml](../../../modelosUML/diseño/registrarTomaAsistencia/secuencia.puml)
