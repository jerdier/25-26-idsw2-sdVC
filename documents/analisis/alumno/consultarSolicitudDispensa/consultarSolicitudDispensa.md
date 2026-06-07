# Explicación del Diagrama: Consultar Solicitud de Dispensa

Este diagrama de análisis describe cómo un alumno puede visualizar el historial y los detalles de sus solicitudes de dispensa.

## Componentes Principales

- **PanelAlumno (:PANEL_ALUMNO)**: El punto de partida desde donde el alumno accede a sus trámites académicos.
- **ConsultarDispensaView**: Interfaz de usuario que muestra la lista de solicitudes y permite ver el detalle de una específica.
- **DispensaController**: Controlador que coordina la recuperación de la información de las dispensas.
- **SolicitudDispensaRepository**: Repositorio encargado de realizar las consultas a la base de datos sobre las solicitudes de dispensa.
- **SolicitudDetallada (:SOLICITUD_DISPENSA_DETALLADA)**: Estado o vista final que presenta toda la información detallada de una solicitud seleccionada.
- **CompletarGestion (:Collaboration CompletarGestion)**: Colaboración para manejar la salida del flujo en caso de error o cancelación.

## Flujo de Trabajo

1.  **Navegación**: El alumno inicia la consulta desde el **PanelAlumno** llamando a `consultarSolicitudDispensa()`.
2.  **Solicitud de Datos**: La vista **ConsultarDispensaView** solicita al **DispensaController** el historial mediante `obtenerHistorialDispensas(alumnoId)`.
3.  **Consulta**: El controlador delega en el **SolicitudDispensaRepository** la búsqueda con `buscarPorAlumno(alumnoId)`.
4.  **Resultados**:
    -   **Éxito**: Se muestra la información en **SolicitudDetallada**.
    -   **Cancelación/Error**: Se redirige a **CompletarGestion**.
