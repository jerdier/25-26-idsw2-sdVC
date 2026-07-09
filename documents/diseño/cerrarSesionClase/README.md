# CGU > cerrarSesionClase > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/cerrarSesionClase/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** Profesor

Permite al Profesor dar por concluida una sesión de clase activa. El Frontend (Vue 3) solicita cambiar el estado de la sesión, y el servicio de Express actualiza el registro en la base de datos (PostgreSQL) a cerrada.

---

## Diagrama de secuencia

| ![secuencia](../../../images/diseño/cerrarSesionClase/secuencia.svg) |
| :--- |
| [secuencia.puml](../../../modelosUML/diseño/cerrarSesionClase/secuencia.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| Frontend (Vue 3) | Vista |
| AcademicController | Controlador |
| AttendanceController | Controlador |
| AcademicService | Servicio |
| AttendanceService | Servicio |
| Base de Datos (PostgreSQL) | Base de Datos |
| Asistencia | Modelo |
| SesionDeClase | Modelo |

---

## Flujo de secuencia

1. El Profesor solicita cerrar sesión (sesionId) en el Frontend (Vue 3).
2. El Frontend (Vue 3) realiza una petición HTTP GET a `/api/academic/sessions/:sesionId` al Controlador (`AcademicController`).
3. El Controlador (`AcademicController`) delega la lógica en el Servicio (`AcademicService`) llamando a `getSession(sesionId)`.
4. El Servicio (`AcademicService`) realiza una consulta a la Base de Datos (PostgreSQL): `SELECT * FROM SesionDeClase WHERE id = ?`.
5. La Base de Datos retorna el resultado `sesion : SesionDeClase` al Servicio (`AcademicService`).
6. El AcademicService retorna el resultado `sesion : SesionDeClase` al Controlador (`AcademicController`).
7. El Controlador (`AcademicController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ sesion }`.
8. El Frontend (Vue 3) realiza una petición HTTP GET a `/api/attendance/session/:sesionId` al Controlador (`AttendanceController`).
9. El Controlador (`AttendanceController`) delega la lógica en el Servicio (`AttendanceService`) llamando a `getAttendanceBySession(sesionId)`.
10. El Servicio (`AttendanceService`) realiza una consulta a la Base de Datos (PostgreSQL): `SELECT * FROM Asistencia WHERE sesionId = ?`.
11. La Base de Datos retorna el resultado `asistencias : Asistencia[]` al Servicio (`AttendanceService`).
12. El AttendanceService retorna el resultado `asistencias : Asistencia[]` al Controlador (`AttendanceController`).
13. El Controlador (`AttendanceController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ asistencias }`.
14. El Frontend (Vue 3) muestra resumen de asistencias y hora de finalización al Profesor.
15. El Profesor confirma cierre de sesión en el Frontend (Vue 3).
16. El Frontend (Vue 3) realiza una petición HTTP PUT a `/api/academic/sessions/:sesionId/cerrar` al Controlador (`AcademicController`).
17. El Controlador (`AcademicController`) delega la lógica en el Servicio (`AcademicService`) llamando a `closeSession(sesionId)`.
18. El Servicio (`AcademicService`) realiza una consulta a la Base de Datos (PostgreSQL): `UPDATE SesionDeClase SET estado='CERRADA' WHERE id=?`.
19. La Base de Datos retorna el resultado `sesionCerrada : SesionDeClase` al Servicio (`AcademicService`).
20. El AcademicService retorna el resultado `sesionCerrada : SesionDeClase` al Controlador (`AcademicController`).
21. El Controlador (`AcademicController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ sesionCerrada }`.
22. El Frontend (Vue 3) muestra el mensaje "sesión cerrada correctamente" al Profesor.
