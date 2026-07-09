# CGU > consultarSolicitudDispensa > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/consultarSolicitudDispensa/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** Alumno · Profesor · DirectorDeGrado · Secretaria

Permite al actor consultar el detalle completo de una solicitud de dispensa. El Frontend (Vue 3) solicita los datos al controlador (Express), el cual los recupera de la base de datos (PostgreSQL) a través del servicio.

---

## Diagrama de secuencia

| ![secuencia](../../../images/diseño/consultarSolicitudDispensa/secuencia.svg) |
| :--- |
| [secuencia.puml](../../../modelosUML/diseño/consultarSolicitudDispensa/secuencia.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| Frontend (Vue 3) | Vista |
| DispensaController | Controlador |
| DispensaService | Servicio |
| Base de Datos (PostgreSQL) | Base de Datos |
| Dispensa | Modelo |

---

## Flujo de secuencia

1. El Usuario accede a consultar solicitudes de dispensa en el Frontend (Vue 3).
2. El Frontend (Vue 3) realiza una petición HTTP GET a `/api/dispensas` al Controlador (`DispensaController`).
3. El Controlador (`DispensaController`) delega la lógica en el Servicio (`DispensaService`) llamando a `getDispensas(usuarioId, rol)`.
4. El Servicio (`DispensaService`) realiza una consulta a la Base de Datos (PostgreSQL): `SELECT * FROM Dispensa (con filtros según rol)`.
5. La Base de Datos retorna el resultado `dispensas : Dispensa[]` al Servicio (`DispensaService`).
6. El DispensaService retorna el resultado `dispensas : Dispensa[]` al Controlador (`DispensaController`).
7. El Controlador (`DispensaController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ dispensas }`.
8. El Frontend (Vue 3) muestra lista de solicitudes al Usuario.
9. El Usuario selecciona una solicitud (dispensaId) en el Frontend (Vue 3).
10. El Frontend (Vue 3) realiza una petición HTTP GET a `/api/dispensas/:dispensaId` al Controlador (`DispensaController`).
11. El Controlador (`DispensaController`) delega la lógica en el Servicio (`DispensaService`) llamando a `getDispensa(dispensaId)`.
12. El Servicio (`DispensaService`) realiza una consulta a la Base de Datos (PostgreSQL): `SELECT * FROM Dispensa WHERE id = ?`.
13. La Base de Datos retorna el resultado `dispensa : Dispensa` al Servicio (`DispensaService`).
14. El DispensaService retorna el resultado `dispensa : Dispensa` al Controlador (`DispensaController`).
15. El Controlador (`DispensaController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ dispensa }`.
16. El Frontend (Vue 3) muestra detalle de la solicitud al Usuario.
