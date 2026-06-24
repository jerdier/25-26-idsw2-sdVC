# CGU > importarMatriculas > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/importarMatriculas/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** SecretariaAcademica

---

## información del artefacto

| Campo | Valor |
|-------|-------|
| **Proyecto** | CGU - Centro de Gestión Universitaria |
| **Disciplina** | Análisis y Diseño |

---

## diagrama de secuencia

![secuencia](../../../images/diseño/importarMatriculas/secuencia.svg)

> fuente: [secuencia.puml](../../../modelosUML/diseño/importarMatriculas/secuencia.puml)

---

## clases de diseño identificadas

### frontend (Vue 3)

| Clase | Responsabilidad |
|-------|----------------|
| `SecretariaDashboard.vue` | Presenta el selector de archivo y muestra el informe de resultados tras la importación |

### backend (Express + TypeScript)

| Clase | Responsabilidad |
|-------|----------------|
| `SecretariaController` | Recibe el archivo en formato `multipart/form-data` y delega la validación e importación en el servicio |
| `SecretariaService` | Valida el archivo, localiza el alumno por DNI y persiste la matrícula con `INSERT ... ON CONFLICT DO UPDATE` |

### base de datos (PostgreSQL)

| Tabla | Responsabilidad |
|-------|----------------|
| `Alumno` | Se consulta por DNI para obtener el `alumnoId` necesario para crear la matrícula |
| `Matricula` | Destino de los datos importados; se crea o actualiza la relación alumno-asignatura |

---

## flujo de secuencia

1. La Secretaria selecciona el archivo de matrículas (CSV / Excel).
2. El frontend llama `POST /api/secretaria/import/matriculas` con el archivo en `multipart/form-data`.
3. `SecretariaController` → `SecretariaService.validarArchivo(archivo)` → devuelve `valido : Boolean`.
4. **[Archivo válido]** `SecretariaController` → `SecretariaService.importMatriculas(archivo)`.
5. `SecretariaService` ejecuta por cada fila `SELECT * FROM Alumno WHERE dni = ?` para obtener el `alumnoId`.
6. `SecretariaService` ejecuta `INSERT INTO Matricula (alumnoId, asignaturaId) ON CONFLICT DO UPDATE` → acumula resultados.
7. `SecretariaService` devuelve `informe : { creadas, actualizadas, errores }`.
8. `SecretariaController` responde `200 OK { informe }` → el frontend muestra el informe de importación.
9. **[Archivo inválido]** `SecretariaController` responde `400 Bad Request { message: "Formato de archivo no válido" }` → el frontend muestra el error.

---

## referencias

- [Índice de diseño](../README.md)
- [Análisis de este caso](../../analisis/importarMatriculas/README.md)
- [Modelo del dominio](../../requisitado/00-modelo-del-dominio/README.md)
- [secuencia.puml](../../../modelosUML/diseño/importarMatriculas/secuencia.puml)
