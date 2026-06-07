# Explicación del Diseño: Editar Usuario

Este diagrama de secuencia describe el flujo técnico para la actualización de la información de un usuario existente.

## Componentes Técnicos

- **Frontend (React)**: Envía los cambios realizados por el administrador a través de una petición PUT.
- **UsuarioController**: Punto de entrada para la actualización de recursos.
- **UsuarioService**: Gestiona la lógica de búsqueda previa y actualización posterior.
- **UsuarioRepository**: Gestiona tanto la búsqueda como el guardado de los cambios.

## Flujo de Implementación

1.  **Petición HTTP**: Se realiza un `PUT /api/usuarios/{id}` con los nuevos datos.
2.  **Verificación de Existencia**: El **UsuarioService** primero busca al usuario mediante `findById(id)`.
3.  **Escenarios de Respuesta**:
    -   **404 Not Found**: Si el usuario que se intenta editar no existe en el sistema.
    -   **200 OK**: Si el usuario existe, el servicio actualiza sus campos, llama a `save` en el repositorio y devuelve el objeto actualizado con un código 200.
