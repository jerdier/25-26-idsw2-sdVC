# Explicación del Diseño: Consultar Detalle Matrícula

Este diagrama de secuencia detalla la implementación técnica del proceso de búsqueda y visualización de la matrícula de un alumno por parte de secretaría.

## Componentes Técnicos

- **Secretaría (Actor)**: Usuario administrativo que realiza la búsqueda.
- **Frontend (React)**: Interfaz que captura el ID del alumno y realiza la petición.
- **MatriculaController**: Endpoint REST para la gestión de matrículas.
- **MatriculaService**: Capa de negocio que recupera la información de matrícula.
- **MatriculaRepository**: Repositorio JPA para el acceso a la tabla de matrículas.

## Flujo de Implementación

1.  **Petición HTTP**: El Frontend realiza un `GET /api/matriculas/{alumnoId}`.
2.  **Lógica de Servicio**: El controlador llama a `obtenerMatricula(alumnoId)` del **MatriculaService**.
3.  **Consulta**: El servicio solicita la entidad al repositorio mediante `findByAlumnoId`.
4.  **Respuesta**: El sistema devuelve un objeto **MatriculaDTO** con un código **200 OK**.
