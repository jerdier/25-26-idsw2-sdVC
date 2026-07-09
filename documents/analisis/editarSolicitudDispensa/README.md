# CGU > editarSolicitudDispensa > Análisis

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Índice Análisis](../README.md) | **Análisis** | [Diseño](../../diseño/editarSolicitudDispensa/README.md) |
> |---|---|---|---|---|

**Actor:** Alumno · DirectorDeGrado · Secretaria

Permite al actor modificar una solicitud de dispensa existente. El Alumno y la Secretaria pueden editar el contenido de la solicitud; el Director de Grado puede cambiar el estado y añadir observaciones de resolución.


---

## Diagrama de colaboración

| ![colaboracion](../../../images/analisis/editarSolicitudDispensa/colaboracion.svg) |
| :--- |
| [colaboracion.puml](../../../modelosUML/analisis/editarSolicitudDispensa/colaboracion.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| EditarSolicitudDispensaView | Vista |
| DispensaController | Controlador |
| DispensaRepository | Modelo |
| Dispensa | Modelo |

---

## Flujo de colaboración

1. El actor solicita editar una solicitud de dispensa → se activa `EditarSolicitudDispensaView`
2. `EditarSolicitudDispensaView` solicita a `DispensaController` los datos actuales mediante `obtenerDispensa(dispensaId)` para precargar el formulario
3. `DispensaController` consulta `DispensaRepository.findById(dispensaId)` para recuperar la solicitud
4. `DispensaRepository` accede a `Dispensa` y retorna los datos al controlador
5. El actor realiza los cambios y confirma → `EditarSolicitudDispensaView` invoca `DispensaController.editarSolicitudDispensa(dispensaId, datos)`
6. `DispensaController` ordena a `DispensaRepository` persistir los cambios invocando `update(dispensaId, datos)`
