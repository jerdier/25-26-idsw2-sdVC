# Análisis > Administrador > Gestionar Usuarios y Roles

## Información del Artefacto
- **Proyecto**: CGU (Centro de Gestión Universitaria)
- **Fase**: Análisis
- **Caso de Uso**: Gestionar Usuarios y Roles
- **Autor**: Equipo de desarrollo

## Propósito
Analizar la administración de identidades en el sistema, asegurando que cada actor (Profesor, Secretaria, etc.) posea las credenciales y perfiles necesarios para operar.

## Clases de Análisis Identificadas

### Clases Model (Entidades y Repositorios)
| Clase | Responsabilidad | Trazabilidad |
|-------|-----------------|--------------|
| **SecretariaAcademica** | Entidad de usuario administrativo. | Diagrama de Clases (CGU) |
| **Profesor** | Entidad de usuario docente. | Diagrama de Clases (CGU) |
| **DirectorDeGrado** | Entidad de usuario con permisos de aprobación. | Diagrama de Clases (CGU) |
| **UsuarioRepository** | Abstracción para la gestión de credenciales y roles. | Análisis MVC-A |

### Clases View
| Clase | Responsabilidad |
|-------|-----------------|
| **GestionUsuariosView** | Panel central de administración de cuentas y permisos. |

### Clases Controller
| Clase | Responsabilidad |
|-------|-----------------|
| **AdminCuentasController** | Orquesta la creación, edición y asignación de roles. |

## Mensajes de Colaboración (Flujo de Análisis)
1. **Administrador** solicita `crearNuevoUsuario(datos)` a **GestionUsuariosView**.
2. **GestionUsuariosView** delega en **AdminCuentasController**.
3. **AdminCuentasController** valida la unicidad de datos y selecciona la entidad correspondiente (ej. **Profesor**).
4. **AdminCuentasController** solicita a **UsuarioRepository** (o repositorio específico) `crear(entidad)`.
5. **UsuarioRepository** persiste la información básica y roles.
6. **GestionUsuariosView** confirma la creación.

## Trazabilidad con Diagramas UML (CGU)
- Se basa en la jerarquía de actores y la estructura de "Identidad y Acceso" del **Diagrama de Clases**.
- El flujo sigue las transiciones de los diagramas detallados del Administrador.
