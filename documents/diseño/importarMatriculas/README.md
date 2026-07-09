# CGU > importarMatriculas > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/importarMatriculas/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** Secretaria

Permite a la Secretaria importar matrículas desde un archivo Excel o CSV. El Frontend (Vue 3) sube el archivo al controlador (Express), y el servicio procesa los registros para insertarlos o actualizarlos en la base de datos (PostgreSQL).

---

## Diagrama de secuencia

| ![secuencia](../../../images/diseño/importarMatriculas/secuencia.svg) |
| :--- |
| [secuencia.puml](../../../modelosUML/diseño/importarMatriculas/secuencia.puml) |

---

## Clases

| Clase | Tipo |
|-------|------|
| Frontend (Vue 3) | Vista |
| SecretariaController | Controlador |
| SecretariaService | Servicio |
| Base de Datos (PostgreSQL) | Base de Datos |
| Alumno | Modelo |
| Matricula | Modelo |

---

## Flujo de secuencia

1. La Secretaria Academica selecciona archivo de matrículas (CSV / Excel) en el Frontend (Vue 3).
2. El Frontend (Vue 3) realiza una petición HTTP POST a `/api/secretaria/import/matriculas (multipart/form-data: archivo)` al Controlador (`SecretariaController`).
3. El Controlador (`SecretariaController`) delega la lógica en el Servicio (`SecretariaService`) llamando a `validarArchivo(archivo)`.
4. El SecretariaService retorna el resultado `valido : Boolean` al Controlador (`SecretariaController`).
5. **ALT archivo válido**:
  - El Controlador (`SecretariaController`) delega la lógica en el Servicio (`SecretariaService`) llamando a `importMatriculas(archivo)`.
  - El Servicio (`SecretariaService`) realiza una consulta a la Base de Datos (PostgreSQL): `SELECT * FROM Alumno WHERE dni = ?`.
  - La Base de Datos retorna el resultado `alumno : Alumno` al Servicio (`SecretariaService`).
  - El Servicio (`SecretariaService`) realiza una consulta a la Base de Datos (PostgreSQL): `INSERT INTO Matricula (alumnoId, asignaturaId) ON CONFLICT DO UPDATE`.
  - La Base de Datos retorna el resultado `resultados : { creadas, actualizadas, errores }` al Servicio (`SecretariaService`).
  - El SecretariaService retorna el resultado `informe : ImportResult` al Controlador (`SecretariaController`).
  - El Controlador (`SecretariaController`) responde al Frontend (Vue 3) con un estado `200 OK` con los datos `{ informe }`.
  - El Frontend (Vue 3) muestra informe de importación (creadas, actualizadas, errores) a la Secretaria Academica.
6. **Else / De lo contrario**:
  - El Controlador (`SecretariaController`) responde al Frontend (Vue 3) con un estado `400 Bad` con los datos `Request { message: "Formato de archivo no válido" }`.
  - El Frontend (Vue 3) muestra error de formato a la Secretaria Academica.
