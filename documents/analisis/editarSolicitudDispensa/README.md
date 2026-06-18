# CGU > editarSolicitudDispensa > Análisis

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [índice Análisis](../README.md) | **Análisis** | [Diseño](../../diseño/editarSolicitudDispensa/README.md) |
> |---|---|---|---|---|

**Actores:** Alumno · SecretariaAcadémica · DirectorDeGrado

---

## información del artefacto

| Campo | Valor |
|-------|-------|
| **Proyecto** | CGU - Centro de Gestión Universitaria |
| **Disciplina** | Análisis y Diseño |

---


## diagrama de colaboración

![colaboracion](../../../images/analisis/editarSolicitudDispensa/colaboracion.svg)

> fuente: [colaboracion.puml](../../../modelosUML/analisis/editarSolicitudDispensa/colaboracion.puml)

---

## clases de análisis identificadas

### clases de vista (boundary)

| Clase | Responsabilidad |
|-------|----------------|
| `EditarSolicitudDispensaView` | Formulario de edición precargado con los datos de la dispensa; muestra sesiones disponibles del alumno |

### clases de control

| Clase | Responsabilidad |
|-------|----------------|
| `DispensaController` | Recupera la dispensa y las sesiones del alumno, valida los datos y orquesta la actualización |

### clases de entidad (entity)

| Clase | Responsabilidad |
|-------|----------------|
| `DispensaRepository` | Obtiene la dispensa por id y persiste los cambios |
| `SesionClaseRepository` | Recupera las sesiones de clase asociadas al alumno |
| `Dispensa` | Entidad de dominio con motivo, alumno, sesiones y estado |
| `SesionDeClase` | Entidad de dominio que representa una sesión a la que aplica la dispensa |

---

## flujo de colaboración

1. El Alumno, la Secretaria o el Director acceden desde su dashboard → se abre `EditarSolicitudDispensaView`.
2. `EditarSolicitudDispensaView` → `DispensaController.obtenerDispensa(dispensaId)` → `DispensaRepository.obtenerPorId(dispensaId)` → devuelve `Dispensa` para precargar el formulario.
3. `EditarSolicitudDispensaView` → `DispensaController.cargarSesiones(alumnoId)` → `SesionClaseRepository.obtenerPorAlumno(alumnoId)` → devuelve `List<SesionDeClase>`.
4. `EditarSolicitudDispensaView` → `DispensaController.validarDatos(motivo, sesionesIds)`.
5. Si los datos son válidos, `EditarSolicitudDispensaView` → `DispensaController.editarSolicitudDispensa(dispensaId, motivo, sesionesIds)` → `DispensaRepository.actualizar(...)` → devuelve `Dispensa` actualizada.

---

## referencias

- [índice de análisis](../README.md)
- [Diseño de este caso](../../diseño/editarSolicitudDispensa/README.md)
- [Modelo del dominio](../../requisitado/00-modelo-del-dominio/README.md)
- [colaboracion.puml](../../../modelosUML/analisis/editarSolicitudDispensa/colaboracion.puml)