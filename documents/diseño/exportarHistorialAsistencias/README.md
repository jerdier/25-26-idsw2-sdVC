# CGU > exportarHistorialAsistencias > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/exportarHistorialAsistencias/README.md) | [Índice Diseño](../README.md) | **Diseño** |
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

![secuencia](../../../images/diseño/exportarHistorialAsistencias/secuencia.svg)

> fuente: [secuencia.puml](../../../modelosUML/diseño/exportarHistorialAsistencias/secuencia.puml)

---

## clases de diseño identificadas

### frontend (Vue 3)

| Clase | Responsabilidad |
|-------|----------------|
| `ProfessorDashboard.vue` | Muestra el historial de asistencias de la sesión y el selector de formato para la descarga |

### backend (Express + TypeScript)

| Clase | Responsabilidad |
|-------|----------------|
| `AttendanceController` | Gestiona la carga de asistencias y la generación del archivo de exportación |
| `AttendanceService` | Recupera las asistencias de la sesión y genera el archivo en el formato solicitado |
| `AcademicController` | Gestiona la carga de los datos de la sesión |
| `AcademicService` | Recupera los datos de la sesión para incluirlos en el informe exportado |

### base de datos (PostgreSQL)

| Tabla | Responsabilidad |
|-------|----------------|
| `Asistencia` | Proporciona los registros de asistencia de la sesión para el informe |
| `SesionDeClase` | Proporciona los metadatos de la sesión (fecha, aula, asignatura) para el informe |

---

## flujo de secuencia

1. El caso se activa por `<<include>> exportarHistorialAsistencias(sesionId)` desde `cerrarSesionClase`.
2. El frontend llama `GET /api/attendance/session/:sesionId` → `AttendanceController` → `AttendanceService.getAttendanceBySession(sesionId)` → `SELECT * FROM Asistencia WHERE sesionId = ?` → devuelve `Asistencia[]`.
3. El frontend llama `GET /api/academic/sessions/:sesionId` → `AcademicController` → `AcademicService.getSession(sesionId)` → `SELECT * FROM SesionDeClase WHERE id = ?` → devuelve `sesion`.
4. El frontend muestra el historial de asistencias y el selector de formato (PDF / Excel).
5. El Profesor selecciona el formato y solicita la descarga.
6. El frontend llama `GET /api/attendance/session/:sesionId/export?formato=...`.
7. `AttendanceController` → `AttendanceService.exportHistorial(sesionId, formato)`.
8. `AttendanceService` ejecuta `SELECT * FROM Asistencia JOIN Alumno WHERE sesionId = ?` → genera el archivo en el formato solicitado.
9. `AttendanceController` responde `200 OK` con cabecera `Content-Disposition: attachment` → el frontend inicia la descarga del archivo.

---

## referencias

- [Índice de diseño](../README.md)
- [Análisis de este caso](../../analisis/exportarHistorialAsistencias/README.md)
- [Modelo del dominio](../../requisitado/00-modelo-del-dominio/README.md)
- [secuencia.puml](../../../modelosUML/diseño/exportarHistorialAsistencias/secuencia.puml)
