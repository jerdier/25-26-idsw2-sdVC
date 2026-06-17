# CGU > consultarUsuario > Análisis

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Índice Análisis](../README.md) | **Análisis** | [Diseño](../../diseño/consultarUsuario/README.md) |
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

![colaboracion](../../../images/analisis/consultarUsuario/colaboracion.svg)

> fuente: [colaboracion.puml](../../../modelosUML/analisis/consultarUsuario/colaboracion.puml)

---

## clases de análisis identificadas

### clases de vista (boundary)

| Clase | Responsabilidad |
|-------|----------------|
| `ConsultarUsuarioView` | Muestra el buscador de usuarios y el detalle del usuario seleccionado |

### clases de control

| Clase | Responsabilidad |
|-------|----------------|
| `UsuarioController` | Ejecuta la búsqueda por filtro y recupera el detalle de un usuario concreto |

### clases de entidad (entity)

| Clase | Responsabilidad |
|-------|----------------|
| `UsuarioRepository` | Consulta usuarios por filtro y por id en la base de datos |
| `Usuario` | Entidad de dominio con nombre, email, password y rol |

---

## flujo de colaboración

1. El Administrador accede desde `:Panel Admin Abierto` → se abre `ConsultarUsuarioView`.
2. `ConsultarUsuarioView` → `UsuarioController.buscarUsuarios(filtro)` → `UsuarioRepository.buscarPorFiltro(filtro)` → devuelve `List<Usuario>`.
3. El Administrador selecciona un usuario → `ConsultarUsuarioView` → `UsuarioController.obtenerUsuario(id)` → `UsuarioRepository.obtenerPorId(id)` → devuelve `Usuario`.

---

## referencias

- [Índice de análisis](../README.md)
- [Diseño de este caso](../../diseño/consultarUsuario/README.md)
- [Modelo del dominio](../../requisitado/00-modelo-del-dominio/README.md)
- [colaboracion.puml](../../../modelosUML/analisis/consultarUsuario/colaboracion.puml)
