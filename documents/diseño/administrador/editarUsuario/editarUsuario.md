# ExplicaciÃ³n del DiseÃ±o: Editar Usuario

Este diagrama de secuencia describe el flujo tÃ©cnico para la actualizaciÃ³n de la informaciÃ³n de un usuario existente.

## Componentes TÃ©cnicos

- **Frontend (Vue)**: EnvÃ­a los cambios realizados por el administrador a travÃ©s de una peticiÃ³n PUT.
- **UsuarioController**: Punto de entrada para la actualizaciÃ³n de recursos.
- **UsuarioService**: Gestiona la lÃ³gica de bÃºsqueda previa y actualizaciÃ³n posterior.
- **UsuarioRepository**: Gestiona tanto la bÃºsqueda como el guardado de los cambios.

## Flujo de ImplementaciÃ³n

1.  **PeticiÃ³n HTTP**: Se realiza un `PUT /api/usuarios/{id}` con los nuevos datos.
2.  **VerificaciÃ³n de Existencia**: El **UsuarioService** primero busca al usuario mediante `findById(id)`.
3.  **Escenarios de Respuesta**:
    -   **404 Not Found**: Si el usuario que se intenta editar no existe en el sistema.
    -   **200 OK**: Si el usuario existe, el servicio actualiza sus campos, llama a `save` en el repositorio y devuelve el objeto actualizado con un cÃ³digo 200.

