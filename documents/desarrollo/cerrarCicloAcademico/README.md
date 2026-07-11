# CGU > cerrarCicloAcademico > Desarrollo

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/cerrarCicloAcademico/README.md) | [Diseño](../../diseño/cerrarCicloAcademico/README.md) | [Índice Desarrollo](../README.md) | **Desarrollo** |
> |---|---|---|---|---|---|

**Actor:** Secretaria

Cierre del ciclo académico activo, consolidando el estado de las matrículas al final del periodo lectivo.

---

## Backend

| Capa | Archivo | Función |
|------|---------|---------|
| Ruta | [`secretariaRoutes.ts#L15`](../../../src/plataforma-educativa/backend/src/routes/secretariaRoutes.ts#L15) | `POST /secretaria/ciclos/cerrar` |
| Controlador | [`SecretariaController.ts#L28-L33`](../../../src/plataforma-educativa/backend/src/controllers/SecretariaController.ts#L28-L33) | `cerrarCicloAcademico()` |
| Servicio | [`SecretariaService.ts#L51-L55`](../../../src/plataforma-educativa/backend/src/services/SecretariaService.ts#L51-L55) | `cerrarCicloAcademico()` |

## Frontend

| Capa | Archivo | Función |
|------|---------|---------|
| Servicio | [`secretariaService.ts#L19-L22`](../../../src/plataforma-educativa/frontend/src/services/secretariaService.ts#L19-L22) | `cerrarCicloAcademico()` |
| Vista | [`SecretariaDashboard.vue#L63-L70`](../../../src/plataforma-educativa/frontend/src/views/SecretariaDashboard.vue#L63-L70) | `handleCerrarCiclo()` |

---

## Flujo real

1. La Secretaria, desde "abrirMatriculas", pulsa "cerrarCicloAcademico".
2. `handleCerrarCiclo` llama a `secretariaService.cerrarCicloAcademico()` → `POST /api/secretaria/ciclos/cerrar`.
3. `SecretariaService.cerrarCicloAcademico` cuenta las matrículas existentes con Prisma (`prisma.matricula.count()`) y devuelve el total archivado (`matriculasArchivadas`).
4. La vista muestra un mensaje de confirmación con el número de matrículas archivadas.

> Nota: la implementación actual del servicio solo cuenta las matrículas; no cambia su estado a "histórica" como describe el análisis (`documents/analisis/cerrarCicloAcademico`). Es una discrepancia entre el diseño documentado y el código real.
