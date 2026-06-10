# ExplicaciÃ³n del DiseÃ±o: Consultar Lista Alumnos

Este diagrama ilustra la implementaciÃ³n tÃ©cnica de la consulta de alumnos inscritos en un grupo especÃ­fico por parte del profesor.

## Componentes TÃ©cnicos

- **Frontend (Vue)**: Interfaz que muestra la lista y realiza la peticiÃ³n al backend.
- **GrupoController**: Controlador REST que gestiona las peticiones relacionadas con grupos de alumnos.
- **GrupoService**: Capa de negocio que procesa el listado por grupo.
- **AlumnoRepository**: Repositorio para la consulta de alumnos por su ID de grupo.

## Flujo de ImplementaciÃ³n

1.  **PeticiÃ³n HTTP**: El Frontend realiza un `GET /api/grupos/{grupoId}/alumnos`.
2.  **LÃ³gica de Servicio**: El controlador delega en `listarAlumnosPorGrupo(grupoId)` del **GrupoService**.
3.  **Consulta**: El servicio solicita al repositorio la lista de alumnos (`findByGrupoId`).
4.  **Respuesta**: Se retorna una lista de **AlumnoDTO** con un cÃ³digo **200 OK**.

