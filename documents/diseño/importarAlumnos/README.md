# CGU > importarAlumnos > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/importarAlumnos/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** Secretaria

Permite a la Secretaria importar un listado de alumnos desde un archivo Excel o CSV. El Frontend (Vue 3) sube el archivo al controlador (Express), y el servicio procesa los registros para insertarlos o actualizarlos en la base de datos (PostgreSQL).

---

## Diagrama de secuencia

| ![secuencia](../../../images/diseño/importarAlumnos/secuencia.svg) |
| :--- |
| [secuencia.puml](../../../modelosUML/diseño/importarAlumnos/secuencia.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| Frontend (Vue 3) | Vista |
| SecretariaController | Controlador |
| SecretariaService | Servicio |
| Base de Datos (PostgreSQL) | Base de Datos |
| Alumno | Modelo |

---

## Flujo de secuencia

1. La Secretaria Academica selecciona archivo de alumnos (CSV / Excel) en el Frontend (Vue 3).
2. El Frontend (Vue 3) realiza una petición HTTP POST a `/api/secretaria/import/alumnos (multipart/form-data: archivo)` al Controlador (`SecretariaController`).
3. El Controlador (`SecretariaController`) delega la lógica en el Servicio (`SecretariaService`) llamando a `validarArchivo(archivo)`.
4. El SecretariaService retorna el resultado `valido : Boolean` al Controlador (`SecretariaController`).
5. **ALT archivo válido**:
  - El Controlador (`SecretariaController`) delega la lógica en el Servicio (`SecretariaService`) llamando a `importAlumnos(archivo)`.
  - El Servicio (`SecretariaService`) realiza una consulta a la Base de Datos (PostgreSQL): `INSERT INTO Alumno (nombre, email, dni, ...) ON CONFLICT (dni) DO UPDATE`.
  - La Base de Datos retorna el resultado `resultados : { creados, actualizados, errores }` al Servicio (`SecretariaService`).
  - El SecretariaService retorna el resultado `informe : ImportResult` al Controlador (`SecretariaController`).
  - El Controlador (`SecretariaController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ informe }`.
  - El Frontend (Vue 3) muestra informe de importación (creados, actualizados, errores) a la Secretaria Academica.
6. **Else / De lo contrario**:
  - El Controlador (`SecretariaController`) responde al Frontend (Vue 3) con un estado `400 Bad` con los datos `Request { message: "Formato de archivo no válido" }`.
  - El Frontend (Vue 3) muestra error de formato a la Secretaria Academica.
