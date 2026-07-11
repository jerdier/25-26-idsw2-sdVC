# CGU > crearSesionClase > Desarrollo

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/crearSesionClase/README.md) | [Diseño](../../diseño/crearSesionClase/README.md) | [Índice Desarrollo](../README.md) | **Desarrollo** |
> |---|---|---|---|---|---|

**Actor:** Profesor

Creación de una nueva sesión de clase para una asignatura del profesor, indicando aula y duración.

---

## Backend

| Capa | Archivo | Función |
|------|---------|---------|
| Ruta | [`academicRoutes.ts#L7`](../../../src/plataforma-educativa/backend/src/routes/academicRoutes.ts#L7) | `POST /academic/sessions` |
| Controlador | [`AcademicController.ts#L54-L61`](../../../src/plataforma-educativa/backend/src/controllers/AcademicController.ts#L54-L61) | `crearSesionClase()` |
| Servicio | [`AcademicService.ts#L114-L119`](../../../src/plataforma-educativa/backend/src/services/AcademicService.ts#L114-L119) | `crearSesionClase(asignaturaId, fecha, aula, duracion)` |

## Frontend

| Capa | Archivo | Función |
|------|---------|---------|
| Servicio | [`academicService.ts#L27-L30`](../../../src/plataforma-educativa/frontend/src/services/academicService.ts#L27-L30) | `crearSesionClase(...)` |
| Vista | [`ProfesorDashboard.vue#L97-L113`](../../../src/plataforma-educativa/frontend/src/views/ProfesorDashboard.vue#L97-L113) | `irCrearSesion()`, `handleCrearSesion()` |

---

## Flujo real

1. El Profesor entra en "abrirAsistencias" y pulsa crear sesión; la vista precarga la primera asignatura del profesor (`asignaturas` viene de `academicService.getTeacherAsignaturas`, cargado en `onMounted`).
2. Al confirmar, `handleCrearSesion` llama a `academicService.crearSesionClase(asignaturaId, fecha, aula, duracion)` → `POST /api/academic/sessions`.
3. `AcademicService.crearSesionClase` inserta el registro en `SesionDeClase` con Prisma (`asignaturaId`, `fecha`, `aula`, `duracion`).
4. La vista recarga la lista de sesiones (`recargarSesiones`) y vuelve a la vista `sesiones`.
