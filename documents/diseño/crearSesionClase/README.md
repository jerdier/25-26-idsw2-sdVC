# CGU > crearSesionClase > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/crearSesionClase/README.md) | [Índice Diseño](../README.md) | **Diseño** | [Desarrollo](../../desarrollo/crearSesionClase/README.md) |
> |---|---|---|---|---|---|

**Actor:** Profesor

El Frontend (Vue 3) carga las asignaturas del profesor desde Express y luego envía los datos de la nueva sesión para que el servicio la registre en PostgreSQL con estado ACTIVA.

---

## Diagrama de secuencia

| ![secuencia](../../../images/diseño/crearSesionClase/secuencia.svg) |
| :--- |
| [secuencia.puml](../../../modelosUML/diseño/crearSesionClase/secuencia.puml) |

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

1. El Profesor abre el formulario de nueva sesión en el Frontend
2. Frontend → `GET /api/academic/profesor/:profesorId/asignaturas` → `AcademicController.getTeacherAsignaturas(profesorId)`
3. `AcademicService` consulta: `SELECT * FROM Asignatura WHERE profesorId = ? INCLUDE Grado`
4. Frontend muestra el selector de asignatura y el formulario
5. El Profesor selecciona asignatura e introduce fecha, aula y duración, y confirma
6. Frontend → `POST /api/academic/sessions { asignaturaId, fecha, aula, duracion }` → `AcademicController.createSession(...)`
7. `AcademicService` ejecuta: `INSERT INTO SesionDeClase (asignaturaId, fecha, aula, duracion, estado) VALUES (?, ?, ?, ?, 'ACTIVA')`
8. Frontend muestra confirmación "sesión creada correctamente" con `201 Created`
