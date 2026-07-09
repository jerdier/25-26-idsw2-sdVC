# CGU > crearUsuario > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/crearUsuario/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** Administrador

Permite al Administrador registrar un nuevo usuario. El Frontend (Vue 3) envía los datos al controlador (Express), y el servicio inserta el nuevo registro de usuario en la base de datos (PostgreSQL).

---

## Diagrama de secuencia

| ![secuencia](../../../images/diseño/crearUsuario/secuencia.svg) |
| :--- |
| [secuencia.puml](../../../modelosUML/diseño/crearUsuario/secuencia.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| Frontend (Vue 3) | Vista |
| UsuarioController | Controlador |
| UsuarioService | Servicio |
| Base de Datos (PostgreSQL) | Base de Datos |

---

## Flujo de secuencia

1. El Administrador ingresa datos del nuevo usuario (nombre, email, password, rol) en el Frontend (Vue 3).
2. El Frontend (Vue 3) realiza una petición HTTP POST a `/api/admin/usuarios { nombre, email, password, rol }` al Controlador (`UsuarioController`).
3. El Controlador (`UsuarioController`) delega la lógica en el Servicio (`UsuarioService`) llamando a `createUsuario(nombre, email, password, rol)`.
4. El Servicio (`UsuarioService`) realiza una consulta a la Base de Datos (PostgreSQL): `SELECT * FROM [tabla_rol] WHERE email = ?`.
5. La Base de Datos retorna el resultado `Optional<Usuario>` al Servicio (`UsuarioService`).
6. **ALT no registrado**:
  - El Servicio (`UsuarioService`) realiza una consulta a la Base de Datos (PostgreSQL): `INSERT INTO [tabla_rol] (nombre, email, password) VALUES (?, ?, ?)`.
  - La Base de Datos retorna el resultado `usuarioCreado : [Rol]` al Servicio (`UsuarioService`).
  - El UsuarioService retorna el resultado `usuarioCreado : [Rol]` al Controlador (`UsuarioController`).
  - El Controlador (`UsuarioController`) responde al Frontend (Vue 3) con un estado `201 Created` con los datos `{ usuarioCreado }`.
  - El Frontend (Vue 3) muestra el mensaje "usuario creado correctamente" al Administrador.
7. **Else / De lo contrario**:
  - El UsuarioService retorna el resultado `throw Error("Email ya registrado")` al Controlador (`UsuarioController`).
  - El Controlador (`UsuarioController`) responde al Frontend (Vue 3) con un estado `400 Bad` con los datos `Request { message: "Email ya en uso" }`.
  - El Frontend (Vue 3) muestra el mensaje "Mostrar error "Email ya en uso"" al Administrador.
