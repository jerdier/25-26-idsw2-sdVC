# CGU > consultarSolicitudDispensa > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/consultarSolicitudDispensa/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** Alumno · Profesor · DirectorDeGrado · Secretaria

El Frontend (Vue 3) solicita el detalle de una dispensa concreta al controlador Express, que la recupera de PostgreSQL mediante Prisma y la muestra en pantalla.

---

## Diagrama de secuencia

| ![secuencia](../../../images/diseño/consultarSolicitudDispensa/secuencia.svg) |
| :--- |
| [secuencia.puml](../../../modelosUML/diseño/consultarSolicitudDispensa/secuencia.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| Frontend (Vue 3) | Vista |
| DispensaController | Controlador |
| DispensaService | Servicio |
| Base de Datos (PostgreSQL) | Base de Datos |
| Dispensa | Modelo |

---

## Flujo de secuencia

1. El actor selecciona una solicitud del listado de dispensas en el Frontend
2. Frontend → `GET /api/dispensas/:dispensaId` → `DispensaController.getDispensa(dispensaId)`
3. `DispensaService` consulta: `SELECT * FROM Dispensa WHERE id = ?`
4. Frontend muestra el detalle completo de la solicitud (estado, asignatura, motivo, franja horaria)
