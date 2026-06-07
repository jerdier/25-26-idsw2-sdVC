# Explicación del Diagrama: Registrar Toma de Asistencia

Este diagrama de análisis describe el proceso de registro de asistencia de los alumnos durante una clase.

## Componentes Principales

- **SesionActiva (:SESION_CLASE_ACTIVA)**: Sesión de clase donde se está pasando lista.
- **RegistrarAsistenciaView**: Interfaz donde el profesor marca la presencia o ausencia de los alumnos.
- **AsistenciaController**: Controlador que procesa el listado de asistencia.
- **AlumnoRepository**: Valida que los alumnos marcados estén correctamente inscritos.
- **AsistenciaRepository**: Repositorio donde se guardan los registros de asistencia definitivos.
- **TomaConcluida (:TOMA_ASISTENCIA_CONCLUIDA)**: Estado final tras guardar la asistencia.
- **CompletarGestion (:Collaboration CompletarGestion)**: Cierre del proceso.

## Flujo de Trabajo

1.  **Toma de Datos**: El profesor abre la vista de registro desde la sesión activa.
2.  **Procesamiento**: La vista **RegistrarAsistenciaView** envía el listado al **AsistenciaController** (`procesarListadoPresentes`).
3.  **Validación**: El controlador verifica las inscripciones en el **AlumnoRepository** (`verificarInscripcionesValidas`).
4.  **Registro**: El controlador guarda las marcas de asistencia en el **AsistenciaRepository** (`registrarMarquesAsistencia`).
5.  **Finalización**:
    -   **Éxito**: Se alcanza el estado **TomaConcluida**.
    -   **Cancelación/Error**: Se activa **CompletarGestion**.
