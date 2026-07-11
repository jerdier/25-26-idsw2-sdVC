# CGU > abrirAlumnos > Desarrollo

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/abrirAlumnos/README.md) | [Diseño](../../diseño/abrirAlumnos/README.md) | [Índice Desarrollo](../README.md) | **Desarrollo** |
> |---|---|---|---|---|---|

**Actor:** Secretaria · Profesor

El listado de alumnos tiene dos implementaciones según el actor: la Secretaria consulta el listado completo con filtro libre; el Profesor consulta solo los alumnos matriculados en sus asignaturas.

---

## Backend

### Secretaria

| Capa | Archivo | Función |
|------|---------|---------|
| Ruta | [`secretariaRoutes.ts#L7`](../../../src/plataforma-educativa/backend/src/routes/secretariaRoutes.ts#L7) | `GET /secretaria/alumnos` |
| Controlador | [`SecretariaController.ts#L5-L11`](../../../src/plataforma-educativa/backend/src/controllers/SecretariaController.ts#L5-L11) | `abrirAlumnos()` |
| Servicio | [`SecretariaService.ts#L8-L21`](../../../src/plataforma-educativa/backend/src/services/SecretariaService.ts#L8-L21) | `abrirAlumnos(filtro)` |

### Profesor

| Capa | Archivo | Función |
|------|---------|---------|
| Ruta | [`academicRoutes.ts#L17`](../../../src/plataforma-educativa/backend/src/routes/academicRoutes.ts#L17) | `GET /academic/teacher/:profesorId/alumnos` |
| Controlador | [`AcademicController.ts#L88-L93`](../../../src/plataforma-educativa/backend/src/controllers/AcademicController.ts#L88-L93) | `getTeacherAlumnos()` |
| Servicio | [`AcademicService.ts#L142-L173`](../../../src/plataforma-educativa/backend/src/services/AcademicService.ts#L142-L173) | `getTeacherAlumnos(profesorId)` |

## Frontend

| Actor | Archivo | Función |
|-------|---------|---------|
| Secretaria (servicio) | [`secretariaService.ts#L4-L7`](../../../src/plataforma-educativa/frontend/src/services/secretariaService.ts#L4-L7) | `abrirAlumnos(filtro)` |
| Secretaria (vista) | [`SecretariaDashboard.vue#L29-L34`](../../../src/plataforma-educativa/frontend/src/views/SecretariaDashboard.vue#L29-L34) | `handleFiltrarAlumnos()`, panel `abrir-alumnos` |
| Profesor (servicio) | [`academicService.ts#L47-L49`](../../../src/plataforma-educativa/frontend/src/services/academicService.ts#L47-L49) | `getTeacherAlumnos(profesorId)` |
| Profesor (vista) | [`ProfesorDashboard.vue#L148-L152`](../../../src/plataforma-educativa/frontend/src/views/ProfesorDashboard.vue#L148-L152) | `irAlumnos()` |

---

## Flujo real

1. La Secretaria abre el módulo de alumnos (o el Profesor pulsa "abrirAlumnos" en su menú).
2. La vista llama al servicio frontend correspondiente (`secretariaService.abrirAlumnos` o `academicService.getTeacherAlumnos`), que hace la petición HTTP con `axios` (ver `services/api.ts`).
3. El controlador Express delega en el servicio de backend, que consulta Prisma: la Secretaria filtra por nombre/email/nº registro sobre `Alumno`; el Profesor obtiene los alumnos de sus `Asignatura` (matriculados directos + matriculados por grado, deduplicados).
4. El resultado se pinta en la tabla/lista de la vista correspondiente.
