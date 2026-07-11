# CGU > crearSolicitudDispensa > Desarrollo

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/crearSolicitudDispensa/README.md) | [Diseño](../../diseño/crearSolicitudDispensa/README.md) | [Índice Desarrollo](../README.md) | **Desarrollo** |
> |---|---|---|---|---|---|

**Actor:** Alumno · Secretaria

Creación de una nueva solicitud de dispensa indicando motivo y asignaturas afectadas. Tanto el Alumno como la Secretaria pueden originarla; queda en estado inicial `PENDIENTE`.

---

## Backend

| Capa | Archivo | Función |
|------|---------|---------|
| Ruta | [`dispensaRoutes.ts#L7`](../../../src/plataforma-educativa/backend/src/routes/dispensaRoutes.ts#L7) | `POST /dispensas` |
| Controlador | [`DispensaController.ts#L28-L33`](../../../src/plataforma-educativa/backend/src/controllers/DispensaController.ts#L28-L33) | `crearSolicitudDispensa()` |
| Servicio | [`DispensaService.ts#L26-L38`](../../../src/plataforma-educativa/backend/src/services/DispensaService.ts#L26-L38) | `crearSolicitudDispensa(data)` |

## Frontend

| Actor | Archivo | Función |
|-------|---------|---------|
| Servicio | [`dispensaService.ts#L17-L20`](../../../src/plataforma-educativa/frontend/src/services/dispensaService.ts#L17-L20) | `crearSolicitudDispensa(data)` |
| Alumno | [`AlumnoDashboard.vue#L50-L60`](../../../src/plataforma-educativa/frontend/src/views/AlumnoDashboard.vue#L50-L60) | `handleCrear()` |
| Secretaria | [`SecretariaDashboard.vue#L93-L100`](../../../src/plataforma-educativa/frontend/src/views/SecretariaDashboard.vue#L93-L100) | `handleCrearDisp()` |

---

## Flujo real

1. El Alumno rellena motivo y asignaturas afectadas desde su menú "abrirDispensas → crearSolicitudDispensa"; la Secretaria hace lo mismo desde su panel indicando el alumno.
2. La vista llama a `dispensaService.crearSolicitudDispensa(data)` → `POST /api/dispensas` con `alumnoId`, `motivo`, `secretariaId` (si aplica), `sesionesIds` y `asignaturasIds`.
3. `DispensaService.crearSolicitudDispensa` crea el registro en `Dispensa` con Prisma, conectando las relaciones `sesionesEximidas` y `asignaturas`; el estado inicial (`PENDIENTE`) lo define el esquema de la base de datos.
4. La vista muestra confirmación y recarga el listado de dispensas.
