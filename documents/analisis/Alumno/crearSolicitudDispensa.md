# Análisis > Alumno > Crear Solicitud de Dispensa

## Información del Artefacto
- **Proyecto**: CGU (Centro de Gestión Universitaria)
- **Fase**: Análisis
- **Caso de Uso**: Crear Solicitud de Dispensa
- **Autor**: Equipo de desarrollo

## Propósito
Identificar las clases de análisis y colaboraciones necesarias para que un Alumno pueda solicitar una dispensa de asistencia por motivos justificados.

## Clases de Análisis Identificadas

### Clases Model (Entidades y Repositorios)
| Clase | Responsabilidad | Trazabilidad |
|-------|-----------------|--------------|
| **Dispensa** | Entidad que contiene motivo, estado y sesiones eximidas. | Diagrama de Clases (CGU) |
| **Alumno** | Entidad que solicita la dispensa. | Diagrama de Clases (CGU) |
| **SesionDeClase** | Sesión o sesiones de las cuales se solicita exención. | Diagrama de Clases (CGU) |
| **DispensaRepository** | Gestión de persistencia de solicitudes de dispensa. | Análisis MVC-A |

### Clases View
| Clase | Responsabilidad |
|-------|-----------------|
| **FormularioDispensaView** | Interfaz para el ingreso de datos de la solicitud y adjuntos. |

### Clases Controller
| Clase | Responsabilidad |
|-------|-----------------|
| **GestionarDispensaController** | Coordina la creación, edición y validación de la solicitud. |

## Mensajes de Colaboración (Flujo de Análisis)
1. **Alumno** solicita `crearSolicitudDispensa()` a **FormularioDispensaView**.
2. **FormularioDispensaView** solicita a **GestionarDispensaController** inicializar nueva solicitud.
3. **GestionarDispensaController** solicita a **Alumno** y **Asignatura** datos para pre-poblar el formulario.
4. **Alumno** introduce `motivo` y `adjuntarDocumento()` en **FormularioDispensaView**.
5. **Alumno** solicita `guardarSolicitudDispensa()` a **FormularioDispensaView**.
6. **FormularioDispensaView** delega en **GestionarDispensaController** el registro persistente.
7. **GestionarDispensaController** crea la entidad **Dispensa** con estado `PENDIENTE`.
8. **GestionarDispensaController** solicita a **DispensaRepository** `guardar(dispensa)`.

## Trazabilidad con Diagramas UML (CGU)
- Basado en el **Diagrama de Estados: Dispensa** (Transición inicial: Solicitada).
- Utiliza la relación `Alumno --> Dispensa` definida en el **Diagrama de Clases**.
