# CGU > crearUsuario > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/crearUsuario/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** Administrador

El Frontend (Vue 3) envía los datos del nuevo usuario al controlador Express, que verifica que el correo no esté registrado y lo inserta en PostgreSQL mediante el servicio.

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
| Usuario | Modelo |

---

## Flujo de secuencia

1. El Administrador introduce los datos del nuevo usuario (nombre, email, contraseña, rol) en el Frontend
2. Frontend → `POST /api/admin/usuarios { nombre, email, password, rol }` → `UsuarioController.createUsuario(...)`
3. `UsuarioService` verifica: `SELECT * FROM Usuario WHERE email = ?`
4. Si el correo no está en uso → `INSERT INTO Usuario (nombre, email, password, rol)` → Frontend muestra "usuario creado correctamente" con `201 Created`
5. Si el correo ya está en uso → Frontend muestra error "Email ya en uso" con `400 Bad Request`
