# CGU > consultarSolicitudDispensa > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/consultarSolicitudDispensa/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actores:** Profesor · SecretariaAcadémica

---

## información del artefacto

| Campo | Valor |
|-------|-------|
| **Proyecto** | CGU - Centro de Gestión Universitaria |
| **Disciplina** | Análisis y Diseño |

---

## diagrama de secuencia

![secuencia](../../../images/diseño/consultarSolicitudDispensa/secuencia.svg)

> fuente: [secuencia.puml](../../../modelosUML/diseño/consultarSolicitudDispensa/secuencia.puml)

---

## clases de diseño identificadas

### frontend (Vue 3)

| Clase | Responsabilidad |
|-------|----------------|
| `ProfessorDashboard.vue` | Muestra las dispensas aprobadas en las asignaturas del profesor |
| `SecretariaDashboard.vue` | Muestra todas las dispensas del sistema con opción de ver detalle |

### backend (Express + TypeScript)

| Clase | Responsabilidad |
|-------|----------------|
| `DispensaController` | Recibe las peticiones de listado y detalle de dispensas, delega en el servicio |
| `DispensaService` | Filtra dispensas por profesor o devuelve todas; recupera el detalle de una dispensa concreta |

### base de datos (PostgreSQL)

| Tabla | Responsabilidad |
|-------|----------------|
| `Dispensa` | Almacena cada solicitud con su estado (PENDIENTE / APROBADA / RECHAZADA) |
| `_DispensaToAsignatura` | Tabla m2m que asocia la dispensa con las asignaturas cubiertas |
| `_DispensaToSesion` | Tabla m2m que asocia la dispensa con las sesiones eximidas |

---

## flujo de secuencia

**Ruta Profesor:**

1. El Profesor accede a la sección de dispensas en `ProfessorDashboard.vue`.
2. El frontend llama `GET /api/dispensas/profesor/:profesorId` al `DispensaController`.
3. `DispensaService.getDispensasByProfesor(profesorId)` ejecuta `SELECT * FROM Dispensa WHERE asignaturas.some(profesorId = ?) INCLUDE alumno, asignaturas`.
4. La base de datos devuelve `dispensas : Dispensa[]`; el frontend muestra la lista.

**Ruta Secretaria:**

1. La Secretaria accede a la sección de dispensas en `SecretariaDashboard.vue`.
2. El frontend llama `GET /api/dispensas` al `DispensaController`.
3. `DispensaService.getAllDispensas()` ejecuta `SELECT * FROM Dispensa INCLUDE alumno, asignaturas ORDER BY fechaSolicitud DESC`.
4. La base de datos devuelve `dispensas : Dispensa[]`; el frontend muestra la lista completa.

**Detalle (ambos actores):**

5. El actor selecciona una dispensa de la lista.
6. El frontend llama `GET /api/dispensas/:id` al `DispensaController`.
7. `DispensaService` ejecuta `SELECT * FROM Dispensa WHERE id = ? INCLUDE alumno, sesionesEximidas, asignaturas`.
8. El frontend muestra el detalle completo de la dispensa.

---

## referencias

- [Índice de diseño](../README.md)
- [Análisis de este caso](../../analisis/consultarSolicitudDispensa/README.md)
- [Modelo del dominio](../../requisitado/00-modelo-del-dominio/README.md)
- [secuencia.puml](../../../modelosUML/diseño/consultarSolicitudDispensa/secuencia.puml)
