# Explicación del Diseño: Exportar Dispensas

Este diagrama de secuencia detalla el flujo técnico para la generación de reportes filtrados de dispensas en formato Excel.

## Componentes Técnicos

- **Frontend (React)**: Proporciona los filtros de búsqueda e inicia la descarga.
- **ReporteController**: Punto de entrada para la exportación de datos de dispensas.
- **ReporteService**: Capa de negocio que aplica filtros dinámicos y estructura el archivo.
- **DispensaRepository**: Proporciona los registros basados en especificaciones de filtrado.

## Flujo de Implementación

1.  **Petición HTTP**: El Frontend ejecuta un `GET /api/reportes/dispensas/exportar` con parámetros de filtro.
2.  **Filtrado Dinámico**: El **ReporteService** utiliza una `Specification` en el repositorio para obtener los registros filtrados (`findAll(specification)`).
3.  **Generación de Archivo**: El servicio genera el flujo de bytes (`byte[]`) correspondiente al archivo Excel.
4.  **Respuesta**: El controlador devuelve un código **200 OK** con la cabecera de adjunto para descarga.
