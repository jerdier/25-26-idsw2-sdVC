# CGU > importarAlumnos > Diseño

> | [Inicio](../../../README.md) | [Requisitado](../../requisitado/README.md) | [Análisis](../../analisis/importarAlumnos/README.md) | [Índice Diseño](../README.md) | **Diseño** |
> |---|---|---|---|---|

**Actor:** Secretaria

El Frontend (Vue 3) sube el archivo al controlador Express como `multipart/form-data`. El servicio valida el formato y procesa cada fila insertando o actualizando los alumnos en PostgreSQL.

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

1. La Secretaria selecciona el archivo (CSV / Excel) en el Frontend
2. Frontend → `POST /api/secretaria/import/alumnos (multipart/form-data)` → `SecretariaController.importarAlumnos(archivo)`
3. `SecretariaService` valida el formato del archivo
4. Si el archivo es válido → `INSERT INTO Alumno (...) ON CONFLICT (dni) DO UPDATE` por cada fila → Frontend muestra informe (creados, actualizados, errores)
5. Si el archivo no es válido → Frontend muestra error "Formato de archivo no válido" con `400 Bad Request`
