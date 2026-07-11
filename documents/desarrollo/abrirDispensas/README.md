# CGU > abrirDispensas > Desarrollo

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/abrirDispensas/README.md) | [Diseño](../../diseño/abrirDispensas/README.md) | [Índice Desarrollo](../README.md) | **Desarrollo** |
> |---|---|---|---|---|---|

**Actor:** Alumno · Profesor · DirectorDeGrado · Secretaria

Listado de solicitudes de dispensa. Alumno, DirectorDeGrado y Secretaria usan el mismo endpoint de listado con filtros; el Profesor usa un endpoint propio que solo devuelve dispensas aprobadas de sus asignaturas.

---

## Backend

### Alumno / DirectorDeGrado / Secretaria

| Capa | Archivo | Función |
|------|---------|---------|
| Ruta | [`dispensaRoutes.ts#L10-L11`](../../../src/plataforma-educativa/backend/src/routes/dispensaRoutes.ts#L10-L11) | `GET /dispensas` |
| Controlador | [`DispensaController.ts#L35-L40`](../../../src/plataforma-educativa/backend/src/controllers/DispensaController.ts#L35-L40) | `abrirDispensas()` |
| Servicio | [`DispensaService.ts#L40-L50`](../../../src/plataforma-educativa/backend/src/services/DispensaService.ts#L40-L50) | `abrirDispensas(filtros)` |

### Profesor

| Capa | Archivo | Función |
|------|---------|---------|
| Ruta | [`dispensaRoutes.ts#L9`](../../../src/plataforma-educativa/backend/src/routes/dispensaRoutes.ts#L9) | `GET /dispensas/profesor/:profesorId` |
| Controlador | [`DispensaController.ts#L13-L18`](../../../src/plataforma-educativa/backend/src/controllers/DispensaController.ts#L13-L18) | `getDispensasByProfesor()` |
| Servicio | [`DispensaService.ts#L15-L20`](../../../src/plataforma-educativa/backend/src/services/DispensaService.ts#L15-L20) | `getDispensasByProfesor(profesorId)` |

## Frontend

| Actor | Archivo | Función |
|-------|---------|---------|
| Servicio (listado general) | [`dispensaService.ts#L22-L25`](../../../src/plataforma-educativa/frontend/src/services/dispensaService.ts#L22-L25) | `abrirDispensas(filtros)` |
| Servicio (por profesor) | [`dispensaService.ts#L9-L11`](../../../src/plataforma-educativa/frontend/src/services/dispensaService.ts#L9-L11) | `getDispensasByProfesor(profesorId)` |
| Alumno | [`AlumnoDashboard.vue#L32-L35`](../../../src/plataforma-educativa/frontend/src/views/AlumnoDashboard.vue#L32-L35) | `cargarDispensas()` |
| DirectorDeGrado | [`DirectorDeGradoDashboard.vue#L19-L22`](../../../src/plataforma-educativa/frontend/src/views/DirectorDeGradoDashboard.vue#L19-L22) | `cargarDispensas()` |
| Profesor | [`ProfesorDashboard.vue#L169-L173`](../../../src/plataforma-educativa/frontend/src/views/ProfesorDashboard.vue#L169-L173) | `irDispensas()` |
| Secretaria | [`SecretariaDashboard.vue#L18-L27`](../../../src/plataforma-educativa/frontend/src/views/SecretariaDashboard.vue#L18-L27) | `watch(panel, ...)` |

---

## Flujo real

1. El actor abre el módulo "abrirDispensas" desde su dashboard.
2. Alumno/Director/Secretaria llaman a `dispensaService.abrirDispensas`, que golpea `GET /api/dispensas` con `estado`/`alumnoId` como query params opcionales.
3. El Profesor llama a `dispensaService.getDispensasByProfesor`, que golpea `GET /api/dispensas/profesor/:profesorId` y solo trae dispensas con `estado: 'APROBADA'` cuyas asignaturas pertenecen a ese profesor.
4. `DispensaService` consulta Prisma sobre la entidad `Dispensa` incluyendo `alumno` y `asignaturas`, y la vista pinta la lista con estado (Pendiente/Aprobada/Rechazada).

> Nota: esta función se llamaba `consultarSolicitudDispensa` en el código (mismo nombre que el caso de uso de detalle) mientras que la de detalle se llamaba `getDispensa`, sin relación con su CU real. Se renombraron ambas para que el nombre en código coincida con el caso de uso que implementan.
