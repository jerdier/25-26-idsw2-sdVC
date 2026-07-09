# CGU > editarSolicitudDispensa > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/editarSolicitudDispensa/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** Alumno · DirectorDeGrado · Secretaria

Permite al actor modificar una solicitud de dispensa. El Frontend (Vue 3) envía los cambios al controlador (Express) y el servicio actualiza los datos o el estado de resolución en la base de datos (PostgreSQL).

---

## Diagrama de secuencia

| ![secuencia](../../../images/diseño/editarSolicitudDispensa/secuencia.svg) |
| :--- |
| [secuencia.puml](../../../modelosUML/diseño/editarSolicitudDispensa/secuencia.puml) |

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

1. El Usuario accede a editar solicitud de dispensa (dispensaId) en el Frontend (Vue 3).
2. El Frontend (Vue 3) realiza una petición HTTP GET a `/api/dispensas/:dispensaId` al Controlador (`DispensaController`).
3. El Controlador (`DispensaController`) delega la lógica en el Servicio (`DispensaService`) llamando a `getDispensa(dispensaId)`.
4. El Servicio (`DispensaService`) realiza una consulta a la Base de Datos (PostgreSQL): `SELECT * FROM Dispensa WHERE id = ?`.
5. La Base de Datos retorna el resultado `dispensa : Dispensa` al Servicio (`DispensaService`).
6. El DispensaService retorna el resultado `dispensa : Dispensa` al Controlador (`DispensaController`).
7. El Controlador (`DispensaController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ dispensa }`.
8. El Frontend (Vue 3) muestra formulario con datos actuales al Usuario.
9. El Usuario modifica datos y confirma en el Frontend (Vue 3).
10. El Frontend (Vue 3) realiza una petición HTTP PUT a `/api/dispensas/:dispensaId { datos }` al Controlador (`DispensaController`).
11. El Controlador (`DispensaController`) delega la lógica en el Servicio (`DispensaService`) llamando a `editarSolicitudDispensa(dispensaId, datos)`.
12. El Servicio (`DispensaService`) realiza una consulta a la Base de Datos (PostgreSQL): `UPDATE Dispensa SET ... WHERE id = ?`.
13. La Base de Datos retorna el resultado `dispensa : Dispensa` al Servicio (`DispensaService`).
14. El DispensaService retorna el resultado `dispensa : Dispensa` al Controlador (`DispensaController`).
15. El Controlador (`DispensaController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ dispensa }`.
16. El Frontend (Vue 3) muestra el mensaje "solicitud actualizada correctamente" al Usuario.
