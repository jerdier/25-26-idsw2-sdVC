# Explicación del Diseño: Consultar Usuario

Este diagrama de secuencia detalla la implementación técnica del proceso de consulta de un usuario, mostrando la interacción entre las diferentes capas del sistema.

## Componentes Técnicos

- **Administrador (Actor)**: Inicia la solicitud de visualización.
- **Frontend (React)**: Componente de la interfaz que realiza la llamada asíncrona a la API.
- **UsuarioController**: Punto de entrada de la API REST que gestiona las peticiones HTTP.
- **UsuarioService**: Capa de lógica de negocio que valida la existencia del usuario.
- **UsuarioRepository**: Interfaz de persistencia para la consulta en la base de datos.

## Flujo de Implementación

1.  **Petición HTTP**: El Frontend realiza una petición `GET /api/usuarios/{id}`.
2.  **Lógica de Servicio**: El controlador delega en `obtenerUsuario(id)` del **UsuarioService**.
3.  **Persistencia**: El servicio utiliza `findById(id)` del repositorio.
4.  **Gestión de Respuestas**:
    -   **404 Not Found**: Si el usuario no existe, se lanza una `NotFoundException` que el controlador traduce a un código de error 404.
    -   **200 OK**: Si el usuario existe, se devuelve un objeto **UsuarioDTO** con un código 200.
