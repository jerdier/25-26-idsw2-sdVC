# CGU > consultarAlumno > Análisis

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Índice Análisis](../README.md) | **Análisis** | [Diseño](../../diseño/consultarAlumno/README.md) | [Desarrollo](../../desarrollo/consultarAlumno/README.md) |
> |---|---|---|---|---|---|

**Actor:** Secretaria

Permite a la Secretaria consultar los datos de un alumno concreto seleccionado desde el listado. El sistema muestra nombre, documento de identidad, correo institucional y carrera.


---

## Diagrama de colaboración

| ![colaboracion](../../../images/analisis/consultarAlumno/colaboracion.svg) |
| :--- |
| [colaboracion.puml](../../../modelosUML/analisis/consultarAlumno/colaboracion.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| ConsultarAlumnoView | Vista |
| AlumnoController | Controlador |
| AlumnoRepository | Modelo |
| Alumno | Modelo |

---

## Flujo de colaboración

1. La Secretaria selecciona un alumno del listado → se activa `ConsultarAlumnoView`
2. `ConsultarAlumnoView` solicita a `AlumnoController` los datos del alumno mediante `consultarAlumno(alumnoId)`
3. `AlumnoController` delega la búsqueda en `AlumnoRepository` invocando `findById(alumnoId)`
4. `AlumnoRepository` recupera el registro de `Alumno` y lo retorna al controlador para mostrarlo en la vista
