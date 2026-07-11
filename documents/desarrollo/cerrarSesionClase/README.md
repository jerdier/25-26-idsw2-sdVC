# CGU > cerrarSesionClase > Desarrollo

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/cerrarSesionClase/README.md) | [Diseño](../../diseño/cerrarSesionClase/README.md) | [Índice Desarrollo](../README.md) | **Desarrollo** |
> |---|---|---|---|---|---|

**Actor:** Profesor

Cierre de una sesión de clase activa, tras lo cual ya no se puede registrar asistencia en ella.

---

## Backend

| Capa | Archivo | Función |
|------|---------|---------|
| Ruta | [`academicRoutes.ts#L9`](../../../src/plataforma-educativa/backend/src/routes/academicRoutes.ts#L9) | `PUT /academic/sessions/:id/cerrar` |
| Controlador | [`AcademicController.ts#L71-L77`](../../../src/plataforma-educativa/backend/src/controllers/AcademicController.ts#L71-L77) | `cerrarSesionClase()` |
| Servicio | [`AcademicService.ts#L129-L135`](../../../src/plataforma-educativa/backend/src/services/AcademicService.ts#L129-L135) | `cerrarSesionClase(id)` |

## Frontend

| Capa | Archivo | Función |
|------|---------|---------|
| Servicio | [`academicService.ts#L37-L40`](../../../src/plataforma-educativa/frontend/src/services/academicService.ts#L37-L40) | `cerrarSesionClase(id)` |
| Vista | [`ProfesorDashboard.vue#L76-L84`](../../../src/plataforma-educativa/frontend/src/views/ProfesorDashboard.vue#L76-L84) | `handleCerrarSesion()` |

---

## Flujo real

1. El Profesor está en el detalle de una sesión activa y pulsa "cerrarSesionClase"; la vista pide confirmación (`confirm(...)`).
2. `handleCerrarSesion` llama a `academicService.cerrarSesionClase(id)` → `PUT /api/academic/sessions/:id/cerrar`.
3. `AcademicService.cerrarSesionClase` actualiza `SesionDeClase.estado` a `'CERRADA'` con Prisma.
4. La vista refleja el nuevo estado localmente y recarga la lista de sesiones.
