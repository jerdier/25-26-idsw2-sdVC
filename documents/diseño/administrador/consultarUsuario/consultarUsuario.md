# ExplicaciÃ³n del DiseÃ±o: Consultar Usuario

Este diagrama de secuencia detalla la implementaciÃ³n tÃ©cnica del proceso de consulta de un usuario, mostrando la interacciÃ³n entre las diferentes capas del sistema.

## Componentes TÃ©cnicos

- **Administrador (Actor)**: Inicia la solicitud de visualizaciÃ³n.
- **Frontend (Vue)**: Componente de la interfaz que realiza la llamada asÃ­ncrona a la API.
- **UsuarioController**: Punto de entrada de la API REST que gestiona las peticiones HTTP.
- **UsuarioService**: Capa de lÃ³gica de negocio que valida la existencia del usuario.
- **UsuarioRepository**: Interfaz de persistencia para la consulta en la base de datos.

## Flujo de ImplementaciÃ³n

1.  **PeticiÃ³n HTTP**: El Frontend realiza una peticiÃ³n `GET /api/usuarios/{id}`.
2.  **LÃ³gica de Servicio**: El controlador delega en `obtenerUsuario(id)` del **UsuarioService**.
3.  **Persistencia**: El servicio utiliza `findById(id)` del repositorio.
4.  **GestiÃ³n de Respuestas**:
    -   **404 Not Found**: Si el usuario no existe, se lanza una `NotFoundException` que el controlador traduce a un cÃ³digo de error 404.
    -   **200 OK**: Si el usuario existe, se devuelve un objeto **UsuarioDTO** con un cÃ³digo 200.

