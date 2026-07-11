# CGU > editarUsuario > Desarrollo

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/editarUsuario/README.md) | [Diseño](../../diseño/editarUsuario/README.md) | [Índice Desarrollo](../README.md) | **Desarrollo** |
> |---|---|---|---|---|---|

**Actor:** Administrador

Modificación de nombre y email de un usuario existente.

---

## Backend

| Capa | Archivo | Función |
|------|---------|---------|
| Ruta | [`usuarioRoutes.ts#L12`](../../../src/plataforma-educativa/backend/src/routes/usuarioRoutes.ts#L12) | `PUT /usuarios/:id` |
| Controlador | [`UsuarioController.ts#L29-L35`](../../../src/plataforma-educativa/backend/src/controllers/UsuarioController.ts#L29-L35) | `editarUsuario()` |
| Servicio | [`UsuarioService.ts#L41-L61`](../../../src/plataforma-educativa/backend/src/services/UsuarioService.ts#L41-L61) | `editarUsuario(id, data)` |

## Frontend

| Capa | Archivo | Función |
|------|---------|---------|
| Servicio | [`usuarioService.ts#L18-L21`](../../../src/plataforma-educativa/frontend/src/services/usuarioService.ts#L18-L21) | `editarUsuario(id, data)` |
| Vista | [`AdministradorDashboard.vue#L49-L64`](../../../src/plataforma-educativa/frontend/src/views/AdministradorDashboard.vue#L49-L64) | `irEditar()`, `handleEditar()` |

---

## Flujo real

1. El Administrador pulsa "editarUsuario" en el detalle; la vista precarga `editForm` con los datos actuales (`irEditar`).
2. Al guardar, `handleEditar` llama a `usuarioService.editarUsuario(id, editForm)` → `PUT /api/usuarios/:id`.
3. `UsuarioService.editarUsuario` localiza el usuario probando las cuatro tablas Prisma, valida que el nuevo email no esté en uso (si cambió) y actualiza el registro correspondiente.
4. La vista actualiza el estado local (`sel.value`), muestra confirmación y recarga el listado.
