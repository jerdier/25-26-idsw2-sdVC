# CGU > editarUsuario > Análisis

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Índice Análisis](../README.md) | **Análisis** | [Diseño](../../diseño/editarUsuario/README.md) |
> |---|---|---|---|---|

**Actor:** Administrador

Permite al Administrador modificar los datos de un usuario existente: nombres, apellidos, correo electrónico, rol y estado de la cuenta. El sistema precarga los datos actuales antes de habilitar la edición.


---

## Diagrama de colaboración

| ![colaboracion](../../../images/analisis/editarUsuario/colaboracion.svg) |
| :--- |
| [colaboracion.puml](../../../modelosUML/analisis/editarUsuario/colaboracion.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| EditarUsuarioView | Vista |
| UsuarioController | Controlador |
| UsuarioRepository | Modelo |
| Usuario | Modelo |

---

## Flujo de colaboración

1. El Administrador solicita editar un usuario → se activa `EditarUsuarioView`
2. `EditarUsuarioView` solicita a `UsuarioController` los datos actuales mediante `obtenerUsuario(usuarioId)` para precargar el formulario
3. `UsuarioController` consulta `UsuarioRepository.findById(usuarioId)` para recuperar el usuario
4. `UsuarioRepository` accede a `Usuario` y retorna los datos al controlador
5. El Administrador modifica los campos y confirma → `EditarUsuarioView` invoca `UsuarioController.editarUsuario(usuarioId, nombres, apellidos, correo, rol, estado)`
6. `UsuarioController` ordena a `UsuarioRepository` persistir los cambios invocando `update(usuarioId, datos)`
