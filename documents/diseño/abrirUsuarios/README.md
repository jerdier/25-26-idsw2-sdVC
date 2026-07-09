# CGU > abrirUsuarios > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/abrirUsuarios/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** Administrador

Permite al Administrador acceder al listado de usuarios registrados en el sistema. El Frontend (Vue 3) solicita al controlador (Express) los registros con los filtros indicados, y el servicio los recupera de la base de datos (PostgreSQL) mediante Prisma.

---

## Diagrama de secuencia

| ![secuencia](../../../images/diseño/abrirUsuarios/secuencia.svg) |
| :--- |
| [secuencia.puml](../../../modelosUML/diseño/abrirUsuarios/secuencia.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| Frontend (Vue 3) | Vista |
| UsuarioController | Controlador |
| UsuarioService | Servicio |
| Base de Datos (PostgreSQL) | Base de Datos |
| usuarios | Modelo |

---

## Flujo de secuencia

1. El Administrador solicita abrir gestión de usuarios en el Frontend (Vue 3).
2. El Frontend (Vue 3) realiza una petición HTTP GET a `/api/admin/usuarios` al Controlador (`UsuarioController`).
3. El Controlador (`UsuarioController`) delega la lógica en el Servicio (`UsuarioService`) llamando a `obtenerUsuarios()`.
4. El Servicio (`UsuarioService`) realiza una consulta a la Base de Datos (PostgreSQL): `SELECT * FROM usuarios`.
5. La Base de Datos retorna el resultado `List<Usuario>` al Servicio (`UsuarioService`).
6. El UsuarioService retorna el resultado `List<Usuario>` al Controlador (`UsuarioController`).
7. El Controlador (`UsuarioController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ usuarios }`.
8. El Frontend (Vue 3) muestra lista de usuarios (nombre, apellidos, rol, estado) al Administrador.
