# Análisis > Secretaria > Gestionar Matrículas

## Información del Artefacto
- **Proyecto**: CGU (Centro de Gestión Universitaria)
- **Fase**: Análisis
- **Caso de Uso**: Gestionar Matrículas
- **Autor**: Equipo de desarrollo

## Propósito
Analizar el proceso de vinculación entre alumnos, grados y secretaría, garantizando que el registro de matrícula sea la base para la asistencia y los trámites de dispensa.

## Clases de Análisis Identificadas

### Clases Model (Entidades y Repositorios)
| Clase | Responsabilidad | Trazabilidad |
|-------|-----------------|--------------|
| **Matricula** | Entidad relacional que formaliza la inscripción. | Diagrama de Clases (CGU) |
| **Alumno** | Entidad que recibe la matrícula. | Diagrama de Clases (CGU) |
| **Grado** | Programa académico de destino. | Diagrama de Clases (CGU) |
| **MatriculaRepository** | Gestión de persistencia de inscripciones. | Análisis MVC-A |

### Clases View
| Clase | Responsabilidad |
|-------|-----------------|
| **RegistroMatriculaView** | Formulario para la gestión individual o por lotes de matrículas. |

### Clases Controller
| Clase | Responsabilidad |
|-------|-----------------|
| **MatriculacionController** | Coordina la validación de requisitos y la creación de la matrícula. |

## Mensajes de Colaboración (Flujo de Análisis)
1. **Secretaria** solicita `matricularAlumno(alumnoId, gradoId)` a **RegistroMatriculaView**.
2. **RegistroMatriculaView** delega en **MatriculacionController**.
3. **MatriculacionController** valida la existencia del **Alumno** y la capacidad del **Grado**.
4. **MatriculacionController** crea la entidad **Matricula** con la fecha actual y el responsable.
5. **MatriculacionController** solicita a **MatriculaRepository** `guardar(matricula)`.
6. **MatriculaRepository** persiste la relación.

## Trazabilidad con Diagramas UML (CGU)
- Basado en el **Diagrama de Clases**, específicamente en la asociación triple entre `Alumno`, `Grado` y `SecretariaAcademica`.
- Sincronizado con el **Diagrama de Estados: Matricula** (Activa/Inactiva).
