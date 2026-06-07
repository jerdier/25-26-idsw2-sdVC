# Explicación del Diagrama: Consultar Lista de Alumnos

Este diagrama de análisis detalla el proceso para que un profesor visualice los alumnos inscritos en una asignatura y grupo específicos.

## Componentes Principales

- **PanelProfesor (:PANEL_PROFESOR)**: Interfaz principal del profesor.
- **ListaAlumnosView**: Vista encargada de mostrar el listado de alumnos filtrado.
- **GrupoController**: Controlador que gestiona la lógica de búsqueda por grupos y asignaturas.
- **AlumnoRepository**: Repositorio para filtrar y obtener los alumnos correspondientes.
- **ListaMostrada (:LISTA_ALUMNOS_MOSTRADA)**: Estado donde se presentan los alumnos encontrados.
- **CompletarGestion (:Collaboration CompletarGestion)**: Manejo de la finalización del proceso.

## Flujo de Trabajo

1.  **Solicitud**: El profesor inicia la consulta desde el **PanelProfesor**.
2.  **Filtrado**: La vista **ListaAlumnosView** pide al **GrupoController** la lista mediante `buscarAlumnosPorAsignatura(asignaturaId, grupoId)`.
3.  **Búsqueda**: El controlador delega en el **AlumnoRepository** para `filtrarPorGrupoYAsignatura`.
4.  **Resultado**:
    -   **Éxito**: Se alcanza el estado **ListaMostrada**.
    -   **Cancelación/Error**: Se activa **CompletarGestion**.
