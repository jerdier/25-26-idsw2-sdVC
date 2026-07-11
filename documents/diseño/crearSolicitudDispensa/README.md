# CGU > crearSolicitudDispensa > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/crearSolicitudDispensa/README.md) | [Índice Diseño](../README.md) | **Diseño** | [Desarrollo](../../desarrollo/crearSolicitudDispensa/README.md) |
> |---|---|---|---|---|---|

**Actor:** Alumno · Secretaria

El Frontend (Vue 3) envía los datos de la nueva solicitud al controlador Express, que a través del servicio la inserta en PostgreSQL con estado PENDIENTE.

---

## Diagrama de secuencia

| ![secuencia](../../../images/diseño/crearSolicitudDispensa/secuencia.svg) |
| :--- |
| [secuencia.puml](../../../modelosUML/diseño/crearSolicitudDispensa/secuencia.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| Frontend (Vue 3) | Vista |
| DispensaController | Controlador |
| DispensaService | Servicio |
| Base de Datos (PostgreSQL) | Base de Datos |
| Asignatura | Modelo |
| Dispensa | Modelo |

---

## Flujo de secuencia

1. El actor abre el formulario de nueva dispensa en el Frontend
2. Frontend → `GET /api/dispensas/datos` → `DispensaController.getDatosCrearDispensa(usuarioId, rol)`
3. `DispensaService` consulta: `SELECT * FROM Asignatura (y Alumno si rol = Secretaria)`
4. Frontend muestra el formulario con los datos cargados
5. El actor rellena los campos (alumnoId, asignaturaId, periodo, horario, motivo) y confirma
6. Frontend → `POST /api/dispensas { alumnoId, asignaturaId, periodo, horario, motivo }` → `DispensaController.crearSolicitudDispensa(...)`
7. `DispensaService` ejecuta: `INSERT INTO Dispensa (alumnoId, asignaturaId, periodo, horario, motivo, estado='PENDIENTE')`
8. Frontend muestra confirmación "solicitud creada correctamente" con `201 Created`
