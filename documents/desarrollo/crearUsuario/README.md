# CGU > crearUsuario > Desarrollo

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/crearUsuario/README.md) | [Diseño](../../diseño/crearUsuario/README.md) | [Índice Desarrollo](../README.md) | **Desarrollo** |
> |---|---|---|---|---|---|

**Actor:** Administrador

Registro de un nuevo usuario indicando nombre, email, contraseña, rol y número de registro (solo para alumnos).

---

## Backend

| Capa | Archivo | Función |
|------|---------|---------|
| Ruta | [`adminRoutes.ts#L7`](../../../src/plataforma-educativa/backend/src/routes/adminRoutes.ts#L7) | `POST /admin/usuarios` |
| Controlador | [`UsuarioController.ts#L37-L42`](../../../src/plataforma-educativa/backend/src/controllers/UsuarioController.ts#L37-L42) | `crearUsuario()` |
| Servicio | [`UsuarioService.ts#L82-L97`](../../../src/plataforma-educativa/backend/src/services/UsuarioService.ts#L82-L97) | `crearUsuario(data)` |

## Frontend

| Capa | Archivo | Función |
|------|---------|---------|
| Servicio | [`usuarioService.ts#L23-L26`](../../../src/plataforma-educativa/frontend/src/services/usuarioService.ts#L23-L26) | `crearUsuario(data)` |
| Vista | [`AdministradorDashboard.vue#L98-L112`](../../../src/plataforma-educativa/frontend/src/views/AdministradorDashboard.vue#L98-L112) | `irCrear()`, `handleCrear()` |

---

## Flujo real

1. El Administrador pulsa "crearUsuario" desde el listado (`abrirUsuarios`) y rellena el formulario (nombre, email, contraseña, rol y, si es alumno, número de registro opcional).
2. Al confirmar, la vista llama a `usuarioService.crearUsuario(data)` → `POST /api/admin/usuarios`.
3. `UsuarioService.crearUsuario` hace un `switch` sobre `data.rol` y crea el registro en la tabla Prisma correspondiente (`Alumno`, `Profesor`, `DirectorDeGrado` o `SecretariaAcademica`); si no se indica contraseña usa `'password123'` por defecto, y si es alumno sin nº de registro genera uno con `REG-${Date.now()}`.
4. Tras crear, la vista recarga el listado (`cargarUsuarios`) y vuelve a `abrirUsuarios`.
