# Explicación del Diagrama: Consultar Solicitud de Dispensa (Secretaría)

Este diagrama describe el proceso para que secretaría visualice el catálogo total de dispensas tramitadas en el sistema.

## Componentes Principales

- **PanelSecretaria (:PANEL_SECRETARIA)**: Interfaz de gestión de trámites.
- **ConsultarDispensasView**: Vista que lista el historial completo de dispensas.
- **DispensaController**: Controlador que gestiona la obtención del catálogo total.
- **SolicitudDispensaRepository**: Repositorio que accede a todas las solicitudes de dispensa.
- **HistorialDispensas (:HISTORIAL_DISPENSAS_MOSTRADO)**: Estado donde se presenta el histórico de trámites.
- **CompletarGestion (:Collaboration CompletarGestion)**: Salida del proceso.

## Flujo de Trabajo

1.  **Inicio**: Se selecciona la consulta de dispensas desde el panel principal.
2.  **Petición**: La vista solicita el listado al **DispensaController** (`listarTodasLasDispensas()`).
3.  **Consulta**: El controlador obtiene los datos del **SolicitudDispensaRepository** (`obtenerCatalogoTotalDispensas()`).
4.  **Finalización**:
    -   **Éxito**: Se muestra el **HistorialDispensas**.
    -   **Cancelación/Error**: Se activa **CompletarGestion**.
