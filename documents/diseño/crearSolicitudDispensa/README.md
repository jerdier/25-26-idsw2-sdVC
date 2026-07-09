# CGU > crearSolicitudDispensa > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/crearSolicitudDispensa/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** Alumno · Secretaria

Permite al actor crear una nueva solicitud de dispensa. El Frontend (Vue 3) envía los datos al controlador (Express), y el servicio crea el registro correspondiente en la base de datos (PostgreSQL) con estado pendiente.

---

## Diagrama de secuencia

| ![secuencia](../../../images/diseño/crearSolicitudDispensa/secuencia.svg) |
| :--- |
| [secuencia.puml](../../../modelosUML/diseño/crearSolicitudDispensa/secuencia.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| Frontend (Vue 3) | Vista |
| DispensaController | Controlador |
| DispensaService | Servicio |
| Base de Datos (PostgreSQL) | Base de Datos |
| Asignatura | Modelo |
| Dispensa | Modelo |

---

## Flujo de secuencia

1. El Usuario accede a crear solicitud de dispensa en el Frontend (Vue 3).
2. El Frontend (Vue 3) realiza una petición HTTP GET a `/api/dispensas/datos` al Controlador (`DispensaController`).
3. El Controlador (`DispensaController`) delega la lógica en el Servicio (`DispensaService`) llamando a `getDatosCrearDispensa(usuarioId, rol)`.
4. El Servicio (`DispensaService`) realiza una consulta a la Base de Datos (PostgreSQL): `SELECT * FROM Asignatura (y Alumno si rol=Secretaria)`.
5. La Base de Datos retorna el resultado `datos` al Servicio (`DispensaService`).
6. El DispensaService retorna el resultado `datos` al Controlador (`DispensaController`).
7. El Controlador (`DispensaController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ datos }`.
8. El Frontend (Vue 3) muestra formulario al Usuario.
9. El Usuario rellena datos y envía (alumnoId, asignaturaId, periodo, horario, motivo) en el Frontend (Vue 3).
10. El Frontend (Vue 3) realiza una petición HTTP POST a `/api/dispensas { alumnoId, asignaturaId, periodo, horario, motivo }` al Controlador (`DispensaController`).
11. El Controlador (`DispensaController`) delega la lógica en el Servicio (`DispensaService`) llamando a `crearSolicitudDispensa(alumnoId, asignaturaId, periodo, horario, motivo)`.
12. El Servicio (`DispensaService`) realiza una consulta a la Base de Datos (PostgreSQL): `INSERT INTO Dispensa (alumnoId, asignaturaId, periodo, horario, motivo, estado='PENDIENTE')`.
13. La Base de Datos retorna el resultado `dispensa : Dispensa` al Servicio (`DispensaService`).
14. El DispensaService retorna el resultado `dispensa : Dispensa` al Controlador (`DispensaController`).
15. El Controlador (`DispensaController`) responde al Frontend (Vue 3) con un estado `201 Created` con los datos `{ dispensa }`.
16. El Frontend (Vue 3) muestra el mensaje "solicitud creada correctamente" al Usuario.
