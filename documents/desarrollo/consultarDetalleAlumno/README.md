# CGU > consultarDetalleAlumno > Desarrollo

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/consultarDetalleAlumno/README.md) | [Diseño](../../diseño/consultarDetalleAlumno/README.md) | [Índice Desarrollo](../README.md) | **Desarrollo** |
> |---|---|---|---|---|---|

**Actor:** Profesor

Ficha completa de un alumno para el Profesor: datos personales más su historial de asistencia. Combina dos llamadas independientes (datos del alumno + asistencias).

---

## Backend

| Capa | Archivo | Función |
|------|---------|---------|
| Ruta (datos) | [`academicRoutes.ts#L21`](../../../src/plataforma-educativa/backend/src/routes/academicRoutes.ts#L21) | `GET /academic/alumno/:alumnoId` |
| Controlador (datos) | [`AcademicController.ts#L26-L31`](../../../src/plataforma-educativa/backend/src/controllers/AcademicController.ts#L26-L31) | `getAlumno()` |
| Servicio (datos) | [`AcademicService.ts#L29-L49`](../../../src/plataforma-educativa/backend/src/services/AcademicService.ts#L29-L49) | `getAlumno(alumnoId)` |
| Ruta (asistencia) | [`attendanceRoutes.ts#L9`](../../../src/plataforma-educativa/backend/src/routes/attendanceRoutes.ts#L9) | `GET /attendance/alumno/:alumnoId` |
| Controlador (asistencia) | [`AttendanceController.ts#L12-L17`](../../../src/plataforma-educativa/backend/src/controllers/AttendanceController.ts#L12-L17) | `getAttendanceByAlumno()` |
| Servicio (asistencia) | [`AttendanceService.ts#L12-L18`](../../../src/plataforma-educativa/backend/src/services/AttendanceService.ts#L12-L18) | `getAttendanceByAlumno(alumnoId)` |

## Frontend

| Capa | Archivo | Función |
|------|---------|---------|
| Servicio (datos) | [`academicService.ts#L20-L22`](../../../src/plataforma-educativa/frontend/src/services/academicService.ts#L20-L22) | `getAlumno(alumnoId)` |
| Servicio (asistencia) | [`attendanceService.ts#L8-L10`](../../../src/plataforma-educativa/frontend/src/services/attendanceService.ts#L8-L10) | `getAttendanceByAlumno(alumnoId)` |
| Vista | [`ProfesorDashboard.vue#L154-L166`](../../../src/plataforma-educativa/frontend/src/views/ProfesorDashboard.vue#L154-L166) | `irDetalleAlumno()` |

---

## Flujo real

1. El Profesor selecciona un alumno del listado (`abrirAlumnos`) → `irDetalleAlumno(a)`.
2. La vista dispara en paralelo (`Promise.all`) `academicService.getAlumno(a.id)` (`GET /api/academic/alumno/:alumnoId`) y `attendanceService.getAttendanceByAlumno(a.id)` (`GET /api/attendance/alumno/:alumnoId`).
3. `AcademicService.getAlumno` recupera el `Alumno` y añade las asignaturas obtenidas tanto directamente como a través de sus matrículas (deduplicadas). `AttendanceService.getAttendanceByAlumno` recupera todas las `Asistencia` del alumno con su sesión y asignatura, ordenadas por fecha descendente.
4. La vista combina ambos resultados en la ficha del alumno (datos personales + estadísticas de asistencia).
