# Explicación del Diagrama: Crear Usuario

Este diagrama de análisis detalla el flujo de trabajo para registrar un nuevo usuario en la plataforma.

## Componentes Principales

- **PanelAdmin (:PANEL_ADMINISTRACION)**: Interfaz principal desde la cual se dispara la creación de un nuevo usuario.
- **CrearUsuarioView**: Formulario o interfaz donde se introducen los datos del nuevo usuario.
- **UsuarioController**: Controlador que procesa la solicitud de registro y valida la información.
- **UsuarioRepository**: Componente de persistencia que guarda el nuevo registro en la base de datos.
- **UsuarioCreado (:USUARIO_CREADO)**: Estado que confirma la creación exitosa del usuario.
- **CompletarGestion (:Collaboration CompletarGestion)**: Colaboración encargada de finalizar el proceso, especialmente en escenarios de interrupción o fallo.

## Flujo de Trabajo

1.  **Activación**: Desde el **PanelAdmin**, se invoca la acción `crearUsuario()`.
2.  **Registro**: La vista **CrearUsuarioView** envía los datos capturados al **UsuarioController** mediante `registrarUsuario(datosUsuario)`.
3.  **Persistencia**: El controlador delega en el **UsuarioRepository** la tarea de almacenar la información con `guardarNuevoUsuario(usuario)`.
4.  **Finalización**:
    -   **Éxito**: Se confirma la operación mediante el estado **UsuarioCreado**.
    -   **Cancelación/Error**: En caso de problemas o cancelación por parte del usuario, se activa el flujo de **CompletarGestion**.
