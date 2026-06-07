# Explicación del Diagrama: Consultar Detalle de Alumno

Este diagrama describe cómo un profesor puede acceder a la ficha detallada de un alumno, incluyendo su historial de asistencias.

## Componentes Principales

- **ListaMostrada (:LISTA_ALUMNOS_MOSTRADA)**: Punto de partida donde el profesor ve la lista de alumnos del grupo.
- **DetalleAlumnoView**: Interfaz que presenta la información exhaustiva del alumno seleccionado.
- **AlumnoController**: Controlador que coordina la recopilación de datos del alumno.
- **AlumnoRepository**: Accede a los datos personales y académicos del alumno.
- **AsistenciaRepository**: Repositorio utilizado para calcular métricas de asistencia.
- **HistorialDetallado (:HISTORIAL_ALUMNO_DETALLADO)**: Estado final donde se muestra la ficha completa.
- **CompletarGestion (:Collaboration CompletarGestion)**: Manejo de errores o salida del flujo.

## Flujo de Trabajo

1.  **Selección**: El profesor elige un alumno de la **ListaMostrada** invocando `consultarDetalleAlumno()`.
2.  **Recopilación**: La vista **DetalleAlumnoView** solicita al **AlumnoController** la ficha completa (`obtenerFichaCompleta(alumnoId)`).
3.  **Procesamiento**: El controlador obtiene los datos personales del **AlumnoRepository** (`buscarDatosPersonales`) y el porcentaje de asistencia del **AsistenciaRepository** (`calcularPorcentajeAsistencias`).
4.  **Visualización**:
    -   **Éxito**: Se presenta el **HistorialDetallado**.
    -   **Cancelación/Error**: Se activa **CompletarGestion**.
