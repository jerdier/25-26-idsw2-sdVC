# CGU > exportarHistorialAsistencias > Análisis

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Índice Análisis](../README.md) | **Análisis** | [Diseño](../../diseño/exportarHistorialAsistencias/README.md) |
> |---|---|---|---|---|

**Actor:** Profesor

Permite al Profesor descargar el historial de asistencias de una asignatura en un rango de fechas determinado. El sistema recupera los registros del periodo y genera el archivo en el formato seleccionado (Excel o PDF).


---

## Diagrama de colaboración

| ![colaboracion](../../../images/analisis/exportarHistorialAsistencias/colaboracion.svg) |
| :--- |
| [colaboracion.puml](../../../modelosUML/analisis/exportarHistorialAsistencias/colaboracion.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| ExportarHistorialAsistenciasView | Vista |
| AsistenciaController | Controlador |
| AsistenciaRepository | Modelo |
| Asistencia | Modelo |

---

## Flujo de colaboración

1. El Profesor solicita exportar el historial de asistencias → se activa `ExportarHistorialAsistenciasView`
2. El Profesor configura los parámetros (asignatura, rango de fechas, formato) y solicita la carga → `ExportarHistorialAsistenciasView` invoca `AsistenciaController.cargarAsistencias(asignaturaId, fechaInicio, fechaFin)`
3. `AsistenciaController` consulta `AsistenciaRepository.findByAsignatura(asignaturaId, fechaInicio, fechaFin)` para obtener los registros del periodo
4. `AsistenciaRepository` recupera los registros de `Asistencia` y los retorna al controlador para su previsualización
5. El Profesor confirma la generación → `ExportarHistorialAsistenciasView` invoca `AsistenciaController.generarArchivo(asignaturaId, fechaInicio, fechaFin, formato)` para producir y descargar el archivo
