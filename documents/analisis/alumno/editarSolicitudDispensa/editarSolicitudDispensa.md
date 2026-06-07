# Explicación del Diagrama: Editar Solicitud de Dispensa

Este diagrama de análisis ilustra el flujo para que un alumno pueda modificar una solicitud de dispensa que aún no ha sido procesada o permite correcciones.

## Componentes Principales

- **SolicitudDetallada (:SOLICITUD_DISPENSA_DETALLADA)**: Punto de partida donde el alumno visualiza su solicitud y elige la opción de editar.
- **EditarDispensaView**: Interfaz que permite la modificación de los campos permitidos en la solicitud.
- **DispensaController**: Gestiona la lógica de actualización de la solicitud.
- **SolicitudDispensaRepository**: Repositorio que ejecuta la actualización de los datos en el sistema.
- **SolicitudActualizada (:SOLICITUD_DISPENSA_ACTUALIZADA)**: Estado que confirma que los cambios han sido guardados con éxito.
- **CompletarGestion (:Collaboration CompletarGestion)**: Colaboración para el cierre del flujo.

## Flujo de Trabajo

1.  **Acceso**: Desde la vista de **SolicitudDetallada**, se activa `editarSolicitudDispensa()`.
2.  **Envío de Cambios**: La vista **EditarDispensaView** traslada las modificaciones al **DispensaController** mediante `actualizarSolicitud(solicitudId, nuevosCampos)`.
3.  **Persistencia**: El controlador actualiza el registro a través del **SolicitudDispensaRepository** con `actualizarDatosDispensa(solicitud)`.
4.  **Resultado**:
    -   **Éxito**: Se confirma la actualización mediante el estado **SolicitudActualizada**.
    -   **Cancelación/Error**: Se redirige a **CompletarGestion** si la operación no se completa.
