# CGU > cerrarCicloAcademico > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/cerrarCicloAcademico/README.md) | [Índice Diseño](../README.md) | **Diseño** | [Desarrollo](../../desarrollo/cerrarCicloAcademico/README.md) |
> |---|---|---|---|---|---|

**Actor:** Secretaria

El Frontend (Vue 3) envía la orden de cierre al controlador Express, que a través del servicio actualiza en PostgreSQL el estado de todas las matrículas vigentes a Histórica.

---

## Diagrama de secuencia

| ![secuencia](../../../images/diseño/cerrarCicloAcademico/secuencia.svg) |
| :--- |
| [secuencia.puml](../../../modelosUML/diseño/cerrarCicloAcademico/secuencia.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| Frontend (Vue 3) | Vista |
| MatriculaController | Controlador |
| MatriculaService | Servicio |
| Base de Datos (PostgreSQL) | Base de Datos |
| Matricula | Modelo |

---

## Flujo de secuencia

1. La Secretaria confirma el cierre del ciclo académico en el Frontend
2. Frontend → `POST /api/secretaria/ciclos/cerrar` → `MatriculaController.cerrarCicloAcademico()`
3. `MatriculaService` ejecuta: `UPDATE Matricula SET estado = 'Historica' WHERE estado = 'Vigente'`
4. Frontend muestra confirmación de cierre con el número de matrículas archivadas
