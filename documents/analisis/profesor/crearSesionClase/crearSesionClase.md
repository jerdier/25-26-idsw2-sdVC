# Explicación del Diagrama: Crear Sesión de Clase

Este diagrama ilustra el flujo para que un profesor inicie una nueva sesión de clase.

## Componentes Principales

- **PanelProfesor (:PANEL_PROFESOR)**: Interfaz desde donde se abre una nueva clase.
- **CrearSesionView**: Formulario para introducir datos de la clase (asignatura, aula, duración).
- **SesionClaseController**: Controlador que gestiona la apertura de la sesión.
- **SesionClaseRepository**: Repositorio que registra el inicio de la sesión en el sistema.
- **SesionActiva (:SESION_CLASE_ACTIVA)**: Estado resultante indicando que la clase ha comenzado.
- **CompletarGestion (:Collaboration CompletarGestion)**: Gestión del fin del proceso.

## Flujo de Trabajo

1.  **Apertura**: El profesor inicia `crearSesionClase()` desde el panel.
2.  **Registro**: La vista **CrearSesionView** envía los datos al **SesionClaseController** mediante `aperturarNuevaSesion(...)`.
3.  **Persistencia**: El controlador registra la sesión en el **SesionClaseRepository** (`registrarInicioSesion`).
4.  **Finalización**:
    -   **Éxito**: La clase queda en estado **SesionActiva**.
    -   **Cancelación/Error**: Se activa **CompletarGestion**.
