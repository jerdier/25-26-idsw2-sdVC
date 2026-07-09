# CGU > abrirAlumnos > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/abrirAlumnos/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** Secretaria · Profesor

Permite al actor acceder al listado completo de alumnos registrados en el sistema. El Frontend (Vue 3) solicita al controlador (Express) los registros aplicando los filtros indicados, y el servicio los recupera de la base de datos (PostgreSQL) mediante Prisma.

---

## Diagrama de secuencia

| ![secuencia](../../../images/diseño/abrirAlumnos/secuencia.svg) |
| :--- |
| [secuencia.puml](../../../modelosUML/diseño/abrirAlumnos/secuencia.puml) |

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

1. El Usuario accede al módulo de alumnos en el Frontend (Vue 3).
2. El Frontend (Vue 3) realiza una petición HTTP GET a `/api/alumnos` al Controlador (`AlumnoController`).
3. El Controlador (`AlumnoController`) delega la lógica en el Servicio (`AlumnoService`) llamando a `getAlumnos(filtros)`.
4. El Servicio (`AlumnoService`) realiza una consulta a la Base de Datos (PostgreSQL): `SELECT * FROM Alumno WHERE filtros`.
5. La Base de Datos retorna el resultado `alumnos : Alumno[]` al Servicio (`AlumnoService`).
6. El AlumnoService retorna el resultado `alumnos : Alumno[]` al Controlador (`AlumnoController`).
7. El Controlador (`AlumnoController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ alumnos }`.
8. El Frontend (Vue 3) muestra lista de alumnos (nombre, documento, correo, estado) al Usuario.
9. **OPT filtrar lista**:
  - El Usuario aplica filtros en el Frontend (Vue 3).
  - El Frontend (Vue 3) realiza una petición HTTP GET a `/api/alumnos?filtros=...` al Controlador (`AlumnoController`).
  - El Controlador (`AlumnoController`) delega la lógica en el Servicio (`AlumnoService`) llamando a `getAlumnos(filtros)`.
  - El Servicio (`AlumnoService`) realiza una consulta a la Base de Datos (PostgreSQL): `SELECT * FROM Alumno WHERE filtros`.
  - La Base de Datos retorna el resultado `alumnos : Alumno[]` al Servicio (`AlumnoService`).
  - El AlumnoService retorna el resultado `alumnos : Alumno[]` al Controlador (`AlumnoController`).
  - El Controlador (`AlumnoController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ alumnos }`.
  - El Frontend (Vue 3) muestra lista filtrada al Usuario.
