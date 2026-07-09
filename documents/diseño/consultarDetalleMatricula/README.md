# CGU > consultarDetalleMatricula > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/consultarDetalleMatricula/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** Secretaria

Permite a la Secretaria consultar el detalle de la matrícula de un alumno concreto. El Frontend (Vue 3) solicita la información al controlador (Express), el cual obtiene las asignaturas matriculadas y sus estados desde la base de datos (PostgreSQL) mediante el servicio.

---

## Diagrama de secuencia

| ![secuencia](../../../images/diseño/consultarDetalleMatricula/secuencia.svg) |
| :--- |
| [secuencia.puml](../../../modelosUML/diseño/consultarDetalleMatricula/secuencia.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| Frontend (Vue 3) | Vista |
| SecretariaController | Controlador |
| SecretariaService | Servicio |
| Base de Datos (PostgreSQL) | Base de Datos |
| Alumno | Modelo |
| Matricula | Modelo |

---

## Flujo de secuencia

1. La Secretaria accede a la sección de matrículas y busca por nombre o registro en el Frontend (Vue 3).
2. El Frontend (Vue 3) realiza una petición HTTP GET a `/api/secretaria/alumnos` al Controlador (`SecretariaController`).
3. El Controlador (`SecretariaController`) delega la lógica en el Servicio (`SecretariaService`) llamando a `getAllAlumnos()`.
4. El Servicio (`SecretariaService`) realiza una consulta a la Base de Datos (PostgreSQL): `SELECT * FROM Alumno INCLUDE matriculas(grado)`.
5. La Base de Datos retorna el resultado `alumnos : Alumno[]` al Servicio (`SecretariaService`).
6. El SecretariaService retorna el resultado `alumnos : Alumno[]` al Controlador (`SecretariaController`).
7. El Controlador (`SecretariaController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ alumnos }`.
8. El Frontend (Vue 3) muestra lista de alumnos con sus matrículas a la Secretaria.
9. La Secretaria selecciona un alumno para ver el detalle en el Frontend (Vue 3).
10. El Frontend (Vue 3) realiza una petición HTTP GET a `/api/secretaria/alumnos/:alumnoId/matriculas` al Controlador (`SecretariaController`).
11. El Controlador (`SecretariaController`) delega la lógica en el Servicio (`SecretariaService`) llamando a `getMatriculasByAlumno(alumnoId)`.
12. El Servicio (`SecretariaService`) realiza una consulta a la Base de Datos (PostgreSQL): `SELECT * FROM Matricula WHERE alumnoId = ? INCLUDE grado(director, secretaria), asignaturas`.
13. La Base de Datos retorna el resultado `matriculas : Matricula[]` al Servicio (`SecretariaService`).
14. El SecretariaService retorna el resultado `matriculas : Matricula[]` al Controlador (`SecretariaController`).
15. El Controlador (`SecretariaController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ matriculas }`.
16. El Frontend (Vue 3) muestra detalle de matrícula: grado, asignaturas y responsables a la Secretaria.
