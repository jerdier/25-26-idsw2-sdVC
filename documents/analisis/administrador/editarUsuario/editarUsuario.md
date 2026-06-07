# Explicación del Diagrama: Editar Usuario

Este diagrama ilustra el procedimiento para modificar la información de un usuario existente en el sistema.

## Componentes Principales

- **DetalleMostrado (:DETALLE_USUARIO_MOSTRADO)**: El punto de partida, donde el administrador está viendo los detalles del usuario y decide editarlos.
- **EditarUsuarioView**: Interfaz que permite la edición de los campos del perfil del usuario.
- **UsuarioController**: Gestiona la lógica de actualización y validación de los cambios realizados.
- **UsuarioRepository**: Realiza la actualización efectiva de los datos en el sistema de persistencia.
- **UsuarioModificado (:USUARIO_MODIFICADO)**: Estado que representa la confirmación de que los cambios han sido guardados correctamente.
- **CompletarGestion (:Collaboration CompletarGestion)**: Colaboración que gestiona el cierre del proceso en caso de que no se complete la edición satisfactoriamente.

## Flujo de Trabajo

1.  **Edición**: Desde el **DetalleMostrado**, se inicia el proceso llamando a `editarUsuario()` en la vista **EditarUsuarioView**.
2.  **Modificación**: La vista envía la solicitud de cambio al **UsuarioController** con `modificarUsuario(id, nuevosDatos)`.
3.  **Actualización**: El controlador se comunica con el **UsuarioRepository** para ejecutar `actualizarDatosUsuario(usuario)`.
4.  **Resultado**:
    -   **Éxito**: Si la actualización es correcta, se transita al estado **UsuarioModificado**.
    -   **Cancelación/Error**: Si hay errores o el usuario desiste de los cambios, se invoca `completarGestion()`.
