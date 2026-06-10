# ExplicaciÃ³n del DiseÃ±o: Exportar Dispensas

Este diagrama de secuencia detalla el flujo tÃ©cnico para la generaciÃ³n de reportes filtrados de dispensas en formato Excel.

## Componentes TÃ©cnicos

- **Frontend (Vue)**: Proporciona los filtros de bÃºsqueda e inicia la descarga.
- **ReporteController**: Punto de entrada para la exportaciÃ³n de datos de dispensas.
- **ReporteService**: Capa de negocio que aplica filtros dinÃ¡micos y estructura el archivo.
- **DispensaRepository**: Proporciona los registros basados en especificaciones de filtrado.

## Flujo de ImplementaciÃ³n

1.  **PeticiÃ³n HTTP**: El Frontend ejecuta un `GET /api/reportes/dispensas/exportar` con parÃ¡metros de filtro.
2.  **Filtrado DinÃ¡mico**: El **ReporteService** utiliza una `Specification` en el repositorio para obtener los registros filtrados (`findAll(specification)`).
3.  **GeneraciÃ³n de Archivo**: El servicio genera el flujo de bytes (`byte[]`) correspondiente al archivo Excel.
4.  **Respuesta**: El controlador devuelve un cÃ³digo **200 OK** con la cabecera de adjunto para descarga.

