# Explicación del Diagrama: Exportar Dispensas

Este diagrama detalla el proceso para generar y descargar un reporte filtrado de todas las dispensas.

## Componentes Principales

- **PanelSecretaria (:PANEL_SECRETARIA)**: Inicio de la exportación de datos.
- **ExportarDispensasView**: Vista para seleccionar filtros y formato de exportación.
- **ReporteController**: Controlador encargado de estructurar el fichero de salida.
- **SolicitudDispensaRepository**: Repositorio que extrae las dispensas según los filtros aplicados.
- **ReporteDescargado (:REPORTE_DISPENSAS_DESCARGADO)**: Estado final tras la descarga exitosa.
- **CompletarGestion (:Collaboration CompletarGestion)**: Cierre del proceso.

## Flujo de Trabajo

1.  **Solicitud**: El usuario inicia la exportación desde su panel.
2.  **Estructuración**: La vista **ExportarDispensasView** pide al **ReporteController** el fichero (`estructurarFicheroDispensas(filtros)`).
3.  **Extracción**: El controlador obtiene los datos filtrados del **SolicitudDispensaRepository** (`extraerDispensasFiltradas`).
4.  **Finalización**:
    -   **Éxito**: Se entrega el **ReporteDescargado**.
    -   **Cancelación/Error**: Se activa **CompletarGestion**.
