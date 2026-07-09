# CGU > editarSesionClase > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/editarSesionClase/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** Profesor

El Frontend (Vue 3) precarga los datos actuales de la sesión y las asignaturas disponibles desde Express, y envía los cambios para que el servicio actualice el registro en PostgreSQL.

---

## Diagrama de secuencia

| ![secuencia](../../../images/diseño/editarSesionClase/secuencia.svg) |
| :--- |
| [secuencia.puml](../../../modelosUML/diseño/editarSesionClase/secuencia.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| Frontend (Vue 3) | Vista |
| AcademicController | Controlador |
| AcademicService | Servicio |
| Base de Datos (PostgreSQL) | Base de Datos |
| Asignatura | Modelo |
| SesionDeClase | Modelo |

---

## Flujo de secuencia

1. El Profesor selecciona la sesión a editar en el Frontend
2. Frontend → `GET /api/academic/sessions/:sesionId` → `AcademicController.getSession(sesionId)`
3. `AcademicService` consulta: `SELECT * FROM SesionDeClase WHERE id = ?`
4. Frontend → `GET /api/academic/teacher/:profesorId/asignaturas` → `AcademicController.getTeacherAsignaturas(profesorId)`
5. `AcademicService` consulta: `SELECT * FROM Asignatura WHERE profesorId = ? INCLUDE Grado`
6. Frontend muestra el formulario precargado con los datos actuales y el selector de asignaturas
7. El Profesor confirma los cambios (asignaturaId, fecha, aula, duración)
8. Frontend → `PUT /api/academic/sessions/:sesionId { asignaturaId, fecha, aula, duracion }` → `AcademicController.updateSession(...)`
9. `AcademicService` ejecuta: `UPDATE SesionDeClase SET asignaturaId=?, fecha=?, aula=?, duracion=? WHERE id=?`
10. Frontend muestra la sesión con los cambios aplicados
