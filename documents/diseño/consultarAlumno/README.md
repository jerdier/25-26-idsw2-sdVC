# CGU > consultarAlumno > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/consultarAlumno/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** Secretaria

Permite a la Secretaria consultar los datos de un alumno concreto seleccionado desde el listado. El Frontend (Vue 3) solicita los detalles del alumno al controlador (Express), el cual los obtiene de la base de datos (PostgreSQL) mediante el servicio y los muestra en la interfaz.

---

## Diagrama de secuencia

| ![secuencia](../../../images/diseño/consultarAlumno/secuencia.svg) |
| :--- |
| [secuencia.puml](../../../modelosUML/diseño/consultarAlumno/secuencia.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| Frontend (Vue 3) | Vista |
| AlumnoController | Controlador |
| AlumnoService | Servicio |
| Base de Datos (PostgreSQL) | Base de Datos |
| Alumno | Modelo |

---

## Flujo de secuencia

1. La Secretaria Academica selecciona un alumno de la lista en el Frontend (Vue 3).
2. El Frontend (Vue 3) realiza una petición HTTP GET a `/api/secretaria/alumnos/:alumnoId` al Controlador (`AlumnoController`).
3. El Controlador (`AlumnoController`) delega la lógica en el Servicio (`AlumnoService`) llamando a `obtenerAlumno(alumnoId)`.
4. El Servicio (`AlumnoService`) realiza una consulta a la Base de Datos (PostgreSQL): `SELECT * FROM Alumno WHERE id = ?`.
5. La Base de Datos retorna el resultado `Alumno` al Servicio (`AlumnoService`).
6. El AlumnoService retorna el resultado `Alumno` al Controlador (`AlumnoController`).
7. El Controlador (`AlumnoController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ alumno }`.
8. El Frontend (Vue 3) muestra ficha del alumno (nombre, dni, email, matrículas) a la Secretaria Academica.
