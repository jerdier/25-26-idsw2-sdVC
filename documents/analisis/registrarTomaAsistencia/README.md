# CGU > registrarTomaAsistencia > Análisis

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Índice Análisis](../README.md) | **Análisis** | [Diseño](../../diseño/registrarTomaAsistencia/README.md) |
> |---|---|---|---|---|

**Actor:** Profesor

---

## información del artefacto

| Campo | Valor |
|-------|-------|
| **Proyecto** | CGU - Centro de Gestión Universitaria |
| **Disciplina** | Análisis y Diseño |

---


## diagrama de colaboración

![colaboracion](../../../images/analisis/registrarTomaAsistencia/colaboracion.svg)

> fuente: [colaboracion.puml](../../../modelosUML/analisis/registrarTomaAsistencia/colaboracion.puml)

---

## clases de análisis identificadas

### clases de vista (boundary)

| Clase | Responsabilidad |
|-------|----------------|
| `RegistrarTomaAsistenciaView` | Muestra la lista de alumnos de la sesión y permite marcar la presencia de cada uno |

### clases de control

| Clase | Responsabilidad |
|-------|----------------|
| `AsistenciaController` | Carga los alumnos de la sesión y persiste cada registro de asistencia mediante upsert |

### clases de entidad (entity)

| Clase | Responsabilidad |
|-------|----------------|
| `AlumnoRepository` | Recupera los alumnos matriculados en la sesión |
| `AsistenciaRepository` | Crea o actualiza el registro de asistencia de un alumno en una sesión |
| `Alumno` | Entidad de dominio con los datos del estudiante |
| `Asistencia` | Entidad de dominio con el registro de presencia por sesión y alumno |

---

## flujo de colaboración

1. `RegistrarTomaAsistenciaView` se activa por `<<include>>` desde `crearSesionClase(sesionId)`.
2. `RegistrarTomaAsistenciaView` → `AsistenciaController.cargarAlumnos(sesionId)` → `AlumnoRepository.obtenerPorSesion(sesionId)` → devuelve `List<Alumno>`.
3. El Profesor marca la presencia de cada alumno → `RegistrarTomaAsistenciaView` → `AsistenciaController.registrarAsistencia(sesionId, alumnoId, presente)` → `AsistenciaRepository.guardarOActualizar(sesionId, alumnoId, presente)` → devuelve `Asistencia`.
4. Al finalizar, `RegistrarTomaAsistenciaView` incluye `<<include>> cerrarSesionClase(sesionId)`.

---

## referencias

- [Índice de análisis](../README.md)
- [Diseño de este caso](../../diseño/registrarTomaAsistencia/README.md)
- [Modelo del dominio](../../requisitado/00-modelo-del-dominio/README.md)
- [colaboracion.puml](../../../modelosUML/analisis/registrarTomaAsistencia/colaboracion.puml)
