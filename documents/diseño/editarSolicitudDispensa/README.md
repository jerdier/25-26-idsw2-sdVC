# CGU > editarSolicitudDispensa > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/editarSolicitudDispensa/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actores:** Alumno · SecretariaAcademica · DirectorDeGrado

---

## información del artefacto

| Campo | Valor |
|-------|-------|
| **Proyecto** | CGU - Centro de Gestión Universitaria |
| **Disciplina** | Análisis y Diseño |

---

## diagrama de secuencia

![secuencia](../../../images/diseño/editarSolicitudDispensa/secuencia.svg)

> fuente: [secuencia.puml](../../../modelosUML/diseño/editarSolicitudDispensa/secuencia.puml)

---

## clases de diseño identificadas

### frontend (Vue 3)

| Clase | Responsabilidad |
|-------|----------------|
| `AlumnoDashboard.vue / SecretariaDashboard.vue / DirectorDashboard.vue` | Presenta el formulario de edición de la dispensa adaptado al rol del usuario |

### backend (Express + TypeScript)

| Clase | Responsabilidad |
|-------|----------------|
| `DispensaController` | Gestiona las peticiones de carga (`GET`) y actualización (`PUT` / `PATCH`) de la dispensa según el rol |
| `DispensaService` | Recupera la dispensa y las sesiones del alumno; persiste los cambios de contenido o de estado |
| `AcademicController / AcademicService` | Proporciona las sesiones disponibles del alumno para el formulario |

### base de datos (PostgreSQL)

| Tabla | Responsabilidad |
|-------|----------------|
| `Dispensa` | Fuente y destino de los datos editados (motivo, sesionesIds, estado, observaciones) |
| `SesionDeClase` | Proporciona las sesiones disponibles del alumno para el selector del formulario |

---

## flujo de secuencia

### Carga de datos (común a todos los actores)

1. El actor selecciona la dispensa a editar.
2. El frontend llama `GET /api/dispensas/:dispensaId` → `DispensaController` → `DispensaService.getDispensa(dispensaId)` → `SELECT * FROM Dispensa WHERE id = ?` → devuelve `dispensa`.
3. El frontend llama `GET /api/academic/alumno/:alumnoId/sessions` → `AcademicService.getSessionsForAlumno(alumnoId)` → devuelve `SesionDeClase[]`.
4. El frontend muestra el formulario con los datos actuales y las sesiones disponibles.

### Alumno / Secretaria: modifica contenido

5. El actor modifica el motivo y las sesiones implicadas y confirma los cambios.
6. El frontend llama `PUT /api/dispensas/:id/rectificar { motivo, sesionesIds }`.
7. `DispensaController` → `DispensaService.updateDispensa(id, motivo, sesionesIds)`.
8. `DispensaService` ejecuta `UPDATE Dispensa SET motivo=? WHERE id=?` → devuelve `dispensaActualizada`.
9. `DispensaController` responde `200 OK { dispensaActualizada }` → el frontend confirma la actualización.

### Director de Grado: modifica estado

5. El Director revisa la solicitud, selecciona la resolución (APROBADA / RECHAZADA) e introduce observaciones.
6. El frontend llama `PATCH /api/dispensas/:id/status { estado, observaciones }`.
7. `DispensaController` → `DispensaService.updateStatus(id, estado, observaciones)`.
8. `DispensaService` ejecuta `UPDATE Dispensa SET estado=?, observaciones=? WHERE id=?` → devuelve `dispensaActualizada`.
9. `DispensaController` responde `200 OK { dispensaActualizada }` → el frontend confirma la resolución y notifica al Alumno sobre el nuevo estado.

---

## referencias

- [Índice de diseño](../README.md)
- [Análisis de este caso](../../analisis/editarSolicitudDispensa/README.md)
- [Modelo del dominio](../../requisitado/00-modelo-del-dominio/README.md)
- [secuencia.puml](../../../modelosUML/diseño/editarSolicitudDispensa/secuencia.puml)
