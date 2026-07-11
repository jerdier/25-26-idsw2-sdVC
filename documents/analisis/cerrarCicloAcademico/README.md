# CGU > cerrarCicloAcademico > Análisis

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Índice Análisis](../README.md) | **Análisis** | [Diseño](../../diseño/cerrarCicloAcademico/README.md) | [Desarrollo](../../desarrollo/cerrarCicloAcademico/README.md) |
> |---|---|---|---|---|---|

**Actor:** Secretaria

Permite a la Secretaria cerrar el ciclo académico activo, marcando todas las matrículas del ciclo como históricas. Es una operación de cierre definitivo que consolida el estado de las matrículas al final del periodo lectivo.


---

## Diagrama de colaboración

| ![colaboracion](../../../images/analisis/cerrarCicloAcademico/colaboracion.svg) |
| :--- |
| [colaboracion.puml](../../../modelosUML/analisis/cerrarCicloAcademico/colaboracion.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| CerrarCicloAcademicoView | Vista |
| MatriculaController | Controlador |
| MatriculaRepository | Modelo |
| Matricula | Modelo |

---

## Flujo de colaboración

1. La Secretaria se encuentra en el módulo de matrículas y solicita cerrar el ciclo académico → se activa `CerrarCicloAcademicoView`
2. `CerrarCicloAcademicoView` solicita a `MatriculaController` ejecutar el cierre mediante `cerrarCicloAcademico()`
3. `MatriculaController` ordena a `MatriculaRepository` cambiar el estado de todas las matrículas invocando `actualizarEstado(Historica)`
4. `MatriculaRepository` persiste el cambio de estado en la entidad `Matricula`
