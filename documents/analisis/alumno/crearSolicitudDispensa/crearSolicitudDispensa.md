# Explicación del Diagrama: Crear Solicitud de Dispensa

Este diagrama detalla el proceso mediante el cual un alumno registra una nueva solicitud de dispensa académica.

## Componentes Principales

- **PanelAlumno (:PANEL_ALUMNO)**: Interfaz inicial del alumno para comenzar nuevos trámites.
- **CrearDispensaView**: Formulario donde el alumno introduce los datos y motivos de su solicitud de dispensa.
- **DispensaController**: Controlador que gestiona la lógica de creación, incluyendo validaciones previas.
- **AlumnoRepository**: Repositorio utilizado para validar que el alumno cumple con los requisitos (ej. matrícula activa).
- **SolicitudDispensaRepository**: Repositorio donde se almacena finalmente la nueva solicitud.
- **SolicitudRegistrada (:SOLICITUD_DISPENSA_REGISTRADA)**: Estado que confirma que la solicitud ha sido creada correctamente en el sistema.
- **CompletarGestion (:Collaboration CompletarGestion)**: Colaboración para finalizar el proceso de forma segura.

## Flujo de Trabajo

1.  **Inicio**: El alumno selecciona la opción de `crearSolicitudDispensa()` en el **PanelAlumno**.
2.  **Registro y Validación**: La vista **CrearDispensaView** envía los datos al **DispensaController** mediante `registrarSolicitud(datosDispensa, alumnoId)`.
3.  **Verificación**: El controlador verifica el estado del alumno a través del **AlumnoRepository** con `validarEstadoMatricula(alumnoId)`.
4.  **Almacenamiento**: Si la validación es positiva, el controlador guarda la solicitud usando el **SolicitudDispensaRepository** (`guardarSolicitud(solicitud)`).
5.  **Finalización**:
    -   **Éxito**: Se alcanza el estado de **SolicitudRegistrada**.
    -   **Cancelación/Error**: Se activa el flujo de **CompletarGestion**.
