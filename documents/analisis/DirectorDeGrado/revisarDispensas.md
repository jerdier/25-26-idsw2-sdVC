# Análisis > Director de Grado > Revisar y Validar Dispensas

## Información del Artefacto
- **Proyecto**: CGU (Centro de Gestión Universitaria)
- **Fase**: Análisis
- **Caso de Uso**: Revisar y Validar Dispensas
- **Autor**: Equipo de desarrollo

## Propósito
Analizar la lógica de aprobación o rechazo de dispensas por parte de la autoridad académica, asegurando la trazabilidad del cambio de estado según el modelo de dominio.

## Clases de Análisis Identificadas

### Clases Model (Entidades y Repositorios)
| Clase | Responsabilidad | Trazabilidad |
|-------|-----------------|--------------|
| **Dispensa** | Entidad cuyo estado será modificado (Aprobada/Rechazada). | Diagrama de Estados (CGU) |
| **DirectorDeGrado** | Entidad que ejerce la autoridad sobre el trámite. | Diagrama de Clases (CGU) |
| **DispensaRepository** | Persistencia de los cambios de estado. | Análisis MVC-A |

### Clases View
| Clase | Responsabilidad |
|-------|-----------------|
| **RevisionDispensaView** | Interfaz para que el director visualice detalles y decida sobre el trámite. |

### Clases Controller
| Clase | Responsabilidad |
|-------|-----------------|
| **GestionarRevisionController** | Coordina la validación de la decisión y la actualización del estado. |

## Mensajes de Colaboración (Flujo de Análisis)
1. **Director** solicita `listaDispensasPendientes()` a **RevisionDispensaView**.
2. **RevisionDispensaView** solicita a **GestionarRevisionController** los trámites que requieren atención.
3. **GestionarRevisionController** consulta al **DispensaRepository** por entidades en estado `PENDIENTE`.
4. **Director** selecciona una dispensa y decide `aprobar()` o `rechazar()`.
5. **RevisionDispensaView** envía la decisión al **GestionarRevisionController**.
6. **GestionarRevisionController** actualiza el estado de la entidad **Dispensa** y registra al **DirectorDeGrado** responsable.
7. **GestionarRevisionController** solicita a **DispensaRepository** `guardarCambios(dispensa)`.

## Trazabilidad con Diagramas UML (CGU)
- Basado en las transiciones `Solicitada -> Aprobada/Rechazada` del **Diagrama de Estados: Dispensa**.
- Utiliza la relación `Dispensa --> DirectorDeGrado` del modelo relacional.
