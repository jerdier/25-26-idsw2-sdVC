# Explicación del Diagrama: Consultar Solicitud de Dispensa (Director de Grado)

Este diagrama de análisis describe el proceso mediante el cual el Director de Grado visualiza las solicitudes de dispensa que requieren su atención.

## Componentes Principales

- **PanelDirector (:PANEL_DIRECTOR)**: Interfaz principal desde donde el director accede a la gestión de dispensas.
- **ConsultarDispensaView**: Vista que lista las solicitudes pendientes de revisión.
- **DispensaController**: Controlador que gestiona la lógica de filtrado y obtención de solicitudes.
- **SolicitudDispensaRepository**: Repositorio que accede a la base de datos para recuperar solicitudes por su estado.
- **SolicitudRevisada (:SOLICITUD_DISPENSA_REVISADA)**: Estado que indica que el director ha seleccionado una solicitud para su revisión detallada.
- **CompletarGestion (:Collaboration CompletarGestion)**: Colaboración para manejar el fin del flujo en caso de error o salida voluntaria.

## Flujo de Trabajo

1.  **Acceso**: El director inicia el proceso desde el **PanelDirector** llamando a `consultarSolicitudDispensa()`.
2.  **Filtrado**: La vista **ConsultarDispensaView** solicita al **DispensaController** la lista de solicitudes mediante `listarSolicitudesPendientes()`.
3.  **Consulta**: El controlador solicita al **SolicitudDispensaRepository** específicamente las solicitudes con estado "PENDIENTE" (`buscarPorEstado("PENDIENTE")`).
4.  **Selección**:
    -   **Éxito**: El director selecciona una solicitud, pasando al estado de **SolicitudRevisada**.
    -   **Cancelación/Error**: Se activa **CompletarGestion**.
