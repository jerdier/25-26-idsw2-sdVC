# Explicación del Diagrama: Crear Solicitud de Dispensa (Secretaría)

Este diagrama ilustra el flujo para que secretaría registre una dispensa "de oficio" o institucional.

## Componentes Principales

- **PanelSecretaria (:PANEL_SECRETARIA)**: Inicio del trámite administrativo.
- **RegistrarDispensaView**: Formulario para introducir los datos de la dispensa de oficio.
- **DispensaController**: Controlador que gestiona la inyección de la solicitud.
- **SolicitudDispensaRepository**: Repositorio encargado de guardar la nueva solicitud.
- **DispensaInstitucional (:DISPENSA_INSTITUCIONAL_REGISTRADA)**: Estado que confirma el registro de la dispensa.
- **CompletarGestion (:Collaboration CompletarGestion)**: Manejo de cierre.

## Flujo de Trabajo

1.  **Registro**: Desde el panel, se inicia la creación de una dispensa.
2.  **Inyección**: La vista **RegistrarDispensaView** envía los datos al **DispensaController** (`inyectarSolicitudDeOficio(datosDispensa)`).
3.  **Persistencia**: El controlador guarda la solicitud a través del **SolicitudDispensaRepository** (`guardarSolicitud(solicitud)`).
4.  **Resultado**:
    -   **Éxito**: Se confirma mediante **DispensaInstitucional**.
    -   **Cancelación/Error**: Se activa **CompletarGestion**.
