# CGU > editarUsuario > Análisis

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Índice Análisis](../README.md) | **Análisis** | [Diseño](../../diseño/editarUsuario/README.md) |
> |---|---|---|---|---|

**Actor:** Administrador

---

## información del artefacto

| Campo | Valor |
|-------|-------|
| **Proyecto** | CGU - Centro de Gestión Universitaria |
| **Disciplina** | Análisis y Diseño |

---


## diagrama de colaboración

![colaboracion](../../../images/analisis/editarUsuario/colaboracion.svg)

> fuente: [colaboracion.puml](../../../modelosUML/analisis/editarUsuario/colaboracion.puml)

---

## clases de análisis identificadas

### clases de vista (boundary)

| Clase | Responsabilidad |
|-------|----------------|
| `EditarUsuarioView` | Formulario de edición precargado con los datos actuales del usuario |

### clases de control

| Clase | Responsabilidad |
|-------|----------------|
| `UsuarioController` | Recupera el usuario a editar, valida los nuevos datos y orquesta la actualización |

### clases de entidad (entity)

| Clase | Responsabilidad |
|-------|----------------|
| `UsuarioRepository` | Obtiene el usuario por id, verifica unicidad de email y persiste los cambios |
| `Usuario` | Entidad de dominio con nombre, email, password y rol |

---

## flujo de colaboración

1. El Administrador accede desde `:Panel Admin Abierto` → se abre `EditarUsuarioView`.
2. `EditarUsuarioView` → `UsuarioController.obtenerUsuario(id)` → `UsuarioRepository.obtenerPorId(id)` → devuelve `Usuario` para precargar el formulario.
3. `EditarUsuarioView` → `UsuarioController.validarDatos(nombre, email, rol)` → `UsuarioRepository.verificarUnicidad(email, id)`.
4. Si los datos son válidos, `EditarUsuarioView` → `UsuarioController.editarUsuario(id, nombre, email, rol)` → `UsuarioRepository.actualizar(...)` → devuelve `Usuario` actualizado.

---

## referencias

- [Índice de análisis](../README.md)
- [Diseño de este caso](../../diseño/editarUsuario/README.md)
- [Modelo del dominio](../../requisitado/00-modelo-del-dominio/README.md)
- [colaboracion.puml](../../../modelosUML/analisis/editarUsuario/colaboracion.puml)
