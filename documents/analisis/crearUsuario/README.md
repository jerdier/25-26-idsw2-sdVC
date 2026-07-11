# CGU > crearUsuario > Análisis

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Índice Análisis](../README.md) | **Análisis** | [Diseño](../../diseño/crearUsuario/README.md) | [Desarrollo](../../desarrollo/crearUsuario/README.md) |
> |---|---|---|---|---|---|

**Actor:** Administrador

Permite al Administrador registrar un nuevo usuario en el sistema indicando nombres, apellidos, DNI o pasaporte, correo electrónico y rol. El sistema crea el usuario y lo deja disponible para su gestión posterior.


---

## Diagrama de colaboración

| ![colaboracion](../../../images/analisis/crearUsuario/colaboracion.svg) |
| :--- |
| [colaboracion.puml](../../../modelosUML/analisis/crearUsuario/colaboracion.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| CrearUsuarioView | Vista |
| UsuarioController | Controlador |
| UsuarioRepository | Modelo |
| Usuario | Modelo |

---

## Flujo de colaboración

1. El Administrador solicita crear un nuevo usuario → se activa `CrearUsuarioView`
2. El Administrador completa el formulario y confirma → `CrearUsuarioView` invoca `UsuarioController.crearUsuario(nombres, apellidos, dni, correo, rol)`
3. `UsuarioController` ordena a `UsuarioRepository` persistir el nuevo usuario invocando `create(nombres, apellidos, dni, correo, rol)`
4. `UsuarioRepository` crea el nuevo registro en la entidad `Usuario`
