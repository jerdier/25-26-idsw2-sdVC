# CGU > consultarUsuario > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/consultarUsuario/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** Administrador

---

## información del artefacto

| Campo | Valor |
|-------|-------|
| **Proyecto** | CGU - Centro de Gestión Universitaria |
| **Disciplina** | Análisis y Diseño |

---

## diagrama de secuencia

![secuencia](../../../images/diseño/consultarUsuario/secuencia.svg)

> fuente: [secuencia.puml](../../../modelosUML/diseño/consultarUsuario/secuencia.puml)

---

## clases de diseño identificadas

### frontend (Vue 3)

| Clase | Responsabilidad |
|-------|----------------|
| `AdminDashboard.vue` | Presenta el buscador de usuarios, muestra la lista de resultados y el detalle del usuario seleccionado |

### backend (Express + TypeScript)

| Clase | Responsabilidad |
|-------|----------------|
| `UsuarioController` | Recibe las peticiones HTTP de búsqueda y detalle, delega en el servicio |
| `UsuarioService` | Busca en todas las tablas de roles (Alumno, Profesor, DirectorDeGrado, SecretariaAcademica) por email o nombre |

### base de datos (PostgreSQL)

| Tabla | Responsabilidad |
|-------|----------------|
| `Alumno / Profesor / DirectorDeGrado / SecretariaAcademica` | Fuentes de datos de usuarios según rol; se consultan en paralelo mediante UNION o búsqueda multi-tabla |

---

## flujo de secuencia

1. El Administrador introduce un filtro (nombre o email) en `AdminDashboard.vue`.
2. El frontend llama `GET /api/usuarios?filtro=...` al `UsuarioController`.
3. `UsuarioController` → `UsuarioService.getUsuarios(filtro)`.
4. `UsuarioService` ejecuta `SELECT ... UNION` sobre todas las tablas de roles filtrando por nombre o email.
5. La base de datos devuelve `usuarios : Usuario[]`; el frontend muestra la lista de coincidencias.
6. El Administrador selecciona un usuario de la lista.
7. El frontend llama `GET /api/usuarios/:id` al `UsuarioController`.
8. `UsuarioService` ejecuta `SELECT * FROM [tabla_rol] WHERE id = ?` y devuelve el detalle completo.
9. El frontend muestra el detalle del usuario seleccionado.

---

## referencias

- [Índice de diseño](../README.md)
- [Análisis de este caso](../../analisis/consultarUsuario/README.md)
- [Modelo del dominio](../../requisitado/00-modelo-del-dominio/README.md)
- [secuencia.puml](../../../modelosUML/diseño/consultarUsuario/secuencia.puml)
