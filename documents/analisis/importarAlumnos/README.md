# CGU > importarAlumnos > Análisis

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Índice Análisis](../README.md) | **Análisis** | [Diseño](../../diseño/importarAlumnos/README.md) |
> |---|---|---|---|---|

**Actor:** Secretaria

Permite a la Secretaria importar un listado de alumnos desde un archivo Excel o CSV. El sistema procesa cada registro del archivo y crea o actualiza el alumno correspondiente en la base de datos.


---

## Diagrama de colaboración

| ![colaboracion](../../../images/analisis/importarAlumnos/colaboracion.svg) |
| :--- |
| [colaboracion.puml](../../../modelosUML/analisis/importarAlumnos/colaboracion.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| ImportarAlumnosView | Vista |
| AlumnoController | Controlador |
| AlumnoRepository | Modelo |
| Alumno | Modelo |

---

## Flujo de colaboración

1. La Secretaria solicita importar el listado de alumnos → se activa `ImportarAlumnosView`
2. La Secretaria adjunta el archivo y confirma → `ImportarAlumnosView` invoca `AlumnoController.importarAlumnos(archivo)` para iniciar el proceso de importación
3. `AlumnoController` procesa cada fila del archivo y delega la persistencia en `AlumnoRepository` invocando `crearOActualizar(datosAlumno)` por cada registro
4. `AlumnoRepository` crea o actualiza el registro correspondiente en la entidad `Alumno`
