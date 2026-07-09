# CGU > editarSesionClase > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/editarSesionClase/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** Profesor

Permite al Profesor modificar una sesión de clase. El Frontend (Vue 3) precarga los datos actuales y asignaturas desde el controlador (Express), y envía los cambios para que el servicio actualice la base de datos (PostgreSQL).

---

## Diagrama de secuencia

| ![secuencia](../../../images/diseño/editarSesionClase/secuencia.svg) |
| :--- |
| [secuencia.puml](../../../modelosUML/diseño/editarSesionClase/secuencia.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| Frontend (Vue 3) | Vista |
| AcademicController | Controlador |
| AcademicService | Servicio |
| Base de Datos (PostgreSQL) | Base de Datos |
| Asignatura | Modelo |
| SesionDeClase | Modelo |

---

## Flujo de secuencia

1. El Profesor selecciona sesión a editar en el Frontend (Vue 3).
2. El Frontend (Vue 3) realiza una petición HTTP GET a `/api/academic/sessions/:sesionId` al Controlador (`AcademicController`).
3. El Controlador (`AcademicController`) delega la lógica en el Servicio (`AcademicService`) llamando a `getSession(sesionId)`.
4. El Servicio (`AcademicService`) realiza una consulta a la Base de Datos (PostgreSQL): `SELECT * FROM SesionDeClase WHERE id = ?`.
5. La Base de Datos retorna el resultado `sesion : SesionDeClase` al Servicio (`AcademicService`).
6. El AcademicService retorna el resultado `sesion : SesionDeClase` al Controlador (`AcademicController`).
7. El Controlador (`AcademicController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ sesion }`.
8. El Frontend (Vue 3) realiza una petición HTTP GET a `/api/academic/teacher/:profesorId/asignaturas` al Controlador (`AcademicController`).
9. El Controlador (`AcademicController`) delega la lógica en el Servicio (`AcademicService`) llamando a `getTeacherAsignaturas(profesorId)`.
10. El Servicio (`AcademicService`) realiza una consulta a la Base de Datos (PostgreSQL): `SELECT * FROM Asignatura WHERE profesorId = ? INCLUDE Grado`.
11. La Base de Datos retorna el resultado `asignaturas : Asignatura[]` al Servicio (`AcademicService`).
12. El AcademicService retorna el resultado `asignaturas : Asignatura[]` al Controlador (`AcademicController`).
13. El Controlador (`AcademicController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ asignaturas }`.
14. El Frontend (Vue 3) muestra formulario con datos actuales y lista de asignaturas disponibles al Profesor.
15. El Profesor confirma cambios (asignaturaId, fecha, aula, duracion) en el Frontend (Vue 3).
16. El Frontend (Vue 3) realiza una petición HTTP PUT a `/api/academic/sessions/:sesionId { asignaturaId, fecha, aula, duracion }` al Controlador (`AcademicController`).
17. El Controlador (`AcademicController`) delega la lógica en el Servicio (`AcademicService`) llamando a `updateSession(sesionId, asignaturaId, fecha, aula, duracion)`.
18. El Servicio (`AcademicService`) realiza una consulta a la Base de Datos (PostgreSQL): `UPDATE SesionDeClase SET asignaturaId=?, fecha=?, aula=?, duracion=? WHERE id=?`.
19. La Base de Datos retorna el resultado `sesionActualizada : SesionDeClase` al Servicio (`AcademicService`).
20. El AcademicService retorna el resultado `sesionActualizada : SesionDeClase` al Controlador (`AcademicController`).
21. El Controlador (`AcademicController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ sesionActualizada }`.
22. El Frontend (Vue 3) muestra sesión con cambios aplicados al Profesor.
