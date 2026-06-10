# ExplicaciÃ³n del DiseÃ±o: Crear Usuario

Este diagrama de secuencia ilustra el diseÃ±o tÃ©cnico para el registro de un nuevo usuario, enfatizando la validaciÃ³n y la persistencia de datos.

## Componentes TÃ©cnicos

- **Frontend (Vue)**: Captura los datos del formulario y realiza la peticiÃ³n POST.
- **UsuarioController**: Gestiona la creaciÃ³n mediante el endpoint REST correspondiente.
- **UsuarioService**: Valida los datos recibidos y coordina la persistencia.
- **UsuarioRepository**: Realiza la inserciÃ³n fÃ­sica del nuevo registro.

## Flujo de ImplementaciÃ³n

1.  **PeticiÃ³n HTTP**: El Frontend envÃ­a un `POST /api/usuarios` con el cuerpo del usuario.
2.  **ValidaciÃ³n**: El **UsuarioService** procesa el `registrarUsuario(usuarioDTO)`.
3.  **GestiÃ³n de Errores**:
    -   **400 Bad Request**: Si los datos son invÃ¡lidos (ej. formato de email incorrecto), se lanza una `ValidationException` y se devuelve un error 400.
4.  **Persistencia Exitosa**:
    -   **201 Created**: Si los datos son correctos, se guarda el usuario en el repositorio (`save`) y se devuelve el **UsuarioDTO** creado con un cÃ³digo 201.

