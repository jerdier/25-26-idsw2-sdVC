# CGU > abrirUsuarios > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/abrirUsuarios/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** Administrador

El Frontend (Vue 3) solicita el listado de usuarios al controlador Express, que los recupera de PostgreSQL mediante Prisma. Soporta filtrado por nombre y correo mediante parámetros de query.

---

## Diagrama de secuencia

| ![secuencia](../../../images/diseño/abrirUsuarios/secuencia.svg) |
| :--- |
| [secuencia.puml](../../../modelosUML/diseño/abrirUsuarios/secuencia.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| Frontend (Vue 3) | Vista |
| UsuarioController | Controlador |
| UsuarioService | Servicio |
| Base de Datos (PostgreSQL) | Base de Datos |
| Usuario | Modelo |

---

## Flujo de secuencia

1. El Administrador accede al módulo de usuarios en el Frontend
2. Frontend → `GET /api/admin/usuarios` → `UsuarioController.getUsuarios()`
3. `UsuarioService` consulta: `SELECT * FROM Usuario`
4. Frontend muestra la lista de usuarios (nombre, apellidos, rol, estado)
