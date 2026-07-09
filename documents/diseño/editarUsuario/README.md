# CGU > editarUsuario > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/editarUsuario/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** Administrador

El Frontend (Vue 3) precarga los datos del usuario desde Express y envía los cambios. El servicio verifica que el correo no esté en uso por otro usuario antes de actualizar el registro en PostgreSQL.

---

## Diagrama de secuencia

| ![secuencia](../../../images/diseño/editarUsuario/secuencia.svg) |
| :--- |
| [secuencia.puml](../../../modelosUML/diseño/editarUsuario/secuencia.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| Frontend (Vue 3) | Vista |
| UsuarioController | Controlador |
| UsuarioService | Servicio |
| Base de Datos (PostgreSQL) | Base de Datos |
| Usuario | Modelo |

---

## Flujo de secuencia

1. El Administrador selecciona el usuario a editar en el Frontend
2. Frontend → `GET /api/usuarios/:id` → `UsuarioController.getUsuario(id)`
3. `UsuarioService` consulta: `SELECT * FROM Usuario WHERE id = ?`
4. Frontend muestra el formulario precargado con los datos actuales
5. El Administrador modifica los campos (nombre, email, rol) y confirma
6. Frontend → `PUT /api/usuarios/:id { nombre, email, rol }` → `UsuarioController.updateUsuario(id, ...)`
7. `UsuarioService` verifica: `SELECT * FROM Usuario WHERE email = ? AND id != ?`
8. Si el correo no está en uso → `UPDATE Usuario SET nombre=?, email=?, rol=? WHERE id=?` → Frontend muestra "usuario actualizado correctamente"
9. Si el correo ya está en uso → Frontend muestra error "Email ya en uso" con `400 Bad Request`
