# CGU > consultarDetalleAlumno > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/consultarDetalleAlumno/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** Profesor

---

## información del artefacto

| Campo | Valor |
|-------|-------|
| **Proyecto** | CGU - Centro de Gestión Universitaria |
| **Disciplina** | Análisis y Diseño |

---

## diagrama de secuencia

![secuencia](../../../images/diseño/consultarDetalleAlumno/secuencia.svg)

> fuente: [secuencia.puml](../../../modelosUML/diseño/consultarDetalleAlumno/secuencia.puml)

---

## clases de diseño identificadas

### frontend (Vue 3)

| Clase | Responsabilidad |
|-------|----------------|
| `ProfessorDashboard.vue` | Muestra la ficha del alumno seleccionado y su historial de asistencias por sesión |

### backend (Express + TypeScript)

| Clase | Responsabilidad |
|-------|----------------|
| `AcademicController` | Recibe la petición de detalle de alumno y de asistencias, delega en el servicio correspondiente |
| `AcademicService` | Recupera los datos del alumno y sus registros de asistencia para la sesión indicada |

### base de datos (PostgreSQL)

| Tabla | Responsabilidad |
|-------|----------------|
| `Alumno` | Datos identificativos del alumno (nombre, numeroRegistro, email) |
| `Asistencia` | Registros de presencia/ausencia por sesión, enlazados al alumno |

---

## flujo de secuencia

1. El Profesor selecciona un alumno de la lista en `ProfessorDashboard.vue`.
2. El frontend llama `GET /api/academic/alumno/:alumnoId` al `AcademicController`.
3. `AcademicService` ejecuta `SELECT id, nombre, numeroRegistro, email FROM Alumno WHERE id = ?`.
4. La base de datos devuelve el alumno; el frontend recibe `200 OK { alumno }`.
5. El frontend llama `GET /api/attendance/session/:sesionId` al `AcademicController`.
6. `AcademicService` ejecuta `SELECT * FROM Asistencia WHERE sesionId = ? INCLUDE alumno(...)`.
7. La base de datos devuelve `asistencias : Asistencia[]`; el frontend recibe `200 OK { asistencias }`.
8. El frontend muestra el detalle del alumno junto con su historial de asistencias.

---

## referencias

- [Índice de diseño](../README.md)
- [Análisis de este caso](../../analisis/consultarDetalleAlumno/README.md)
- [Modelo del dominio](../../requisitado/00-modelo-del-dominio/README.md)
- [secuencia.puml](../../../modelosUML/diseño/consultarDetalleAlumno/secuencia.puml)
