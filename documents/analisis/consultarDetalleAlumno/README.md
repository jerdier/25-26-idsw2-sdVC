# CGU > consultarDetalleAlumno > Análisis

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Índice Análisis](../README.md) | **Análisis** | [Diseño](../../diseño/consultarDetalleAlumno/README.md) |
> |---|---|---|---|---|

**Actor:** Profesor

Permite al Profesor consultar la ficha completa de un alumno: datos personales, porcentaje de asistencia, faltas injustificadas y sesiones dispensadas. Requiere acceder tanto a los datos del alumno como a sus registros de asistencia.


---

## Diagrama de colaboración

| ![colaboracion](../../../images/analisis/consultarDetalleAlumno/colaboracion.svg) |
| :--- |
| [colaboracion.puml](../../../modelosUML/analisis/consultarDetalleAlumno/colaboracion.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| ConsultarDetalleAlumnoView | Vista |
| AlumnoController | Controlador |
| AlumnoRepository | Modelo |
| AsistenciaRepository | Modelo |
| Alumno | Modelo |
| Asistencia | Modelo |

---

## Flujo de colaboración

1. El Profesor selecciona un alumno del listado → se activa `ConsultarDetalleAlumnoView`
2. `ConsultarDetalleAlumnoView` solicita a `AlumnoController` los datos del alumno mediante `consultarDetalleAlumno(alumnoId)`
3. `AlumnoController` recupera los datos personales consultando `AlumnoRepository.findById(alumnoId)`
4. `AlumnoRepository` accede a la entidad `Alumno` y retorna sus datos al controlador
5. `AlumnoController` recupera el historial de asistencia consultando `AsistenciaRepository.findByAlumno(alumnoId)`
6. `AsistenciaRepository` accede a la entidad `Asistencia` y retorna los registros para calcular las estadísticas
