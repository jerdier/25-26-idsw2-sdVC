# CGU > consultarDetalleAlumno > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/consultarDetalleAlumno/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** Profesor

Permite al Profesor consultar la ficha completa de un alumno. El Frontend (Vue 3) solicita la información consolidada al controlador (Express), el cual consulta los datos del alumno y sus asistencias en la base de datos (PostgreSQL) mediante el servicio.

---

## Diagrama de secuencia

| ![secuencia](../../../images/diseño/consultarDetalleAlumno/secuencia.svg) |
| :--- |
| [secuencia.puml](../../../modelosUML/diseño/consultarDetalleAlumno/secuencia.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| Frontend (Vue 3) | Vista |
| AcademicController | Controlador |
| AcademicService | Servicio |
| Base de Datos (PostgreSQL) | Base de Datos |
| Alumno | Modelo |
| Asistencia | Modelo |

---

## Flujo de secuencia

1. El Profesor selecciona un alumno de la lista en el Frontend (Vue 3).
2. El Frontend (Vue 3) realiza una petición HTTP GET a `/api/academic/alumno/:alumnoId` al Controlador (`AcademicController`).
3. El Controlador (`AcademicController`) delega la lógica en el Servicio (`AcademicService`) llamando a `getAsignaturaAlumnos(asignaturaId)`.
4. El Servicio (`AcademicService`) realiza una consulta a la Base de Datos (PostgreSQL): `SELECT id, nombre, numeroRegistro, email FROM Alumno WHERE id = ?`.
5. La Base de Datos retorna el resultado `alumno : Alumno` al Servicio (`AcademicService`).
6. El AcademicService retorna el resultado `alumno : Alumno` al Controlador (`AcademicController`).
7. El Controlador (`AcademicController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ alumno }`.
8. El Frontend (Vue 3) realiza una petición HTTP GET a `/api/attendance/session/:sesionId` al Controlador (`AcademicController`).
9. El Controlador (`AcademicController`) delega la lógica en el Servicio (`AcademicService`) llamando a `getAttendanceBySession(sesionId)`.
10. El Servicio (`AcademicService`) realiza una consulta a la Base de Datos (PostgreSQL): `SELECT * FROM Asistencia WHERE sesionId = ? INCLUDE alumno(id, nombre, numeroRegistro)`.
11. La Base de Datos retorna el resultado `asistencias : Asistencia[]` al Servicio (`AcademicService`).
12. El AcademicService retorna el resultado `asistencias : Asistencia[]` al Controlador (`AcademicController`).
13. El Controlador (`AcademicController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ asistencias }`.
14. El Frontend (Vue 3) muestra detalle del alumno y su historial de asistencias al Profesor.
