# CGU > editarSesionClase > Desarrollo

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/editarSesionClase/README.md) | [Diseño](../../diseño/editarSesionClase/README.md) | [Índice Desarrollo](../README.md) | **Desarrollo** |
> |---|---|---|---|---|---|

**Actor:** Profesor

Modificación del aula y duración de una sesión de clase existente.

---

## Backend

| Capa | Archivo | Función |
|------|---------|---------|
| Ruta | [`academicRoutes.ts#L10`](../../../src/plataforma-educativa/backend/src/routes/academicRoutes.ts#L10) | `PUT /academic/sessions/:id` |
| Controlador | [`AcademicController.ts#L63-L69`](../../../src/plataforma-educativa/backend/src/controllers/AcademicController.ts#L63-L69) | `editarSesionClase()` |
| Servicio | [`AcademicService.ts#L121-L127`](../../../src/plataforma-educativa/backend/src/services/AcademicService.ts#L121-L127) | `editarSesionClase(id, data)` |

## Frontend

| Capa | Archivo | Función |
|------|---------|---------|
| Servicio | [`academicService.ts#L32-L35`](../../../src/plataforma-educativa/frontend/src/services/academicService.ts#L32-L35) | `editarSesionClase(id, data)` |
| Vista | [`ProfesorDashboard.vue#L60-L74`](../../../src/plataforma-educativa/frontend/src/views/ProfesorDashboard.vue#L60-L74) | `iniciarEditarSesion()`, `handleEditarSesion()` |

---

## Flujo real

1. El Profesor entra en el detalle de una sesión y pulsa editar; `iniciarEditarSesion` precarga `editSesionForm` con el aula y la duración actuales.
2. Al guardar, `handleEditarSesion` llama a `academicService.editarSesionClase(id, { aula, duracion })` → `PUT /api/academic/sessions/:id`.
3. `AcademicService.editarSesionClase` actualiza `SesionDeClase` con Prisma (solo `aula` y `duracion`).
4. La vista actualiza `sesionSel` con la respuesta y recarga la lista de sesiones del profesor.
