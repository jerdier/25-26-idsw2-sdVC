# CGU > registrarTomaAsistencia > Desarrollo

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/registrarTomaAsistencia/README.md) | [Diseño](../../diseño/registrarTomaAsistencia/README.md) | [Índice Desarrollo](../README.md) | **Desarrollo** |
> |---|---|---|---|---|---|

**Actor:** Profesor

Toma de asistencia durante una sesión de clase activa: el Profesor marca a cada alumno como presente o ausente (los alumnos con dispensa aprobada quedan excluidos automáticamente).

---

## Backend

| Capa | Archivo | Función |
|------|---------|---------|
| Ruta | [`attendanceRoutes.ts#L7`](../../../src/plataforma-educativa/backend/src/routes/attendanceRoutes.ts#L7) | `POST /attendance/record` |
| Controlador | [`AttendanceController.ts#L19-L24`](../../../src/plataforma-educativa/backend/src/controllers/AttendanceController.ts#L19-L24) | `registrarTomaAsistencia()` |
| Servicio | [`AttendanceService.ts#L20-L28`](../../../src/plataforma-educativa/backend/src/services/AttendanceService.ts#L20-L28) | `registrarTomaAsistencia(data)` |

También usa `getSessionAlumnos` para poblar la lista de alumnos a marcar: [`academicRoutes.ts#L19`](../../../src/plataforma-educativa/backend/src/routes/academicRoutes.ts#L19) → [`AcademicController.ts#L33-L38`](../../../src/plataforma-educativa/backend/src/controllers/AcademicController.ts#L33-L38) → [`AcademicService.ts#L51-L89`](../../../src/plataforma-educativa/backend/src/services/AcademicService.ts#L51-L89) (excluye alumnos con dispensa aprobada).

## Frontend

| Capa | Archivo | Función |
|------|---------|---------|
| Servicio | [`attendanceService.ts#L12-L15`](../../../src/plataforma-educativa/frontend/src/services/attendanceService.ts#L12-L15) | `registrarTomaAsistencia(data)` |
| Vista | [`ProfesorDashboard.vue#L115-L135`](../../../src/plataforma-educativa/frontend/src/views/ProfesorDashboard.vue#L115-L135) | `irAsistencia()`, `handleRegistrarAsistencia()` |

---

## Flujo real

1. El Profesor entra en una sesión activa y pulsa "registrarTomaAsistencia" → `irAsistencia(s)` carga los alumnos de la sesión con `academicService.getSessionAlumnos(s.id)` (excluye a quienes tienen dispensa aprobada para esa asignatura).
2. El Profesor marca presente/ausente por alumno (checkbox); al confirmar, `handleRegistrarAsistencia` llama una vez por alumno a `attendanceService.registrarTomaAsistencia({ sesionId, alumnoId, profesorId, presente })` → `POST /api/attendance/record`.
3. `AttendanceService.registrarTomaAsistencia` hace un `upsert` en `Asistencia` (crea si no existe el par `sesionId`+`alumnoId`, actualiza si ya existe).
4. La vista muestra confirmación y vuelve al detalle de la sesión.
