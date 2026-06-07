# Explicación del Diagrama: Cerrar Sesión de Clase

Este diagrama de análisis describe el proceso mediante el cual un profesor finaliza una sesión de clase que estaba activa.

## Componentes Principales

- **SesionActiva (:SESION_CLASE_ACTIVA)**: El estado inicial donde la clase está en curso.
- **CerrarSesionView**: Interfaz que permite al profesor confirmar la finalización de la sesión.
- **SesionClaseController**: Controlador que gestiona la lógica de cierre de la sesión.
- **SesionClaseRepository**: Repositorio que actualiza el estado de la sesión en la base de datos.
- **SesionCerrada (:SESION_CLASE_CERRADA)**: Estado final que confirma que la sesión ha sido concluida.
- **CompletarGestion (:Collaboration CompletarGestion)**: Colaboración para manejar el fin del flujo en caso de cancelación o error.

## Flujo de Trabajo

1.  **Inicio**: El profesor solicita cerrar la clase desde el estado **SesionActiva**.
2.  **Confirmación**: La vista **CerrarSesionView** envía la orden al **SesionClaseController** mediante `finalizarSesion(sesionId)`.
3.  **Actualización**: El controlador utiliza el **SesionClaseRepository** para ejecutar `actualizarEstadoCierre(sesionId)`.
4.  **Resultado**:
    -   **Éxito**: La sesión pasa al estado **SesionCerrada**.
    -   **Cancelación/Error**: Se activa **CompletarGestion**.
