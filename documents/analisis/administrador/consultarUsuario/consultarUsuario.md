# Explicación del Diagrama: Consultar Usuario

Este diagrama de análisis describe el proceso de consulta de la información de un usuario en el sistema.

## Componentes Principales

- **PanelAdmin (:PANEL_ADMINISTRACION)**: El punto de entrada desde donde el administrador inicia la acción de consultar un usuario.
- **ConsultarUsuarioView**: La interfaz de usuario encargada de capturar el criterio de búsqueda y mostrar los resultados.
- **UsuarioController**: El controlador que gestiona la lógica de negocio para la búsqueda de usuarios.
- **UsuarioRepository**: El repositorio encargado del acceso a datos para recuperar la información del usuario.
- **DetalleMostrado (:DETALLE_USUARIO_MOSTRADO)**: El estado o vista final donde se visualizan los datos del usuario si la búsqueda tiene éxito.
- **CompletarGestion (:Collaboration CompletarGestion)**: Una colaboración que maneja la finalización del flujo en caso de cancelación o error.

## Flujo de Trabajo

1.  **Inicio**: El proceso comienza cuando el administrador selecciona la opción `consultarUsuario()` en el **PanelAdmin**.
2.  **Búsqueda**: La vista **ConsultarUsuarioView** solicita al **UsuarioController** la búsqueda mediante el método `buscarUsuario(criterio)`.
3.  **Acceso a Datos**: El controlador utiliza el **UsuarioRepository** para obtener la información específica con `obtenerUsuarioPorId(id)`.
4.  **Resultados**:
    -   **Éxito**: Si el usuario es encontrado, se incluye la visualización de los datos en **DetalleMostrado**.
    -   **Cancelación/Error**: Si ocurre un error o el usuario cancela la operación, se redirige a la colaboración **CompletarGestion**.
