# Análisis > Profesor > Registrar Toma de Asistencia

## Información del Artefacto
- **Proyecto**: CGU (Centro de Gestión Universitaria)
- **Fase**: Análisis
- **Caso de Uso**: Registrar Toma de Asistencia
- **Autor**: Equipo de desarrollo

## Propósito
Identificar las clases de análisis y colaboraciones necesarias para que un Profesor pueda registrar la asistencia de los alumnos en una sesión de clase activa.

## Clases de Análisis Identificadas

### Clases Model (Entidades y Repositorios)
| Clase | Responsabilidad | Trazabilidad |
|-------|-----------------|--------------|
| **Alumno** | Representa al estudiante matriculado. | Diagrama de Clases (CGU) |
| **SesionDeClase** | Sesión académica específica donde se toma asistencia. | Diagrama de Clases (CGU) |
| **Asistencia** | Registro de la presencia de un alumno en una sesión. | Diagrama de Clases (CGU) |
| **AsistenciaRepository** | Gestión de persistencia de registros de asistencia. | Análisis MVC-A |

### Clases View
| Clase | Responsabilidad |
|-------|-----------------|
| **AsistenciaView** | Interfaz que muestra el listado de alumnos y permite marcar la asistencia. |

### Clases Controller
| Clase | Responsabilidad |
|-------|-----------------|
| **AsistenciaController** | Coordina la lógica de recuperación de alumnos y guardado de asistencia. |

## Mensajes de Colaboración (Flujo de Análisis)
1. **Profesor** solicita `mostrarListadoAlumnos(sesionId)` a **AsistenciaView**.
2. **AsistenciaView** delega en **AsistenciaController** para `obtenerListaAlumnos(sesionId)`.
3. **AsistenciaController** consulta a **AsistenciaRepository** (o AlumnoRepository) para obtener los alumnos matriculados en la asignatura de la sesión.
4. **AsistenciaController** devuelve la lista a **AsistenciaView**.
5. **Profesor** marca asistencia y solicita `guardarAsistencia(datosAsistencia)`.
6. **AsistenciaView** envía los cambios a **AsistenciaController**.
7. **AsistenciaController** valida y solicita a **AsistenciaRepository** `actualizarAsistencia(asistencia)`.
8. **AsistenciaRepository** persiste la entidad **Asistencia**.

## Trazabilidad con Diagramas UML (CGU)
- Se basa en el **Diagrama de Estados: Asistencia**, donde la sesión pasa a estado de "Proceso de Toma de Asistencia".
- Las entidades coinciden con el **Diagrama de Clases** global.
