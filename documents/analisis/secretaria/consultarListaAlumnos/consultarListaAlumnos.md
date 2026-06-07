# Explicación del Diagrama: Consultar Lista de Alumnos (Secretaría)

Este diagrama detalla cómo secretaría puede obtener un listado global de todos los alumnos registrados en el sistema.

## Componentes Principales

- **PanelSecretaria (:PANEL_SECRETARIA)**: Punto de entrada para la gestión de alumnos.
- **ListaAlumnosView**: Interfaz que presenta el listado completo de alumnos.
- **AlumnoController**: Controlador que coordina la recuperación del listado global.
- **AlumnoRepository**: Repositorio encargado de recuperar todos los registros de alumnos.
- **ListadoCompleto (:LISTADO_ALUMNOS_COMPLETO)**: Estado final que muestra todos los alumnos.
- **CompletarGestion (:Collaboration CompletarGestion)**: Manejo de cierre o errores.

## Flujo de Trabajo

1.  **Acceso**: El personal de secretaría solicita la lista desde su panel.
2.  **Consulta**: La vista **ListaAlumnosView** pide el listado al **AlumnoController** (`obtenerListadoGlobalAlumnos()`).
3.  **Recuperación**: El controlador delega en el **AlumnoRepository** para `recuperarTodosLosAlumnos()`.
4.  **Visualización**:
    -   **Éxito**: Se alcanza el estado **ListadoCompleto**.
    -   **Cancelación/Error**: Se activa **CompletarGestion**.
