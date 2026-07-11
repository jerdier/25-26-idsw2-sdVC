# CGU > abrirAlumnos > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/abrirAlumnos/README.md) | [Índice Diseño](../README.md) | **Diseño** | [Desarrollo](../../desarrollo/abrirAlumnos/README.md) |
> |---|---|---|---|---|---|

**Actor:** Secretaria · Profesor

El Frontend (Vue 3) solicita el listado de alumnos al controlador Express, que delega en el servicio para recuperarlos de PostgreSQL mediante Prisma. Soporta filtrado mediante parámetros de query.

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

1. El actor accede al módulo de alumnos en el Frontend
2. Frontend → `GET /api/alumnos` → `AlumnoController.getAlumnos(filtros)`
3. `AlumnoService` consulta: `SELECT * FROM Alumno WHERE filtros`
4. Frontend muestra la lista de alumnos (nombre, documento, correo, estado)
