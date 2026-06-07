# Explicación del Diseño: Crear Usuario

Este diagrama de secuencia ilustra el diseño técnico para el registro de un nuevo usuario, enfatizando la validación y la persistencia de datos.

## Componentes Técnicos

- **Frontend (React)**: Captura los datos del formulario y realiza la petición POST.
- **UsuarioController**: Gestiona la creación mediante el endpoint REST correspondiente.
- **UsuarioService**: Valida los datos recibidos y coordina la persistencia.
- **UsuarioRepository**: Realiza la inserción física del nuevo registro.

## Flujo de Implementación

1.  **Petición HTTP**: El Frontend envía un `POST /api/usuarios` con el cuerpo del usuario.
2.  **Validación**: El **UsuarioService** procesa el `registrarUsuario(usuarioDTO)`.
3.  **Gestión de Errores**:
    -   **400 Bad Request**: Si los datos son inválidos (ej. formato de email incorrecto), se lanza una `ValidationException` y se devuelve un error 400.
4.  **Persistencia Exitosa**:
    -   **201 Created**: Si los datos son correctos, se guarda el usuario en el repositorio (`save`) y se devuelve el **UsuarioDTO** creado con un código 201.
