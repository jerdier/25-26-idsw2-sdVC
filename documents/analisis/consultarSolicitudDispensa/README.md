# CGU > consultarSolicitudDispensa > Análisis

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Índice Análisis](../README.md) | **Análisis** | [Diseño](../../diseño/consultarSolicitudDispensa/README.md) |
> |---|---|---|---|---|

**Actor:** Alumno · Profesor · DirectorDeGrado · Secretaria

Permite al actor consultar el detalle completo de una solicitud de dispensa: estado, asignatura afectada, tipo de motivo, días y franja horaria, asignatura solapada y justificación presentada.


---

## Diagrama de colaboración

| ![colaboracion](../../../images/analisis/consultarSolicitudDispensa/colaboracion.svg) |
| :--- |
| [colaboracion.puml](../../../modelosUML/analisis/consultarSolicitudDispensa/colaboracion.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| ConsultarSolicitudDispensaView | Vista |
| DispensaController | Controlador |
| DispensaRepository | Modelo |
| Dispensa | Modelo |

---

## Flujo de colaboración

1. El actor selecciona una solicitud del listado de dispensas → se activa `ConsultarSolicitudDispensaView`
2. `ConsultarSolicitudDispensaView` solicita a `DispensaController` el detalle de la solicitud mediante `consultarSolicitudDispensa(dispensaId)`
3. `DispensaController` delega la búsqueda en `DispensaRepository` invocando `findById(dispensaId)`
4. `DispensaRepository` recupera el registro de `Dispensa` y lo retorna al controlador para mostrarlo en la vista
