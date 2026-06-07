# Explicación del Diagrama: Exportar Historial de Asistencias

Este diagrama detalla el proceso para generar y exportar un reporte de asistencias de un grupo.

## Componentes Principales

- **PanelProfesor (:PANEL_PROFESOR)**: Interfaz de inicio de la exportación.
- **ExportarAsistenciasView**: Vista para seleccionar el grupo y el formato de exportación.
- **ReporteController**: Controlador encargado de la lógica de generación de reportes.
- **AsistenciaRepository**: Repositorio de donde se extraen las métricas de asistencia.
- **DocumentoGenerado (:DOCUMENTO_ASISTENCIAS_GENERADO)**: Resultado final (archivo generado).
- **CompletarGestion (:Collaboration CompletarGestion)**: Cierre del flujo.

## Flujo de Trabajo

1.  **Solicitud**: El profesor inicia la exportación desde su panel.
2.  **Generación**: La vista **ExportarAsistenciasView** pide al **ReporteController** el reporte (`generarReporteAsistencias(grupoId, formato)`).
3.  **Extracción**: El controlador obtiene las métricas necesarias del **AsistenciaRepository** (`extraerMetricasPorGrupo`).
4.  **Finalización**:
    -   **Éxito**: Se entrega el **DocumentoGenerado**.
    -   **Cancelación/Error**: Se activa **CompletarGestion**.
