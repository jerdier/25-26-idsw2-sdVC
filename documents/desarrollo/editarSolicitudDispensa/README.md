# CGU > editarSolicitudDispensa > Desarrollo

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/editarSolicitudDispensa/README.md) | [Diseño](../../diseño/editarSolicitudDispensa/README.md) | [Índice Desarrollo](../README.md) | **Desarrollo** |
> |---|---|---|---|---|---|

**Actor:** Alumno · DirectorDeGrado · Secretaria

En el código, este caso de uso se implementa con **dos endpoints distintos** según lo que edita el actor: Alumno y Secretaria modifican el *contenido* de la solicitud (motivo/asignaturas); el DirectorDeGrado modifica su *resolución* (estado + observaciones).

---

## Backend

### Alumno / Secretaria — editar contenido

| Capa | Archivo | Función |
|------|---------|---------|
| Ruta | [`dispensaRoutes.ts#L16`](../../../src/plataforma-educativa/backend/src/routes/dispensaRoutes.ts#L16) | `PUT /dispensas/:id/rectificar` |
| Controlador | [`DispensaController.ts#L42-L48`](../../../src/plataforma-educativa/backend/src/controllers/DispensaController.ts#L42-L48) | `editarSolicitudDispensa()` |
| Servicio | [`DispensaService.ts#L52-L63`](../../../src/plataforma-educativa/backend/src/services/DispensaService.ts#L52-L63) | `editarSolicitudDispensa(id, data)` |

### DirectorDeGrado — resolver (aprobar/rechazar)

| Capa | Archivo | Función |
|------|---------|---------|
| Ruta | [`dispensaRoutes.ts#L17`](../../../src/plataforma-educativa/backend/src/routes/dispensaRoutes.ts#L17) | `PATCH /dispensas/:id/status` |
| Controlador | [`DispensaController.ts#L50-L56`](../../../src/plataforma-educativa/backend/src/controllers/DispensaController.ts#L50-L56) | `guardarSolicitudDispensa()` |
| Servicio | [`DispensaService.ts#L65-L71`](../../../src/plataforma-educativa/backend/src/services/DispensaService.ts#L65-L71) | `guardarSolicitudDispensa(id, data)` |

## Frontend

| Actor | Archivo | Función |
|-------|---------|---------|
| Servicio (contenido) | [`dispensaService.ts#L27-L30`](../../../src/plataforma-educativa/frontend/src/services/dispensaService.ts#L27-L30) | `editarSolicitudDispensa(id, data)` |
| Servicio (resolución) | [`dispensaService.ts#L32-L35`](../../../src/plataforma-educativa/frontend/src/services/dispensaService.ts#L32-L35) | `guardarSolicitudDispensa(id, data)` |
| Alumno | [`AlumnoDashboard.vue#L62-L76`](../../../src/plataforma-educativa/frontend/src/views/AlumnoDashboard.vue#L62-L76) | `irEditar()`, `handleEditar()` |
| Secretaria | [`SecretariaDashboard.vue#L109-L119`](../../../src/plataforma-educativa/frontend/src/views/SecretariaDashboard.vue#L109-L119) | `selEditarDisp()`, `handleEditarDisp()` |
| DirectorDeGrado | [`DirectorDeGradoDashboard.vue#L37-L51`](../../../src/plataforma-educativa/frontend/src/views/DirectorDeGradoDashboard.vue#L37-L51) | `irEditar()`, `guardar()` |

---

## Flujo real

**Alumno / Secretaria:** solo pueden editar una dispensa `PENDIENTE`. La vista precarga el motivo actual, y al guardar llama a `dispensaService.editarSolicitudDispensa(id, { motivo, ... })` → `PUT /api/dispensas/:id/rectificar`, que actualiza `motivo`/`sesionesEximidas`/`asignaturas` en `Dispensa`.

**DirectorDeGrado:** desde el detalle pulsa "resolverSolicitudDispensa" (`irEditar`), elige Aprobar/Rechazar y añade observaciones; `guardar()` llama a `dispensaService.guardarSolicitudDispensa(id, { estado, directorId, observaciones })` → `PATCH /api/dispensas/:id/status`, que actualiza `estado`, `directorId` y `observaciones` en `Dispensa`.
