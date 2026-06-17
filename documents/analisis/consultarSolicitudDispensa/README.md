# CGU > consultarSolicitudDispensa > Análisis

> | [Inicio](../../../README.md) | [Casos de Uso](../../requisitado/README.md) | [índice Análisis](../README.md) | **Análisis** | [Diseño](../../diseño/consultarSolicitudDispensa/README.md) |
> |---|---|---|---|---|

**Actores:** Profesor · SecretariaAcadémica

---

## información del artefacto

| Campo | Valor |
|-------|-------|
| **Proyecto** | CGU - Centro de Gestión Universitaria |
| **Disciplina** | Análisis y Diseño |

---


## diagrama de colaboración

![colaboracion](../../../images/analisis/consultarSolicitudDispensa/colaboracion.svg)

> fuente: [colaboracion.puml](../../../modelosUML/analisis/consultarSolicitudDispensa/colaboracion.puml)

---

## clases de análisis identificadas

### clases de vista (boundary)

| Clase | Responsabilidad |
|-------|----------------|
| `ConsultarSolicitudDispensaView` | Muestra el listado de solicitudes y el detalle de la seleccionada |

### clases de control

| Clase | Responsabilidad |
|-------|----------------|
| `DispensaController` | Obtiene las solicitudes accesibles para el actor y el detalle de una concreta |

### clases de entidad (entity)

| Clase | Responsabilidad |
|-------|----------------|
| `DispensaRepository` | Consulta solicitudes por actor y por id |
| `Dispensa` | Entidad de dominio con motivo, alumno, sesiones y estado |

---

## flujo de colaboración

1. El Profesor o la Secretaria accede desde su dashboard → se abre `ConsultarSolicitudDispensaView`.
2. `ConsultarSolicitudDispensaView` → `DispensaController.obtenerSolicitudes(actorId)` → `DispensaRepository.obtenerPorActor(actorId)` → devuelve `List<Dispensa>`.
3. El actor selecciona una solicitud → `ConsultarSolicitudDispensaView` → `DispensaController.obtenerDetalle(dispensaId)` → `DispensaRepository.obtenerPorId(dispensaId)` → devuelve `Dispensa`.

---

## referencias

- [índice de análisis](../README.md)
- [Diseño de este caso](../../diseño/consultarSolicitudDispensa/README.md)
- [Modelo del dominio](../../requisitado/00-modelo-del-dominio/README.md)
- [colaboracion.puml](../../../modelosUML/analisis/consultarSolicitudDispensa/colaboracion.puml)