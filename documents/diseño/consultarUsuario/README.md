# CGU > consultarUsuario > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/consultarUsuario/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** Administrador

Permite al Administrador consultar los datos de un usuario concreto. El Frontend (Vue 3) solicita la ficha de usuario al controlador (Express), el cual la recupera de la base de datos (PostgreSQL) mediante el servicio.

---

## Diagrama de secuencia

| ![secuencia](../../../images/diseño/consultarUsuario/secuencia.svg) |
| :--- |
| [secuencia.puml](../../../modelosUML/diseño/consultarUsuario/secuencia.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| Frontend (Vue 3) | Vista |
| UsuarioController | Controlador |
| UsuarioService | Servicio |
| Base de Datos (PostgreSQL) | Base de Datos |
| Alumno | Modelo |

---

## Flujo de secuencia

1. El Administrador busca usuario por email o id en el Frontend (Vue 3).
2. El Frontend (Vue 3) realiza una petición HTTP GET a `/api/usuarios?filtro=...` al Controlador (`UsuarioController`).
3. El Controlador (`UsuarioController`) delega la lógica en el Servicio (`UsuarioService`) llamando a `getUsuarios(filtro)`.
4. El Servicio (`UsuarioService`) realiza una consulta a la Base de Datos (PostgreSQL): `SELECT * FROM Alumno UNION Profesor UNION DirectorDeGrado UNION SecretariaAcademica WHERE nombre LIKE ? OR email LIKE ?`.
5. La Base de Datos retorna el resultado `usuarios : Usuario[]` al Servicio (`UsuarioService`).
6. El UsuarioService retorna el resultado `usuarios : Usuario[]` al Controlador (`UsuarioController`).
7. El Controlador (`UsuarioController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ usuarios }`.
8. El Frontend (Vue 3) muestra lista de usuarios coincidentes al Administrador.
9. El Administrador selecciona un usuario en el Frontend (Vue 3).
10. El Frontend (Vue 3) realiza una petición HTTP GET a `/api/usuarios/:id` al Controlador (`UsuarioController`).
11. El Controlador (`UsuarioController`) delega la lógica en el Servicio (`UsuarioService`) llamando a `getUsuario(id)`.
12. El Servicio (`UsuarioService`) realiza una consulta a la Base de Datos (PostgreSQL): `SELECT * FROM [tabla_rol] WHERE id = ?`.
13. La Base de Datos retorna el resultado `usuario : Usuario` al Servicio (`UsuarioService`).
14. El UsuarioService retorna el resultado `usuario : Usuario` al Controlador (`UsuarioController`).
15. El Controlador (`UsuarioController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ usuario }`.
16. El Frontend (Vue 3) muestra detalle del usuario al Administrador.
