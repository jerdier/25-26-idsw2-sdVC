# Explicación del Diagrama: Consultar Solicitud de Dispensa (Profesor)

Este diagrama describe cómo un profesor puede consultar las dispensas aprobadas que afectan a sus clases para justificar ausencias.

## Componentes Principales

- **PanelProfesor (:PANEL_PROFESOR)**: Punto de entrada para el profesor.
- **ConsultarDispensasView**: Vista que lista las dispensas aplicables a los alumnos del profesor.
- **DispensaController**: Controlador que gestiona la obtención de dispensas relevantes para el profesor.
- **SolicitudDispensaRepository**: Repositorio que busca dispensas aprobadas en el sistema.
- **DispensasListadas (:DISPENSAS_GRUPO_LISTADAS)**: Estado final donde se muestran las dispensas que afectan a sus grupos.
- **CompletarGestion (:Collaboration CompletarGestion)**: Manejo de salida o errores.

## Flujo de Trabajo

1.  **Inicio**: El profesor selecciona la consulta de dispensas desde su panel.
2.  **Petición**: La vista **ConsultarDispensasView** solicita al **DispensaController** las dispensas que afectan a sus clases (`obtenerDispensasAfectanClase(profesorId)`).
3.  **Consulta**: El controlador busca en el **SolicitudDispensaRepository** las solicitudes ya aprobadas (`buscarAprobadasPorProfesor(profesorId)`).
4.  **Visualización**:
    -   **Éxito**: Se presentan las **DispensasListadas**.
    -   **Cancelación/Error**: Se activa **CompletarGestion**.
