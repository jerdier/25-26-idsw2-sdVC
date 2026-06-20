# CGU > crearUsuario > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/crearUsuario/README.md) | [Índice Diseño](../README.md) | **Diseño** |
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

![secuencia](../../../images/diseño/crearUsuario/secuencia.svg)

> fuente: [secuencia.puml](../../../modelosUML/diseño/crearUsuario/secuencia.puml)

---

## clases de diseño identificadas

### frontend (Vue 3)

| Clase | Responsabilidad |
|-------|----------------|
| `AdminDashboard.vue` | Presenta el formulario de creación de usuario y gestiona la respuesta del servidor |

### backend (Express + TypeScript)

| Clase | Responsabilidad |
|-------|----------------|
| `UsuarioController` | Recibe la petición HTTP y delega en el servicio |
| `UsuarioService` | Verifica la unicidad del email y persiste el nuevo usuario en la tabla correspondiente al rol |

### base de datos (PostgreSQL)

| Tabla | Responsabilidad |
|-------|----------------|
| `Alumno / Profesor / DirectorDeGrado / SecretariaAcademica` | Tabla destino según el rol seleccionado; almacena nombre, email y password |

---

## flujo de secuencia

1. El Administrador introduce los datos del nuevo usuario (nombre, email, password, rol) en `AdminDashboard.vue`.
2. El frontend llama `POST /api/admin/usuarios` con los datos al `UsuarioController`.
3. `UsuarioController` → `UsuarioService.createUsuario(nombre, email, password, rol)`.
4. `UsuarioService` consulta la base de datos (`SELECT WHERE email = ?`) para verificar que el email no está registrado.
5. **[Email no registrado]** `UsuarioService` ejecuta `INSERT INTO [tabla_rol]` → devuelve `usuarioCreado`.
6. `UsuarioController` responde `201 Created { usuarioCreado }` al frontend.
7. El frontend confirma la creación e inicia `<<include>> editarUsuario(usuarioNuevo)`.
8. **[Email ya registrado]** el servicio lanza error → `400 Bad Request` → el frontend muestra "Email ya en uso".

---

## referencias

- [Índice de diseño](../README.md)
- [Análisis de este caso](../../analisis/crearUsuario/README.md)
- [Modelo del dominio](../../requisitado/00-modelo-del-dominio/README.md)
- [secuencia.puml](../../../modelosUML/diseño/crearUsuario/secuencia.puml)
