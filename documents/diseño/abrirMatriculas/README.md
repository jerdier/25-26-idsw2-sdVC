# CGU > abrirMatriculas > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/abrirMatriculas/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** Secretaria

Permite a la Secretaria acceder al listado de matrículas registradas en el sistema. El Frontend (Vue 3) solicita al controlador (Express) los registros con los filtros indicados, y el servicio los recupera de la base de datos (PostgreSQL) mediante Prisma.

---

## Diagrama de secuencia

| ![secuencia](../../../images/diseño/abrirMatriculas/secuencia.svg) |
| :--- |
| [secuencia.puml](../../../modelosUML/diseño/abrirMatriculas/secuencia.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| Frontend (Vue 3) | Vista |
| MatriculaController | Controlador |
| MatriculaService | Servicio |
| Base de Datos (PostgreSQL) | Base de Datos |
| Matricula | Modelo |

---

## Flujo de secuencia

1. La Secretaria accede al módulo de matrículas en el Frontend (Vue 3).
2. El Frontend (Vue 3) realiza una petición HTTP GET a `/api/matriculas` al Controlador (`MatriculaController`).
3. El Controlador (`MatriculaController`) delega la lógica en el Servicio (`MatriculaService`) llamando a `getMatriculas(filtros)`.
4. El Servicio (`MatriculaService`) realiza una consulta a la Base de Datos (PostgreSQL): `SELECT * FROM Matricula INCLUDE alumno, asignaturas`.
5. La Base de Datos retorna el resultado `matriculas : Matricula[]` al Servicio (`MatriculaService`).
6. El MatriculaService retorna el resultado `matriculas : Matricula[]` al Controlador (`MatriculaController`).
7. El Controlador (`MatriculaController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ matriculas }`.
8. El Frontend (Vue 3) muestra lista de matrículas (alumno, asignatura, periodo, estado) a la Secretaria.
9. **OPT filtrar lista**:
  - La Secretaria aplica filtros en el Frontend (Vue 3).
  - El Frontend (Vue 3) realiza una petición HTTP GET a `/api/matriculas?filtros=...` al Controlador (`MatriculaController`).
  - El Controlador (`MatriculaController`) delega la lógica en el Servicio (`MatriculaService`) llamando a `getMatriculas(filtros)`.
  - El Servicio (`MatriculaService`) realiza una consulta a la Base de Datos (PostgreSQL): `SELECT * FROM Matricula WHERE filtros`.
  - La Base de Datos retorna el resultado `matriculas : Matricula[]` al Servicio (`MatriculaService`).
  - El MatriculaService retorna el resultado `matriculas : Matricula[]` al Controlador (`MatriculaController`).
  - El Controlador (`MatriculaController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ matriculas }`.
  - El Frontend (Vue 3) muestra lista filtrada a la Secretaria.
