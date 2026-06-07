# Explicación del Diseño: Consultar Solicitud de Dispensa (Alumno)

Este diagrama de secuencia describe la implementación técnica del proceso mediante el cual un alumno consulta sus solicitudes de dispensa.

## Componentes Técnicos

- **Alumno (Actor)**: Inicia la consulta desde su panel personal.
- **Frontend (React)**: Realiza la llamada asíncrona a la API para obtener el listado.
- **DispensaController**: Endpoint REST que recibe la petición de consulta por alumno.
- **DispensaService**: Lógica de negocio para filtrar y procesar las dispensas del alumno.
- **DispensaRepository**: Repositorio JPA/Base de datos para la búsqueda por ID de alumno.

## Flujo de Implementación

1.  **Petición HTTP**: El Frontend ejecuta un `GET /api/dispensas/alumno/{alumnoId}`.
2.  **Lógica de Servicio**: El controlador delega en `obtenerDispensasPorAlumno(alumnoId)` del **DispensaService**.
3.  **Consulta a Base de Datos**: El servicio utiliza `findByAlumnoId(alumnoId)` del repositorio para obtener la lista de entidades.
4.  **Respuesta**: El sistema devuelve un código **200 OK** junto con una lista de objetos **DispensaDTO**.
