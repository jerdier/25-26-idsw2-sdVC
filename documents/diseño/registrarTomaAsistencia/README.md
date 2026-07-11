# CGU > registrarTomaAsistencia > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/registrarTomaAsistencia/README.md) | [Índice Diseño](../README.md) | **Diseño** | [Desarrollo](../../desarrollo/registrarTomaAsistencia/README.md) |
> |---|---|---|---|---|---|

**Actor:** Profesor

El Frontend (Vue 3) carga los alumnos matriculados en la asignatura de la sesión activa y envía las marcas de asistencia al controlador Express, que las persiste en PostgreSQL mediante el servicio.

---

## Diagrama de secuencia

| ![secuencia](../../../images/diseño/registrarTomaAsistencia/secuencia.svg) |
| :--- |
| [secuencia.puml](../../../modelosUML/diseño/registrarTomaAsistencia/secuencia.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| Frontend (Vue 3) | Vista |
| AcademicController | Controlador |
| AttendanceController | Controlador |
| AcademicService | Servicio |
| AttendanceService | Servicio |
| Base de Datos (PostgreSQL) | Base de Datos |
| Alumno | Modelo |
| Asistencia | Modelo |

---

## Flujo de secuencia

1. El Profesor accede a pasar lista en la sesión activa en el Frontend
2. Frontend → `GET /api/academic/sessions/:sesionId/alumnos` → `AcademicController.getSessionAlumnos(sesionId)`
3. `AcademicService` consulta: `SELECT * FROM Alumno WHERE id IN (SELECT alumnoId FROM _AlumnoToAsignatura WHERE asignaturaId = ?)`
4. Frontend muestra la lista de alumnos para pasar lista
5. El Profesor marca el estado de cada alumno (PRESENTE / AUSENTE / TARDE) y confirma
6. Frontend → `POST /api/attendance/record { sesionId, alumnoId, presente }` → `AttendanceController.recordAttendance(sesionId, alumnoId, presente)`
7. `AttendanceService` ejecuta: `INSERT INTO Asistencia (sesionId, alumnoId, presente) ON CONFLICT DO UPDATE`
8. Frontend actualiza la marca del alumno en pantalla (proceso por cada alumno)
