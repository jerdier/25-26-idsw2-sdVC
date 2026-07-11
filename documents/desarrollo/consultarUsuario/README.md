# CGU > consultarUsuario > Desarrollo

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/consultarUsuario/README.md) | [Diseño](../../diseño/consultarUsuario/README.md) | [Índice Desarrollo](../README.md) | **Desarrollo** |
> |---|---|---|---|---|---|

**Actor:** Administrador

Consulta del detalle de un usuario concreto seleccionado desde el listado (`abrirUsuarios`).

---

## Backend

| Capa | Archivo | Función |
|------|---------|---------|
| Ruta | [`usuarioRoutes.ts#L8-L9`](../../../src/plataforma-educativa/backend/src/routes/usuarioRoutes.ts#L8-L9) | `GET /usuarios/:id` |
| Controlador | [`UsuarioController.ts#L5-L11`](../../../src/plataforma-educativa/backend/src/controllers/UsuarioController.ts#L5-L11) | `consultarUsuario()` |
| Servicio | [`UsuarioService.ts#L4-L15`](../../../src/plataforma-educativa/backend/src/services/UsuarioService.ts#L4-L15) | `consultarUsuario(id)` |

## Frontend

| Capa | Archivo | Función |
|------|---------|---------|
| Servicio | [`usuarioService.ts#L4-L7`](../../../src/plataforma-educativa/frontend/src/services/usuarioService.ts#L4-L7) | `consultarUsuario(id)` |
| Vista | [`AdministradorDashboard.vue#L41-L47`](../../../src/plataforma-educativa/frontend/src/views/AdministradorDashboard.vue#L41-L47) | `irDetalle()` (comentario `// CU: consultarUsuario`) |

---

## Flujo real

1. El Administrador selecciona un usuario de la lista → `irDetalle(u)`.
2. La vista llama a `usuarioService.consultarUsuario(u.id)` → `GET /api/usuarios/:id`.
3. `UsuarioService.consultarUsuario` prueba secuencialmente las cuatro tablas Prisma (`Alumno`, `Profesor`, `DirectorDeGrado`, `SecretariaAcademica`) hasta encontrar el registro y le añade el campo `rol`.
4. La vista muestra la ficha con nombre, email, nº de registro/DNI y rol, con acciones para `editarUsuario`, eliminar o (si es alumno) gestionar asignaturas.

> Nota: esta función se llamaba `getUsuario` en el código (sin relación con el nombre del caso de uso), mientras que el nombre `consultarUsuario` lo ocupaba la función de listado (hoy `abrirUsuarios`). Se renombraron ambas para que coincidan con su caso de uso real.
