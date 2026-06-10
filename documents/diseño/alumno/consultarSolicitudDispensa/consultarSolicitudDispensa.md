# ExplicaciÃ³n del DiseÃ±o: Consultar Solicitud de Dispensa (Alumno)

Este diagrama de secuencia describe la implementaciÃ³n tÃ©cnica del proceso mediante el cual un alumno consulta sus solicitudes de dispensa.

## Componentes TÃ©cnicos

- **Alumno (Actor)**: Inicia la consulta desde su panel personal.
- **Frontend (Vue)**: Realiza la llamada asÃ­ncrona a la API para obtener el listado.
- **DispensaController**: Endpoint REST que recibe la peticiÃ³n de consulta por alumno.
- **DispensaService**: LÃ³gica de negocio para filtrar y procesar las dispensas del alumno.
- **DispensaRepository**: Repositorio JPA/Base de datos para la bÃºsqueda por ID de alumno.

## Flujo de ImplementaciÃ³n

1.  **PeticiÃ³n HTTP**: El Frontend ejecuta un `GET /api/dispensas/alumno/{alumnoId}`.
2.  **LÃ³gica de Servicio**: El controlador delega en `obtenerDispensasPorAlumno(alumnoId)` del **DispensaService**.
3.  **Consulta a Base de Datos**: El servicio utiliza `findByAlumnoId(alumnoId)` del repositorio para obtener la lista de entidades.
4.  **Respuesta**: El sistema devuelve un cÃ³digo **200 OK** junto con una lista de objetos **DispensaDTO**.

