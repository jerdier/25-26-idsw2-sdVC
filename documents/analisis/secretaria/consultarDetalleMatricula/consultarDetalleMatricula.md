# Explicación del Diagrama: Consultar Detalle de Matrícula

Este diagrama de análisis describe el proceso por el cual el personal de secretaría verifica el estado de matriculación de un alumno específico.

## Componentes Principales

- **PanelSecretaria (:PANEL_SECRETARIA)**: Interfaz de inicio para las gestiones de secretaría.
- **MatriculaView**: Vista encargada de mostrar la información de matrícula.
- **MatriculaController**: Controlador que gestiona la lógica de recuperación de datos de matrícula.
- **MatriculaRepository**: Repositorio que accede a los registros detallados de matrícula.
- **DetalleMatricula (:DETALLE_MATRICULA_MOSTRADO)**: Estado final donde se visualiza la matrícula completa.
- **CompletarGestion (:Collaboration CompletarGestion)**: Manejo de la salida del flujo.

## Flujo de Trabajo

1.  **Solicitud**: Desde el **PanelSecretaria**, se inicia la consulta.
2.  **Petición**: La vista **MatriculaView** solicita el estado al **MatriculaController** (`obtenerEstadoMatricula(alumnoId)`).
3.  **Búsqueda**: El controlador utiliza el **MatriculaRepository** para `buscarRegistroCompleto(alumnoId)`.
4.  **Resultado**:
    -   **Éxito**: Se presenta el **DetalleMatricula**.
    -   **Cancelación/Error**: Se activa **CompletarGestion**.
