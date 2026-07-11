# CGU > consultarAlumno > Desarrollo

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/consultarAlumno/README.md) | [Diseño](../../diseño/consultarAlumno/README.md) | [Índice Desarrollo](../README.md) | **Desarrollo** |
> |---|---|---|---|---|---|

**Actor:** Secretaria

Consulta de los datos de un alumno concreto (nombre, documento, email, matrículas y dispensas) desde el listado de alumnos de Secretaría.

---

## Backend

| Capa | Archivo | Función |
|------|---------|---------|
| Ruta | [`secretariaRoutes.ts#L9`](../../../src/plataforma-educativa/backend/src/routes/secretariaRoutes.ts#L9) | `GET /secretaria/alumnos/:alumnoId` |
| Controlador | [`SecretariaController.ts#L13-L18`](../../../src/plataforma-educativa/backend/src/controllers/SecretariaController.ts#L13-L18) | `consultarAlumno()` |
| Servicio | [`SecretariaService.ts#L23-L31`](../../../src/plataforma-educativa/backend/src/services/SecretariaService.ts#L23-L31) | `consultarAlumno(alumnoId)` |

## Frontend

| Capa | Archivo | Función |
|------|---------|---------|
| Servicio | [`secretariaService.ts#L9-L12`](../../../src/plataforma-educativa/frontend/src/services/secretariaService.ts#L9-L12) | `consultarAlumno(alumnoId)` |
| Vista | [`SecretariaDashboard.vue#L36-L43`](../../../src/plataforma-educativa/frontend/src/views/SecretariaDashboard.vue#L36-L43) | `handleConsultarAlumno()`, panel `consultar-alumno` |

---

## Flujo real

1. La Secretaria pulsa "consultarAlumno" sobre una fila del listado (`abrirAlumnos`).
2. La vista llama a `secretariaService.consultarAlumno(a.id)` → `GET /api/secretaria/alumnos/:alumnoId`.
3. `SecretariaService.consultarAlumno` busca el `Alumno` por id con Prisma incluyendo `matriculas` (con su `grado`) y `dispensas`.
4. La vista muestra nombre, email, nº de registro y DNI en la ficha de detalle.
