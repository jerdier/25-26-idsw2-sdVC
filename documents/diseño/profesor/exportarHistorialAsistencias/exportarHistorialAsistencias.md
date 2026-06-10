# ExplicaciÃ³n del DiseÃ±o: Exportar Asistencias

Este diagrama de secuencia ilustra el flujo tÃ©cnico para la generaciÃ³n y descarga de reportes de asistencia en formato binario.

## Componentes TÃ©cnicos

- **Frontend (Vue)**: Inicia la descarga del reporte.
- **ReporteController**: Punto de entrada para la generaciÃ³n de documentos.
- **ReporteService**: Capa de negocio que estructura el reporte y genera el flujo de datos.
- **AsistenciaRepository**: Proporciona las mÃ©tricas y datos crudos de asistencia.

## Flujo de ImplementaciÃ³n

1.  **PeticiÃ³n HTTP**: El Frontend ejecuta un `GET /api/reportes/asistencias/{grupoId}/exportar`.
2.  **ExtracciÃ³n de Datos**: El **ReporteService** obtiene las mÃ©tricas del repositorio mediante una proyecciÃ³n optimizada (`getMetricasPorGrupo`).
3.  **GeneraciÃ³n de Archivo**: El servicio procesa los datos y genera un arreglo de bytes (`byte[]`) que representa el archivo (CSV o PDF).
4.  **Respuesta**: El controlador devuelve un cÃ³digo **200 OK** con la cabecera `Content-Disposition: attachment` para forzar la descarga en el navegador.

