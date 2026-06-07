# Explicación del Diseño: Consultar Lista Alumnos

Este diagrama ilustra la implementación técnica de la consulta de alumnos inscritos en un grupo específico por parte del profesor.

## Componentes Técnicos

- **Frontend (React)**: Interfaz que muestra la lista y realiza la petición al backend.
- **GrupoController**: Controlador REST que gestiona las peticiones relacionadas con grupos de alumnos.
- **GrupoService**: Capa de negocio que procesa el listado por grupo.
- **AlumnoRepository**: Repositorio para la consulta de alumnos por su ID de grupo.

## Flujo de Implementación

1.  **Petición HTTP**: El Frontend realiza un `GET /api/grupos/{grupoId}/alumnos`.
2.  **Lógica de Servicio**: El controlador delega en `listarAlumnosPorGrupo(grupoId)` del **GrupoService**.
3.  **Consulta**: El servicio solicita al repositorio la lista de alumnos (`findByGrupoId`).
4.  **Respuesta**: Se retorna una lista de **AlumnoDTO** con un código **200 OK**.
