# Explicación del Diseño: Consultar Lista Alumnos (Secretaría)

Este diagrama describe el flujo técnico para obtener el catálogo global de alumnos desde el perfil de secretaría.

## Componentes Técnicos

- **Frontend (React)**: Solicita el listado global para su visualización en una tabla administrativa.
- **AlumnoController**: Controlador REST encargado de la gestión global de alumnos.
- **AlumnoService**: Capa de negocio que recupera la lista completa.
- **AlumnoRepository**: Interfaz de persistencia para obtener todos los registros.

## Flujo de Implementación

1.  **Petición HTTP**: El Frontend ejecuta un `GET /api/alumnos/global`.
2.  **Lógica de Servicio**: El controlador delega en `listarTodosLosAlumnos()` del **AlumnoService**.
3.  **Consulta Masiva**: El servicio utiliza `findAll()` del repositorio para recuperar todas las entidades.
4.  **Respuesta**: Se devuelve una lista de **AlumnoDTO** con un código **200 OK**.
