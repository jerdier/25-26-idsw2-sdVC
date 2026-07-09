# CGU > exportarHistorialAsistencias > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/exportarHistorialAsistencias/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** Profesor

Permite al Profesor descargar el historial de asistencias. El Frontend (Vue 3) solicita los datos al controlador (Express), y el servicio recupera las asistencias de la base de datos (PostgreSQL) para generar y retornar el archivo (Excel o PDF).

---

## Diagrama de secuencia

| ![secuencia](../../../images/diseño/exportarHistorialAsistencias/secuencia.svg) |
| :--- |
| [secuencia.puml](../../../modelosUML/diseño/exportarHistorialAsistencias/secuencia.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| Frontend (Vue 3) | Vista |
| AttendanceController | Controlador |
| AcademicController | Controlador |
| AttendanceService | Servicio |
| AcademicService | Servicio |
| Base de Datos (PostgreSQL) | Base de Datos |
| Alumno | Modelo |
| Asistencia | Modelo |
| SesionDeClase | Modelo |

---

## Flujo de secuencia

1. El Profesor solicita exportar historial de asistencias en el Frontend (Vue 3).
2. El Frontend (Vue 3) realiza una petición HTTP GET a `/api/attendance/session/:sesionId` al Controlador (`AttendanceController`).
3. El Controlador (`AttendanceController`) delega la lógica en el Servicio (`AttendanceService`) llamando a `getAttendanceBySession(sesionId)`.
4. El Servicio (`AttendanceService`) realiza una consulta a la Base de Datos (PostgreSQL): `SELECT * FROM Asistencia WHERE sesionId = ?`.
5. La Base de Datos retorna el resultado `asistencias : Asistencia[]` al Servicio (`AttendanceService`).
6. El AttendanceService retorna el resultado `asistencias : Asistencia[]` al Controlador (`AttendanceController`).
7. El Controlador (`AttendanceController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ asistencias }`.
8. El Frontend (Vue 3) realiza una petición HTTP GET a `/api/academic/sessions/:sesionId` al Controlador (`AcademicController`).
9. El Controlador (`AcademicController`) delega la lógica en el Servicio (`AcademicService`) llamando a `getSession(sesionId)`.
10. El Servicio (`AcademicService`) realiza una consulta a la Base de Datos (PostgreSQL): `SELECT * FROM SesionDeClase WHERE id = ?`.
11. La Base de Datos retorna el resultado `sesion : SesionDeClase` al Servicio (`AcademicService`).
12. El AcademicService retorna el resultado `sesion : SesionDeClase` al Controlador (`AcademicController`).
13. El Controlador (`AcademicController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ sesion }`.
14. El Frontend (Vue 3) muestra historial de asistencias y selector de formato (PDF / Excel) al Profesor.
15. El Profesor selecciona formato y solicita descarga en el Frontend (Vue 3).
16. El Frontend (Vue 3) realiza una petición HTTP GET a `/api/attendance/session/:sesionId/export?formato=...` al Controlador (`AttendanceController`).
17. El Controlador (`AttendanceController`) delega la lógica en el Servicio (`AttendanceService`) llamando a `exportHistorial(sesionId, formato)`.
18. El Servicio (`AttendanceService`) realiza una consulta a la Base de Datos (PostgreSQL): `SELECT * FROM Asistencia JOIN Alumno ON ... WHERE sesionId = ?`.
19. La Base de Datos retorna el resultado `datos : Asistencia[]` al Servicio (`AttendanceService`).
20. El AttendanceService retorna el resultado `archivo : Blob` al Controlador (`AttendanceController`).
21. El Controlador (`AttendanceController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `(Content-Disposition: attachment)`.
22. El Frontend (Vue 3) descarga archivo generado al Profesor.
