# ExplicaciÃ³n del DiseÃ±o: Consultar Detalle Alumno

Este diagrama de secuencia describe el flujo tÃ©cnico para que un profesor consulte la ficha detallada de un alumno, incluyendo su historial acadÃ©mico.

## Componentes TÃ©cnicos

- **Frontend (Vue)**: Componente que solicita los detalles del alumno al servidor.
- **AlumnoController**: Endpoint REST encargado de la gestiÃ³n de informaciÃ³n de alumnos.
- **AlumnoService**: Capa de negocio que agrega la informaciÃ³n necesaria para el detalle.
- **AlumnoRepository**: Repositorio que realiza una consulta proyectada para obtener todos los campos requeridos.

## Flujo de ImplementaciÃ³n

1.  **PeticiÃ³n HTTP**: El Frontend ejecuta un `GET /api/alumnos/{id}/detalle`.
2.  **LÃ³gica de Servicio**: El controlador llama a `obtenerFichaCompleta(id)` en el **AlumnoService**.
3.  **ProyecciÃ³n de Datos**: El servicio utiliza un mÃ©todo optimizado del repositorio (`findDetalleCompletoById`) para obtener una proyecciÃ³n de los datos.
4.  **Respuesta**: Se devuelve un objeto **AlumnoDetalleDTO** con un cÃ³digo de respuesta **200 OK**.

