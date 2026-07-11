# CGU > importarAlumnos > Desarrollo

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/importarAlumnos/README.md) | [Diseño](../../diseño/importarAlumnos/README.md) | [Índice Desarrollo](../README.md) | **Desarrollo** |
> |---|---|---|---|---|---|

**Actor:** Secretaria

Importación masiva de alumnos a partir de un JSON (en la UI se pega directamente; el análisis lo describe como archivo Excel/CSV). El sistema crea o actualiza cada alumno según su DNI.

---

## Backend

| Capa | Archivo | Función |
|------|---------|---------|
| Ruta | [`secretariaRoutes.ts#L17`](../../../src/plataforma-educativa/backend/src/routes/secretariaRoutes.ts#L17) | `POST /secretaria/import/alumnos` |
| Controlador | [`SecretariaController.ts#L42-L50`](../../../src/plataforma-educativa/backend/src/controllers/SecretariaController.ts#L42-L50) | `importarAlumnos()` |
| Servicio | [`SecretariaService.ts#L65-L83`](../../../src/plataforma-educativa/backend/src/services/SecretariaService.ts#L65-L83) | `importarAlumnos(archivo)` |
| Validación | [`SecretariaService.ts#L4-L6`](../../../src/plataforma-educativa/backend/src/services/SecretariaService.ts#L4-L6) | `validarArchivo(archivo)` |

## Frontend

| Capa | Archivo | Función |
|------|---------|---------|
| Servicio | [`secretariaService.ts#L29-L32`](../../../src/plataforma-educativa/frontend/src/services/secretariaService.ts#L29-L32) | `importarAlumnos(data)` |
| Vista | [`SecretariaDashboard.vue#L72-L80`](../../../src/plataforma-educativa/frontend/src/views/SecretariaDashboard.vue#L72-L80) | `handleImportAlumnos()`, panel `import-alumnos` (línea 167) |

---

## Flujo real

1. La Secretaria abre "abrirAlumnos → importarAlumnos" y pega un JSON con la forma `[{ nombre, email, dni }]` en el textarea.
2. `handleImportAlumnos` parsea el JSON y llama a `secretariaService.importarAlumnos({ alumnos })` → `POST /api/secretaria/import/alumnos`.
3. El controlador valida primero con `validarArchivo` (que el body tenga un array `alumnos` o `matriculas`); `SecretariaService.importarAlumnos` recorre cada fila y, por `dni`, hace `update` si el alumno ya existe o `create` si no (generando `REG-${Date.now()}` si falta el nº de registro), contando creados/actualizados/errores.
4. La vista muestra el informe (`creados`, `actualizados`, `errores`).
