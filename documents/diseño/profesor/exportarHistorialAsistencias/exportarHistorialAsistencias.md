# Explicación del Diseño: Exportar Asistencias

Este diagrama de secuencia ilustra el flujo técnico para la generación y descarga de reportes de asistencia en formato binario.

## Componentes Técnicos

- **Frontend (React)**: Inicia la descarga del reporte.
- **ReporteController**: Punto de entrada para la generación de documentos.
- **ReporteService**: Capa de negocio que estructura el reporte y genera el flujo de datos.
- **AsistenciaRepository**: Proporciona las métricas y datos crudos de asistencia.

## Flujo de Implementación

1.  **Petición HTTP**: El Frontend ejecuta un `GET /api/reportes/asistencias/{grupoId}/exportar`.
2.  **Extracción de Datos**: El **ReporteService** obtiene las métricas del repositorio mediante una proyección optimizada (`getMetricasPorGrupo`).
3.  **Generación de Archivo**: El servicio procesa los datos y genera un arreglo de bytes (`byte[]`) que representa el archivo (CSV o PDF).
4.  **Respuesta**: El controlador devuelve un código **200 OK** con la cabecera `Content-Disposition: attachment` para forzar la descarga en el navegador.
