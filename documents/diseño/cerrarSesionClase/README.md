# CGU > cerrarSesionClase > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/cerrarSesionClase/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** Profesor

El Frontend (Vue 3) muestra el resumen de la sesión antes de confirmar el cierre. El controlador Express actualiza el estado de la sesión a CERRADA en PostgreSQL mediante el servicio.

---

## Diagrama de secuencia

| ![secuencia](../../../images/diseño/cerrarSesionClase/secuencia.svg) |
| :--- |
| [secuencia.puml](../../../modelosUML/diseño/cerrarSesionClase/secuencia.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| Frontend (Vue 3) | Vista |
| AcademicController | Controlador |
| AcademicService | Servicio |
| Base de Datos (PostgreSQL) | Base de Datos |
| SesionDeClase | Modelo |

---

## Flujo de secuencia

1. El Profesor solicita cerrar la sesión activa en el Frontend
2. Frontend → `GET /api/academic/sessions/:sesionId` → `AcademicController.getSession(sesionId)`
3. `AcademicService` consulta: `SELECT * FROM SesionDeClase WHERE id = ?`
4. Frontend muestra resumen de la sesión y el Profesor confirma el cierre
5. Frontend → `PUT /api/academic/sessions/:sesionId/cerrar` → `AcademicController.closeSession(sesionId)`
6. `AcademicService` ejecuta: `UPDATE SesionDeClase SET estado = 'CERRADA' WHERE id = ?`
7. Frontend muestra confirmación "sesión cerrada correctamente"
