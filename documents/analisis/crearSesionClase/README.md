# CGU > crearSesionClase > Análisis

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Índice Análisis](../README.md) | **Análisis** | [Diseño](../../diseño/crearSesionClase/README.md) | [Desarrollo](../../desarrollo/crearSesionClase/README.md) |
> |---|---|---|---|---|---|

**Actor:** Profesor

Permite al Profesor crear una nueva sesión de clase indicando asignatura, fecha, hora de inicio, hora de fin y tipo de sesión. El sistema carga primero las asignaturas disponibles del profesor para que pueda seleccionar la asignatura correcta antes de registrar la sesión.


---

## Diagrama de colaboración

| ![colaboracion](../../../images/analisis/crearSesionClase/colaboracion.svg) |
| :--- |
| [colaboracion.puml](../../../modelosUML/analisis/crearSesionClase/colaboracion.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| CrearSesionClaseView | Vista |
| SesionClaseController | Controlador |
| AsignaturaRepository | Modelo |
| SesionClaseRepository | Modelo |
| Asignatura | Modelo |
| SesionDeClase | Modelo |

---

## Flujo de colaboración

1. El Profesor solicita crear una nueva sesión de clase → se activa `CrearSesionClaseView`
2. `CrearSesionClaseView` solicita a `SesionClaseController` las asignaturas disponibles mediante `cargarAsignaturas(profesorId)` para poblar el selector del formulario
3. `SesionClaseController` consulta `AsignaturaRepository.findByProfesor(profesorId)` para obtener las asignaturas del profesor
4. `AsignaturaRepository` recupera los registros de `Asignatura` y los retorna para mostrarlos en el formulario
5. El Profesor completa los datos y confirma → `CrearSesionClaseView` invoca `SesionClaseController.crearSesionClase(asignaturaId, fecha, horaInicio, horaFin, tipo)`
6. `SesionClaseController` ordena a `SesionClaseRepository` persistir la nueva sesión invocando `create(asignaturaId, fecha, horaInicio, horaFin, tipo)`
7. `SesionClaseRepository` crea el nuevo registro en la entidad `SesionDeClase`
