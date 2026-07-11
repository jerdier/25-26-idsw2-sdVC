# CGU > cerrarSesionClase > Análisis

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Índice Análisis](../README.md) | **Análisis** | [Diseño](../../diseño/cerrarSesionClase/README.md) | [Desarrollo](../../desarrollo/cerrarSesionClase/README.md) |
> |---|---|---|---|---|---|

**Actor:** Profesor

Permite al Profesor dar por concluida una sesión de clase activa. El sistema cambia el estado de la sesión a cerrada, finalizando el periodo en el que se podía registrar asistencia.


---

## Diagrama de colaboración

| ![colaboracion](../../../images/analisis/cerrarSesionClase/colaboracion.svg) |
| :--- |
| [colaboracion.puml](../../../modelosUML/analisis/cerrarSesionClase/colaboracion.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| CerrarSesionClaseView | Vista |
| SesionClaseController | Controlador |
| SesionClaseRepository | Modelo |
| SesionDeClase | Modelo |

---

## Flujo de colaboración

1. El Profesor se encuentra en una sesión activa y solicita cerrarla → se activa `CerrarSesionClaseView`
2. `CerrarSesionClaseView` solicita a `SesionClaseController` cerrar la sesión mediante `cerrarSesionClase(sesionId)`
3. `SesionClaseController` ordena a `SesionClaseRepository` cambiar el estado invocando `actualizarEstado(CERRADA)`
4. `SesionClaseRepository` persiste el cambio de estado en la entidad `SesionDeClase`
