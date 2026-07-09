# CGU > abrirDispensas > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/abrirDispensas/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** Alumno · Profesor · DirectorDeGrado · Secretaria

Permite al actor acceder al listado de solicitudes de dispensa del sistema. Según el rol, el Frontend (Vue 3) mostrará las dispensas que corresponden al actor autenticado. El servicio las recupera de la base de datos (PostgreSQL) mediante Prisma.

---

## Diagrama de secuencia

| ![secuencia](../../../images/diseño/abrirDispensas/secuencia.svg) |
| :--- |
| [secuencia.puml](../../../modelosUML/diseño/abrirDispensas/secuencia.puml) |

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

1. El Alumno solicita abrir gestión de dispensas en el Frontend (Vue 3).
2. El Frontend (Vue 3) realiza una petición HTTP GET a `/api/alumno/dispensas` al Controlador (`DispensaController`).
3. El Controlador (`DispensaController`) delega la lógica en el Servicio (`DispensaService`) llamando a `obtenerDispensas(alumnoId)`.
4. El Servicio (`DispensaService`) realiza una consulta a la Base de Datos (PostgreSQL): `SELECT * FROM Dispensa WHERE alumnoId = ?`.
5. La Base de Datos retorna el resultado `List<Dispensa>` al Servicio (`DispensaService`).
6. El DispensaService retorna el resultado `List<Dispensa>` al Controlador (`DispensaController`).
7. El Controlador (`DispensaController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ dispensas }`.
8. El Frontend (Vue 3) muestra lista de solicitudes de dispensa (asignatura, periodo, horario, estado) al Alumno.
