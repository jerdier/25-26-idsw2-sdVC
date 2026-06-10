# ExplicaciÃ³n del DiseÃ±o: Consultar Lista Alumnos (SecretarÃ­a)

Este diagrama describe el flujo tÃ©cnico para obtener el catÃ¡logo global de alumnos desde el perfil de secretarÃ­a.

## Componentes TÃ©cnicos

- **Frontend (Vue)**: Solicita el listado global para su visualizaciÃ³n en una tabla administrativa.
- **AlumnoController**: Controlador REST encargado de la gestiÃ³n global de alumnos.
- **AlumnoService**: Capa de negocio que recupera la lista completa.
- **AlumnoRepository**: Interfaz de persistencia para obtener todos los registros.

## Flujo de ImplementaciÃ³n

1.  **PeticiÃ³n HTTP**: El Frontend ejecuta un `GET /api/alumnos/global`.
2.  **LÃ³gica de Servicio**: El controlador delega en `listarTodosLosAlumnos()` del **AlumnoService**.
3.  **Consulta Masiva**: El servicio utiliza `findAll()` del repositorio para recuperar todas las entidades.
4.  **Respuesta**: Se devuelve una lista de **AlumnoDTO** con un cÃ³digo **200 OK**.

