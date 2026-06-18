# CGU > editarSesionClase > Análisis

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Índice Análisis](../README.md) | **Análisis** | [Diseño](../../diseño/editarSesionClase/README.md) |
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

![colaboracion](../../../images/analisis/editarSesionClase/colaboracion.svg)

> fuente: [colaboracion.puml](../../../modelosUML/analisis/editarSesionClase/colaboracion.puml)

---

## clases de análisis identificadas

### clases de vista (boundary)

| Clase | Responsabilidad |
|-------|----------------|
| `EditarSesionClaseView` | Formulario de edición precargado con los datos actuales de la sesión; muestra asignaturas disponibles |

### clases de control

| Clase | Responsabilidad |
|-------|----------------|
| `SesionClaseController` | Recupera la sesión y las asignaturas del profesor, valida los datos y orquesta la actualización |

### clases de entidad (entity)

| Clase | Responsabilidad |
|-------|----------------|
| `SesionClaseRepository` | Obtiene la sesión por id y persiste los cambios |
| `AsignaturaRepository` | Recupera las asignaturas asignadas al profesor |
| `SesionDeClase` | Entidad de dominio con fecha, aula, duración y estado |
| `Asignatura` | Entidad de dominio que representa una asignatura |

---

## flujo de colaboración

1. El Profesor accede desde `:Dashboard Profesor Abierto` → se abre `EditarSesionClaseView`.
2. `EditarSesionClaseView` → `SesionClaseController.obtenerSesion(sesionId)` → `SesionClaseRepository.obtenerPorId(sesionId)` → devuelve `SesionDeClase` para precargar el formulario.
3. `EditarSesionClaseView` → `SesionClaseController.cargarAsignaturas(profesorId)` → `AsignaturaRepository.obtenerPorProfesor(profesorId)` → devuelve `List<Asignatura>`.
4. `EditarSesionClaseView` → `SesionClaseController.validarDatos(asignaturaId, fecha, aula)`.
5. Si los datos son válidos, `EditarSesionClaseView` → `SesionClaseController.editarSesionClase(sesionId, asignaturaId, fecha, aula, duracion)` → `SesionClaseRepository.actualizar(...)` → devuelve `SesionDeClase` actualizada.

---

## referencias

- [Índice de análisis](../README.md)
- [Diseño de este caso](../../diseño/editarSesionClase/README.md)
- [Modelo del dominio](../../requisitado/00-modelo-del-dominio/README.md)
- [colaboracion.puml](../../../modelosUML/analisis/editarSesionClase/colaboracion.puml)
