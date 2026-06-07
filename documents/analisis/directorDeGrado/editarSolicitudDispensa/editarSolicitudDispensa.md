# Explicación del Diagrama: Editar Solicitud de Dispensa (Director de Grado)

Este diagrama ilustra la fase final del proceso de dispensa, donde el Director de Grado evalúa y resuelve una solicitud.

## Componentes Principales

- **SolicitudRevisada (:SOLICITUD_DISPENSA_REVISADA)**: El punto de partida donde la solicitud ya ha sido abierta y está siendo analizada.
- **EditarSolicitudView**: Interfaz que permite al director introducir la resolución (Aceptada/Denegada) y añadir comentarios explicativos.
- **DispensaController**: Controlador que procesa la decisión del director.
- **SolicitudDispensaRepository**: Repositorio que actualiza el estado y la resolución final en la base de datos.
- **SolicitudEvaluada (:SOLICITUD_DISPENSA_EVALUADA)**: Estado final que confirma que la solicitud ha sido resuelta.
- **CompletarGestion (:Collaboration CompletarGestion)**: Colaboración para el cierre del proceso.

## Flujo de Trabajo

1.  **Evaluación**: Desde el estado de **SolicitudRevisada**, se abre la vista **EditarSolicitudView** mediante `editarSolicitud()`.
2.  **Resolución**: El director introduce la decisión y la envía al **DispensaController** a través de `resolverSolicitud(solicitudId, resolucion, comentario)`.
3.  **Actualización**: El controlador delega en el **SolicitudDispensaRepository** la actualización del registro con `cambiarEstadoYResolucion(solicitud)`.
4.  **Resultado Final**:
    -   **Éxito**: La solicitud queda en estado **SolicitudEvaluada**.
    -   **Cancelación/Error**: Se invoca **CompletarGestion** si no se completa la resolución.
