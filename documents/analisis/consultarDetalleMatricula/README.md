# CGU > consultarDetalleMatricula > Análisis

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Índice Análisis](../README.md) | **Análisis** | [Diseño](../../diseño/consultarDetalleMatricula/README.md) | [Desarrollo](../../desarrollo/consultarDetalleMatricula/README.md) |
> |---|---|---|---|---|---|

**Actor:** Secretaria

Permite a la Secretaria consultar el detalle de la matrícula de un alumno concreto, mostrando las asignaturas matriculadas con su grupo y estado (Aprobada / Reprobada / Cursando).


---

## Diagrama de colaboración

| ![colaboracion](../../../images/analisis/consultarDetalleMatricula/colaboracion.svg) |
| :--- |
| [colaboracion.puml](../../../modelosUML/analisis/consultarDetalleMatricula/colaboracion.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| ConsultarDetalleMatriculaView | Vista |
| MatriculaController | Controlador |
| MatriculaRepository | Modelo |
| Matricula | Modelo |

---

## Flujo de colaboración

1. La Secretaria selecciona un alumno del listado de matrículas → se activa `ConsultarDetalleMatriculaView`
2. `ConsultarDetalleMatriculaView` solicita a `MatriculaController` el detalle de la matrícula mediante `consultarDetalleMatricula(alumnoId)`
3. `MatriculaController` delega la consulta en `MatriculaRepository` invocando `findByAlumno(alumnoId)`
4. `MatriculaRepository` recupera las asignaturas matriculadas de `Matricula` y las retorna al controlador para mostrarlas
