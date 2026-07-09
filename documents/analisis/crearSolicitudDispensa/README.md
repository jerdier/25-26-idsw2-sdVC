# CGU > crearSolicitudDispensa > Análisis

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Índice Análisis](../README.md) | **Análisis** | [Diseño](../../diseño/crearSolicitudDispensa/README.md) |
> |---|---|---|---|---|

**Actor:** Alumno · Secretaria

Permite al actor crear una nueva solicitud de dispensa indicando la asignatura afectada, el tipo de motivo, los días y franja horaria, la asignatura solapada y la justificación. El sistema instancia la solicitud con estado inicial pendiente.


---

## Diagrama de colaboración

| ![colaboracion](../../../images/analisis/crearSolicitudDispensa/colaboracion.svg) |
| :--- |
| [colaboracion.puml](../../../modelosUML/analisis/crearSolicitudDispensa/colaboracion.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| CrearSolicitudDispensaView | Vista |
| DispensaController | Controlador |
| DispensaRepository | Modelo |
| Dispensa | Modelo |

---

## Flujo de colaboración

1. El actor solicita crear una nueva dispensa → se activa `CrearSolicitudDispensaView`
2. El actor completa el formulario y confirma → `CrearSolicitudDispensaView` invoca `DispensaController.crearSolicitudDispensa(asignatura, motivo, dias, franjaHoraria, asignaturaSolapada, justificacion)`
3. `DispensaController` ordena a `DispensaRepository` persistir la solicitud invocando `create(asignatura, motivo, dias, franjaHoraria, asignaturaSolapada, justificacion)`
4. `DispensaRepository` crea el nuevo registro en la entidad `Dispensa` con estado inicial pendiente
