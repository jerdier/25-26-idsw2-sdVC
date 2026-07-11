# CGU > exportarHistorialAsistencias > Desarrollo

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/exportarHistorialAsistencias/README.md) | [Diseño](../../diseño/exportarHistorialAsistencias/README.md) | [Índice Desarrollo](../README.md) | **Desarrollo** |
> |---|---|---|---|---|---|

**Actor:** Profesor

Descarga del historial de asistencias de una sesión en formato CSV.

---

## Backend

| Capa | Archivo | Función |
|------|---------|---------|
| Ruta | [`attendanceRoutes.ts#L12`](../../../src/plataforma-educativa/backend/src/routes/attendanceRoutes.ts#L12) | `GET /attendance/session/:sesionId/export` |
| Controlador | [`AttendanceController.ts#L26-L36`](../../../src/plataforma-educativa/backend/src/controllers/AttendanceController.ts#L26-L36) | `exportarHistorialAsistencias()` |
| Servicio | [`AttendanceService.ts#L30-L44`](../../../src/plataforma-educativa/backend/src/services/AttendanceService.ts#L30-L44) | `exportarHistorialAsistencias(sesionId, formato)` |

## Frontend

| Capa | Archivo | Función |
|------|---------|---------|
| Servicio | [`attendanceService.ts#L17-L20`](../../../src/plataforma-educativa/frontend/src/services/attendanceService.ts#L17-L20) | `exportarHistorialAsistencias(sesionId, formato)` |
| Vista | [`ProfesorDashboard.vue#L137-L145`](../../../src/plataforma-educativa/frontend/src/views/ProfesorDashboard.vue#L137-L145) | `handleExportar()` |

---

## Flujo real

1. El Profesor, desde el detalle de una sesión, pulsa "exportarHistorialAsistencias".
2. `handleExportar` llama a `attendanceService.exportarHistorialAsistencias(sesionId, 'CSV')` → `GET /api/attendance/session/:sesionId/export?formato=CSV` con `responseType: 'blob'`.
3. `AttendanceService.exportarHistorialAsistencias` consulta las `Asistencia` de la sesión (con el alumno) y construye manualmente un CSV (`Nombre,Número de Registro,Presente`); el controlador fija las cabeceras `Content-Disposition`/`Content-Type` para forzar la descarga.
4. La vista recibe el blob, crea una URL de objeto y dispara la descarga del archivo (`historial-<sesionId>.csv`) simulando un click en un `<a>`.

> Nota: aunque el análisis menciona formato Excel o PDF, la implementación actual solo genera CSV (el parámetro `formato` se recibe pero no se usa para variar el formato de salida).
