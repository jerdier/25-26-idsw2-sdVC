# CGU > consultarDetalleMatricula > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/consultarDetalleMatricula/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** Secretaria

El Frontend (Vue 3) solicita las asignaturas matriculadas de un alumno al controlador Express, que las recupera de PostgreSQL mediante Prisma con su grupo y estado.

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

1. La Secretaria selecciona un alumno del listado de matrículas en el Frontend
2. Frontend → `GET /api/secretaria/alumnos/:alumnoId/matriculas` → `SecretariaController.getMatriculasByAlumno(alumnoId)`
3. `SecretariaService` consulta: `SELECT * FROM Matricula WHERE alumnoId = ? INCLUDE grado, asignaturas`
4. Frontend muestra el detalle de matrícula: grado, asignaturas y estado de cada una
