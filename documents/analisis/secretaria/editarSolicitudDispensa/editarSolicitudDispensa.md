# Explicación del Diagrama: Editar Solicitud de Dispensa (Secretaría)

Este diagrama describe el proceso de rectificación de errores en una solicitud de dispensa por parte de secretaría.

## Componentes Principales

- **HistorialDispensas (:HISTORIAL_DISPENSAS_MOSTRADO)**: Punto de partida tras localizar la dispensa a editar.
- **EditarDispensaView**: Interfaz para corregir los campos necesarios.
- **DispensaController**: Controlador que gestiona la corrección de datos.
- **SolicitudDispensaRepository**: Repositorio que actualiza el registro en la base de datos.
- **DispensaRectificada (:DISPENSA_RECTIFICADA)**: Estado que confirma que los cambios se han guardado.
- **CompletarGestion (:Collaboration CompletarGestion)**: Salida del flujo.

## Flujo de Trabajo

1.  **Edición**: Desde el historial, secretaría selecciona editar una solicitud.
2.  **Corrección**: La vista **EditarDispensaView** envía los nuevos datos al **DispensaController** (`corregirDatosDispensa`).
3.  **Actualización**: El controlador delega en el **SolicitudDispensaRepository** la actualización (`actualizarDatosDispensa`).
4.  **Resultado**:
    -   **Éxito**: Se alcanza el estado **DispensaRectificada**.
    -   **Cancelación/Error**: Se activa **CompletarGestion**.
