# CGU > importarMatriculas > Desarrollo

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/importarMatriculas/README.md) | [Diseño](../../diseño/importarMatriculas/README.md) | [Índice Desarrollo](../README.md) | **Desarrollo** |
> |---|---|---|---|---|---|

**Actor:** Secretaria

Importación masiva de matrículas a partir de un JSON, asociando alumnos (por DNI) a un grado concreto.

---

## Backend

| Capa | Archivo | Función |
|------|---------|---------|
| Ruta | [`secretariaRoutes.ts#L19`](../../../src/plataforma-educativa/backend/src/routes/secretariaRoutes.ts#L19) | `POST /secretaria/import/matriculas` |
| Controlador | [`SecretariaController.ts#L52-L60`](../../../src/plataforma-educativa/backend/src/controllers/SecretariaController.ts#L52-L60) | `importarMatriculas()` |
| Servicio | [`SecretariaService.ts#L85-L101`](../../../src/plataforma-educativa/backend/src/services/SecretariaService.ts#L85-L101) | `importarMatriculas(archivo)` |
| Validación | [`SecretariaService.ts#L4-L6`](../../../src/plataforma-educativa/backend/src/services/SecretariaService.ts#L4-L6) | `validarArchivo(archivo)` |

## Frontend

| Capa | Archivo | Función |
|------|---------|---------|
| Servicio | [`secretariaService.ts#L34-L37`](../../../src/plataforma-educativa/frontend/src/services/secretariaService.ts#L34-L37) | `importarMatriculas(data)` |
| Vista | [`SecretariaDashboard.vue#L82-L91`](../../../src/plataforma-educativa/frontend/src/views/SecretariaDashboard.vue#L82-L91) | `handleImportMatriculas()` |

---

## Flujo real

1. La Secretaria abre "abrirMatriculas → importarMatriculas", indica el `gradoId` destino y pega un JSON con la forma `[{ dni, asignaturaId }]`.
2. `handleImportMatriculas` parsea el JSON y llama a `secretariaService.importarMatriculas({ matriculas, secretariaId, gradoId })` → `POST /api/secretaria/import/matriculas`.
3. `SecretariaService.importarMatriculas` recorre cada fila: busca el `Alumno` por `dni` (si no existe, cuenta error); si ya existe una `Matricula` para ese alumno y grado la cuenta como actualizada (no la modifica), y si no existe la crea con Prisma.
4. La vista muestra el informe (`creadas`, `actualizadas`, `errores`).
