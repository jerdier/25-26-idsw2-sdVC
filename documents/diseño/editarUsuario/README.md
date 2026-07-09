# CGU > editarUsuario > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/editarUsuario/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** Administrador

Permite al Administrador modificar los datos de un usuario. El Frontend (Vue 3) precarga la información y envía las modificaciones al controlador (Express), el cual actualiza el registro en la base de datos (PostgreSQL) mediante el servicio.

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

1. El Administrador selecciona usuario y modifica campos (nombre, email, rol) en el Frontend (Vue 3).
2. El Frontend (Vue 3) realiza una petición HTTP GET a `/api/usuarios/:id` al Controlador (`UsuarioController`).
3. El Controlador (`UsuarioController`) delega la lógica en el Servicio (`UsuarioService`) llamando a `getUsuario(id)`.
4. El Servicio (`UsuarioService`) realiza una consulta a la Base de Datos (PostgreSQL): `SELECT * FROM [tabla_rol] WHERE id = ?`.
5. La Base de Datos retorna el resultado `usuario : Usuario` al Servicio (`UsuarioService`).
6. El UsuarioService retorna el resultado `usuario : Usuario` al Controlador (`UsuarioController`).
7. El Controlador (`UsuarioController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ usuario }`.
8. El Frontend (Vue 3) muestra formulario con datos actuales al Administrador.
9. El Administrador confirma cambios (nombre, email, rol) en el Frontend (Vue 3).
10. El Frontend (Vue 3) realiza una petición HTTP PUT a `/api/usuarios/:id { nombre, email, rol }` al Controlador (`UsuarioController`).
11. El Controlador (`UsuarioController`) delega la lógica en el Servicio (`UsuarioService`) llamando a `updateUsuario(id, nombre, email, rol)`.
12. El Servicio (`UsuarioService`) realiza una consulta a la Base de Datos (PostgreSQL): `SELECT * FROM Usuario WHERE email = ? AND id != ?`.
13. La Base de Datos retorna el resultado `Optional<Usuario>` al Servicio (`UsuarioService`).
14. **ALT email no en uso**:
  - El Servicio (`UsuarioService`) realiza una consulta a la Base de Datos (PostgreSQL): `UPDATE [tabla_rol] SET nombre=?, email=?, rol=? WHERE id=?`.
  - La Base de Datos retorna el resultado `usuarioActualizado : Usuario` al Servicio (`UsuarioService`).
  - El UsuarioService retorna el resultado `usuarioActualizado : Usuario` al Controlador (`UsuarioController`).
  - El Controlador (`UsuarioController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ usuarioActualizado }`.
  - El Frontend (Vue 3) muestra el mensaje "usuario actualizado correctamente" al Administrador.
15. **Else / De lo contrario**:
  - El UsuarioService retorna el resultado `throw Error("Email ya en uso")` al Controlador (`UsuarioController`).
  - El Controlador (`UsuarioController`) responde al Frontend (Vue 3) con un estado `400 Bad` con los datos `Request { message: "Email ya en uso" }`.
  - El Frontend (Vue 3) muestra error "Email ya en uso" al Administrador.
