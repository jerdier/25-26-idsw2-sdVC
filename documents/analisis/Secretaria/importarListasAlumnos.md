# Análisis > Secretaria > Importar Listas de Alumnos

## Información del Artefacto
- **Proyecto**: CGU (Centro de Gestión Universitaria)
- **Fase**: Análisis
- **Caso de Uso**: Importar Listas de Alumnos
- **Autor**: Equipo de desarrollo

## Propósito
Identificar las clases de análisis y colaboraciones necesarias para que la Secretaria pueda cargar masivamente alumnos al sistema desde archivos externos.

## Clases de Análisis Identificadas

### Clases Model (Entidades y Repositorios)
| Clase | Responsabilidad | Trazabilidad |
|-------|-----------------|--------------|
| **Alumno** | Entidad a crear masivamente. | Diagrama de Clases (CGU) |
| **Grado** | Entidad de destino para la matriculación. | Diagrama de Clases (CGU) |
| **Matricula** | Relación que se crea tras la importación exitosa. | Diagrama de Clases (CGU) |
| **AlumnoRepository** | Persistencia de múltiples entidades Alumno. | Análisis MVC-A |

### Clases View
| Clase | Responsabilidad |
|-------|-----------------|
| **ImportacionView** | Panel para seleccionar archivos y visualizar progreso de carga. |

### Clases Controller
| Clase | Responsabilidad |
|-------|-----------------|
| **ImportacionController** | Orquesta el parseo del archivo y la creación de entidades. |

## Mensajes de Colaboración (Flujo de Análisis)
1. **Secretaria** selecciona archivo y solicita `importar(archivo)` a **ImportacionView**.
2. **ImportacionView** envía el flujo de datos a **ImportacionController**.
3. **ImportacionController** valida el formato y parsea los datos en objetos **Alumno**.
4. **ImportacionController** solicita a **AlumnoRepository** `guardarLote(alumnos)`.
5. **ImportacionController** genera registros de **Matricula** asociados.
6. **ImportacionView** muestra resumen de éxito/error.

## Trazabilidad con Diagramas UML (CGU)
- Se basa en la relación `SecretariaAcademica --> Matricula` del **Diagrama de Clases**.
- El flujo de eventos sigue la especificación detallada del caso de uso en `CGU`.
