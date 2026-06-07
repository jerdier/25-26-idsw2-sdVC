# Explicación del Diagrama: Editar Sesión de Clase

Este diagrama describe cómo un profesor puede modificar los parámetros de una sesión de clase que ya está activa.

## Componentes Principales

- **SesionActiva (:SESION_CLASE_ACTIVA)**: Estado de la sesión que se desea modificar.
- **EditarSesionView**: Interfaz para cambiar datos como el aula o la duración prevista.
- **SesionClaseController**: Controlador que procesa los ajustes de la sesión.
- **SesionClaseRepository**: Repositorio que actualiza los datos modificados.
- **SesionModificada (:SESION_CLASE_MODIFICADA)**: Estado que confirma la actualización.
- **CompletarGestion (:Collaboration CompletarGestion)**: Manejo de cierre.

## Flujo de Trabajo

1.  **Edición**: Desde la sesión activa, el profesor elige editar sus parámetros.
2.  **Ajuste**: La vista **EditarSesionView** envía los nuevos datos al **SesionClaseController** (`reajustarParametrosSesion`).
3.  **Actualización**: El controlador delega en el **SesionClaseRepository** la actualización (`actualizarDatosSesion`).
4.  **Resultado**:
    -   **Éxito**: Se alcanza el estado **SesionModificada**.
    -   **Cancelación/Error**: Se activa **CompletarGestion**.
