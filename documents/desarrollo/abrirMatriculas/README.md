# CGU > abrirMatriculas > Desarrollo

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/abrirMatriculas/README.md) | [Diseño](../../diseño/abrirMatriculas/README.md) | [Índice Desarrollo](../README.md) | **Desarrollo** |
> |---|---|---|---|---|---|

**Actor:** Secretaria

Listado de matrículas registradas en el sistema, con filtro opcional por nombre o número de registro del alumno.

---

## Backend

| Capa | Archivo | Función |
|------|---------|---------|
| Ruta | [`secretariaRoutes.ts#L13`](../../../src/plataforma-educativa/backend/src/routes/secretariaRoutes.ts#L13) | `GET /secretaria/matriculas` |
| Controlador | [`SecretariaController.ts#L20-L26`](../../../src/plataforma-educativa/backend/src/controllers/SecretariaController.ts#L20-L26) | `abrirMatriculas()` |
| Servicio | [`SecretariaService.ts#L33-L49`](../../../src/plataforma-educativa/backend/src/services/SecretariaService.ts#L33-L49) | `abrirMatriculas(filtro)` |

## Frontend

| Capa | Archivo | Función |
|------|---------|---------|
| Servicio | [`secretariaService.ts#L14-L17`](../../../src/plataforma-educativa/frontend/src/services/secretariaService.ts#L14-L17) | `abrirMatriculas(filtro)` |
| Vista | [`SecretariaDashboard.vue#L45-L51`](../../../src/plataforma-educativa/frontend/src/views/SecretariaDashboard.vue#L45-L51) | `handleAbrirMatriculas()`, panel `abrir-matriculas` |

---

## Flujo real

1. La Secretaria abre el módulo de matrículas o aplica un filtro en el buscador.
2. La vista llama a `secretariaService.abrirMatriculas(filtro)` → `GET /api/secretaria/matriculas?filtro=...`.
3. `SecretariaController.abrirMatriculas` delega en `SecretariaService.abrirMatriculas`, que consulta `Matricula` con Prisma filtrando por el alumno relacionado (nombre o nº registro), incluyendo `alumno` y `grado`, ordenado por fecha descendente.
4. La tabla de la vista muestra el resultado; desde ahí se navega a `cerrarCicloAcademico`, `importarMatriculas` o al detalle de una matrícula (`consultarDetalleMatricula`).
