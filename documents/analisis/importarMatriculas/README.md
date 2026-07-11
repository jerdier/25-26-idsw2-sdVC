# CGU > importarMatriculas > Análisis

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Índice Análisis](../README.md) | **Análisis** | [Diseño](../../diseño/importarMatriculas/README.md) | [Desarrollo](../../desarrollo/importarMatriculas/README.md) |
> |---|---|---|---|---|---|

**Actor:** Secretaria

Permite a la Secretaria importar información de matrículas desde un archivo Excel o CSV. El sistema procesa cada registro del archivo y crea o actualiza la matrícula correspondiente en la base de datos.


---

## Diagrama de colaboración

| ![colaboracion](../../../images/analisis/importarMatriculas/colaboracion.svg) |
| :--- |
| [colaboracion.puml](../../../modelosUML/analisis/importarMatriculas/colaboracion.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| ImportarMatriculasView | Vista |
| MatriculaController | Controlador |
| MatriculaRepository | Modelo |
| Matricula | Modelo |

---

## Flujo de colaboración

1. La Secretaria solicita importar la información de matrículas → se activa `ImportarMatriculasView`
2. La Secretaria adjunta el archivo y confirma → `ImportarMatriculasView` invoca `MatriculaController.importarMatriculas(archivo)` para iniciar el proceso de importación
3. `MatriculaController` procesa cada fila del archivo y delega la persistencia en `MatriculaRepository` invocando `crearOActualizar(datosMatricula)` por cada registro
4. `MatriculaRepository` crea o actualiza el registro correspondiente en la entidad `Matricula`
