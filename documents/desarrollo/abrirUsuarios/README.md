# CGU > abrirUsuarios > Desarrollo

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/abrirUsuarios/README.md) | [Diseño](../../diseño/abrirUsuarios/README.md) | [Índice Desarrollo](../README.md) | **Desarrollo** |
> |---|---|---|---|---|---|

**Actor:** Administrador

Listado de todos los usuarios del sistema (alumnos, profesores, directores y secretarías), con filtro por nombre o email.

---

## Backend

| Capa | Archivo | Función |
|------|---------|---------|
| Ruta | [`usuarioRoutes.ts#L6-L7`](../../../src/plataforma-educativa/backend/src/routes/usuarioRoutes.ts#L6-L7) | `GET /usuarios` |
| Controlador | [`UsuarioController.ts#L21-L27`](../../../src/plataforma-educativa/backend/src/controllers/UsuarioController.ts#L21-L27) | `abrirUsuarios()` |
| Servicio | [`UsuarioService.ts#L25-L39`](../../../src/plataforma-educativa/backend/src/services/UsuarioService.ts#L25-L39) | `abrirUsuarios(filtro)` |

## Frontend

| Capa | Archivo | Función |
|------|---------|---------|
| Servicio | [`usuarioService.ts#L13-L16`](../../../src/plataforma-educativa/frontend/src/services/usuarioService.ts#L13-L16) | `abrirUsuarios(filtro)` |
| Vista | [`AdministradorDashboard.vue#L27-L31`](../../../src/plataforma-educativa/frontend/src/views/AdministradorDashboard.vue#L27-L31) | `cargarUsuarios()` |

---

## Flujo real

1. El Administrador abre "Gestión de usuarios" (se carga automáticamente al montar la vista, `onMounted` en `AdministradorDashboard.vue#L33`) o busca por texto.
2. La vista llama a `usuarioService.abrirUsuarios(filtro)` → `GET /api/usuarios?filtro=...`.
3. `UsuarioService.abrirUsuarios` lanza en paralelo (`Promise.all`) una búsqueda por `OR` de nombre/email en `Alumno`, `Profesor`, `DirectorDeGrado` y `SecretariaAcademica`, y devuelve la unión de los cuatro con un campo `rol` añadido.
4. La vista pinta la lista con badge de rol; desde ahí se accede a `consultarUsuario` (detalle) o `crearUsuario`.

> Nota: hasta hace poco, esta función se llamaba `consultarUsuario` en el código (mismo nombre que el caso de uso de detalle) mientras que la de detalle se llamaba `getUsuario`, sin relación con su CU real. Se renombraron ambas para que el nombre en código coincida con el caso de uso que implementan.
