# CGU > consultarDetalleMatricula > Desarrollo

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/consultarDetalleMatricula/README.md) | [Diseño](../../diseño/consultarDetalleMatricula/README.md) | [Índice Desarrollo](../README.md) | **Desarrollo** |
> |---|---|---|---|---|---|

**Actor:** Secretaria

Detalle de la matrícula de un alumno concreto, mostrando el grado y su director/secretaría asociados.

---

## Backend

| Capa | Archivo | Función |
|------|---------|---------|
| Ruta | [`secretariaRoutes.ts#L11`](../../../src/plataforma-educativa/backend/src/routes/secretariaRoutes.ts#L11) | `GET /secretaria/alumnos/:alumnoId/matriculas` |
| Controlador | [`SecretariaController.ts#L35-L40`](../../../src/plataforma-educativa/backend/src/controllers/SecretariaController.ts#L35-L40) | `consultarDetalleMatricula()` |
| Servicio | [`SecretariaService.ts#L57-L63`](../../../src/plataforma-educativa/backend/src/services/SecretariaService.ts#L57-L63) | `consultarDetalleMatricula(alumnoId)` |

## Frontend

| Capa | Archivo | Función |
|------|---------|---------|
| Servicio | [`secretariaService.ts#L24-L27`](../../../src/plataforma-educativa/frontend/src/services/secretariaService.ts#L24-L27) | `consultarDetalleMatricula(alumnoId)` |
| Vista | [`SecretariaDashboard.vue#L56-L60`](../../../src/plataforma-educativa/frontend/src/views/SecretariaDashboard.vue#L56-L60) | `handleConsultarMatricula()` |

---

## Flujo real

1. La Secretaria selecciona un alumno del listado de matrículas (`abrirMatriculas`) → `handleConsultarMatricula(a)`.
2. La vista llama a `secretariaService.consultarDetalleMatricula(a.id)` → `GET /api/secretaria/alumnos/:alumnoId/matriculas`.
3. `SecretariaService.consultarDetalleMatricula` busca en Prisma todas las `Matricula` de ese `alumnoId`, incluyendo el `grado` con su `director` y `secretaria`.
4. La vista muestra el detalle de las asignaturas/grado matriculados.
