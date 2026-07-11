# CGU > consultarSolicitudDispensa > Desarrollo

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/consultarSolicitudDispensa/README.md) | [Diseño](../../diseño/consultarSolicitudDispensa/README.md) | [Índice Desarrollo](../README.md) | **Desarrollo** |
> |---|---|---|---|---|---|

**Actor:** Alumno · Profesor · DirectorDeGrado · Secretaria

Consulta del detalle completo de una solicitud de dispensa (estado, motivo, asignaturas afectadas, observaciones) al seleccionarla desde cualquiera de los listados de `abrirDispensas`.

---

## Backend

| Capa | Archivo | Función |
|------|---------|---------|
| Ruta | [`dispensaRoutes.ts#L14-L15`](../../../src/plataforma-educativa/backend/src/routes/dispensaRoutes.ts#L14-L15) | `GET /dispensas/:id` |
| Controlador | [`DispensaController.ts#L5-L11`](../../../src/plataforma-educativa/backend/src/controllers/DispensaController.ts#L5-L11) | `consultarSolicitudDispensa()` |
| Servicio | [`DispensaService.ts#L5-L13`](../../../src/plataforma-educativa/backend/src/services/DispensaService.ts#L5-L13) | `consultarSolicitudDispensa(dispensaId)` |

## Frontend

| Actor | Archivo | Función |
|-------|---------|---------|
| Servicio | [`dispensaService.ts#L4-L7`](../../../src/plataforma-educativa/frontend/src/services/dispensaService.ts#L4-L7) | `consultarSolicitudDispensa(dispensaId)` |
| Alumno | [`AlumnoDashboard.vue#L43-L48`](../../../src/plataforma-educativa/frontend/src/views/AlumnoDashboard.vue#L43-L48) | `irDetalle()` |
| DirectorDeGrado | [`DirectorDeGradoDashboard.vue#L30-L35`](../../../src/plataforma-educativa/frontend/src/views/DirectorDeGradoDashboard.vue#L30-L35) | `irDetalle()` |
| Profesor | [`ProfesorDashboard.vue#L175-L180`](../../../src/plataforma-educativa/frontend/src/views/ProfesorDashboard.vue#L175-L180) | `irDetalleDispensa()` |
| Secretaria | [`SecretariaDashboard.vue#L102-L107`](../../../src/plataforma-educativa/frontend/src/views/SecretariaDashboard.vue#L102-L107) | `handleConsultarDisp()` |

---

## Flujo real

1. El actor selecciona una dispensa del listado (`abrirDispensas`) → cada dashboard llama a su función `irDetalle*`/`handleConsultarDisp`.
2. La vista llama a `dispensaService.consultarSolicitudDispensa(id)` → `GET /api/dispensas/:id`.
3. `DispensaService.consultarSolicitudDispensa` busca la `Dispensa` por id con Prisma incluyendo `alumno`, `sesionesEximidas` (con su `asignatura`) y `asignaturas`.
4. La vista muestra estado, motivo, fecha, observaciones (si las hay) y asignaturas afectadas; si la petición falla, la vista cae de vuelta a los datos ya presentes en el listado (`catch { sel.value = d }`).

> Nota: esta función se llamaba `getDispensa` en el código (sin relación con el nombre del caso de uso), mientras que el nombre `consultarSolicitudDispensa` lo ocupaba la función de listado (hoy `abrirDispensas`). Se renombraron ambas para que coincidan con su caso de uso real.
