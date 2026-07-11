# CGU > registrarTomaAsistencia > Análisis

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Índice Análisis](../README.md) | **Análisis** | [Diseño](../../diseño/registrarTomaAsistencia/README.md) | [Desarrollo](../../desarrollo/registrarTomaAsistencia/README.md) |
> |---|---|---|---|---|---|

**Actor:** Profesor

Permite al Profesor pasar lista durante una sesión de clase activa. El sistema carga el listado de alumnos matriculados en la asignatura y permite registrar el estado de cada uno: Presente, Ausente o Tarde.


---

## Diagrama de colaboración

| ![colaboracion](../../../images/analisis/registrarTomaAsistencia/colaboracion.svg) |
| :--- |
| [colaboracion.puml](../../../modelosUML/analisis/registrarTomaAsistencia/colaboracion.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| RegistrarTomaAsistenciaView | Vista |
| AsistenciaController | Controlador |
| AlumnoRepository | Modelo |
| AsistenciaRepository | Modelo |
| Alumno | Modelo |
| Asistencia | Modelo |

---

## Flujo de colaboración

1. El Profesor solicita pasar lista durante la sesión activa → se activa `RegistrarTomaAsistenciaView`
2. `RegistrarTomaAsistenciaView` solicita a `AsistenciaController` el listado de alumnos mediante `cargarAlumnos(sesionId)` para mostrarlos en la vista de lista
3. `AsistenciaController` consulta `AlumnoRepository.findBySesion(sesionId)` para obtener los alumnos matriculados en la asignatura de la sesión
4. `AlumnoRepository` recupera los registros de `Alumno` y los retorna al controlador
5. El Profesor marca el estado de cada alumno y confirma → `RegistrarTomaAsistenciaView` invoca `AsistenciaController.registrarAsistencia(sesionId, alumnoId, estado)` por cada alumno
6. `AsistenciaController` ordena a `AsistenciaRepository` persistir el registro invocando `crearOActualizar(sesionId, alumnoId, estado)`
7. `AsistenciaRepository` guarda el estado (Presente / Ausente / Tarde) en la entidad `Asistencia`
