# CGU > crearSesionClase > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/crearSesionClase/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** Profesor

Permite al Profesor crear una nueva sesión de clase. El Frontend (Vue 3) carga las asignaturas del profesor desde el controlador (Express) y luego envía los datos de la sesión para que el servicio la registre en la base de datos (PostgreSQL) con estado activo.

---

## Diagrama de secuencia

| ![secuencia](../../../images/diseño/crearSesionClase/secuencia.svg) |
| :--- |
| [secuencia.puml](../../../modelosUML/diseño/crearSesionClase/secuencia.puml) |

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

1. El Profesor abre formulario de nueva sesión en el Frontend (Vue 3).
2. El Frontend (Vue 3) realiza una petición HTTP GET a `/api/academic/profesor/:profesorId/asignaturas` al Controlador (`AcademicController`).
3. El Controlador (`AcademicController`) delega la lógica en el Servicio (`AcademicService`) llamando a `getTeacherAsignaturas(profesorId)`.
4. El Servicio (`AcademicService`) realiza una consulta a la Base de Datos (PostgreSQL): `SELECT * FROM Asignatura WHERE profesorId = ? INCLUDE Grado`.
5. La Base de Datos retorna el resultado `Asignatura[]` al Servicio (`AcademicService`).
6. El AcademicService retorna el resultado `asignaturas : Asignatura[]` al Controlador (`AcademicController`).
7. El Controlador (`AcademicController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ asignaturas }`.
8. El Frontend (Vue 3) muestra selector de asignatura y formulario al Profesor.
9. El Profesor selecciona asignatura e introduce (fecha, aula, duracion) en el Frontend (Vue 3).
10. El Frontend (Vue 3) realiza una petición HTTP POST a `/api/academic/sessions { asignaturaId, fecha, aula, duracion }` al Controlador (`AcademicController`).
11. El Controlador (`AcademicController`) delega la lógica en el Servicio (`AcademicService`) llamando a `createSession(asignaturaId, fecha, aula, duracion)`.
12. El Servicio (`AcademicService`) realiza una consulta a la Base de Datos (PostgreSQL): `INSERT INTO SesionDeClase (asignaturaId, fecha, aula, duracion, estado) VALUES (?, ?, ?, ?, 'ACTIVA')`.
13. La Base de Datos retorna el resultado `sesionCreada : SesionDeClase` al Servicio (`AcademicService`).
14. El AcademicService retorna el resultado `sesionCreada : SesionDeClase` al Controlador (`AcademicController`).
15. El Controlador (`AcademicController`) responde al Frontend (Vue 3) con un estado `201 Created` con los datos `{ sesionCreada }`.
16. El Frontend (Vue 3) muestra el mensaje "sesión creada correctamente" al Profesor.
