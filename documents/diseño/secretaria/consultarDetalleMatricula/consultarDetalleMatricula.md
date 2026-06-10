# ExplicaciÃ³n del DiseÃ±o: Consultar Detalle MatrÃ­cula

Este diagrama de secuencia detalla la implementaciÃ³n tÃ©cnica del proceso de bÃºsqueda y visualizaciÃ³n de la matrÃ­cula de un alumno por parte de secretarÃ­a.

## Componentes TÃ©cnicos

- **SecretarÃ­a (Actor)**: Usuario administrativo que realiza la bÃºsqueda.
- **Frontend (Vue)**: Interfaz que captura el ID del alumno y realiza la peticiÃ³n.
- **MatriculaController**: Endpoint REST para la gestiÃ³n de matrÃ­culas.
- **MatriculaService**: Capa de negocio que recupera la informaciÃ³n de matrÃ­cula.
- **MatriculaRepository**: Repositorio JPA para el acceso a la tabla de matrÃ­culas.

## Flujo de ImplementaciÃ³n

1.  **PeticiÃ³n HTTP**: El Frontend realiza un `GET /api/matriculas/{alumnoId}`.
2.  **LÃ³gica de Servicio**: El controlador llama a `obtenerMatricula(alumnoId)` del **MatriculaService**.
3.  **Consulta**: El servicio solicita la entidad al repositorio mediante `findByAlumnoId`.
4.  **Respuesta**: El sistema devuelve un objeto **MatriculaDTO** con un cÃ³digo **200 OK**.

