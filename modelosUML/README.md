# Modelos UML

[Inicio](../README.md) · [Imágenes SVG](../images/README.md) · [Documentos](../documents/README.md)

Fuentes PlantUML de todos los diagramas del proyecto, organizados por fase y caso de uso.

---

## Análisis

[índice completo de análisis](analisis/README.md)

Diagramas de colaboración MVC. Cada caso contiene:
- `colaboracion.puml` -- Diagrama de colaboración (Boundary / Control / Entity)

| Caso de uso | Actores | Colaboración |
|-------------|---------|-------------|
| `crearUsuario()` | Administrador | [puml](analisis/crearUsuario/colaboracion.puml) |
| `consultarUsuario()` | Administrador | [puml](analisis/consultarUsuario/colaboracion.puml) |
| `editarUsuario()` | Administrador | [puml](analisis/editarUsuario/colaboracion.puml) |
| `crearSesionClase()` | Profesor | [puml](analisis/crearSesionClase/colaboracion.puml) |
| `editarSesionClase()` | Profesor | [puml](analisis/editarSesionClase/colaboracion.puml) |
| `cerrarSesionClase()` | Profesor | [puml](analisis/cerrarSesionClase/colaboracion.puml) |
| `registrarTomaAsistencia()` | Profesor | [puml](analisis/registrarTomaAsistencia/colaboracion.puml) |
| `exportarHistorialAsistencias()` | Profesor | [puml](analisis/exportarHistorialAsistencias/colaboracion.puml) |
| `consultarDetalleAlumno()` | Profesor | [puml](analisis/consultarDetalleAlumno/colaboracion.puml) |
| `importarListasAlumnos()` | SecretariaAcadémica | [puml](analisis/importarListasAlumnos/colaboracion.puml) |
| `importarMatricula()` | SecretariaAcadémica | [puml](analisis/importarMatricula/colaboracion.puml) |
| `consultarDetalleMatricula()` | SecretariaAcadémica | [puml](analisis/consultarDetalleMatricula/colaboracion.puml) |
| `exportarDispensas()` | SecretariaAcadémica | [puml](analisis/exportarDispensas/colaboracion.puml) |
| `crearSolicitudDispensa()` | Alumno Â· Secretaria | [puml](analisis/crearSolicitudDispensa/colaboracion.puml) |
| `editarSolicitudDispensa()` | Alumno Â· Secretaria Â· Director | [puml](analisis/editarSolicitudDispensa/colaboracion.puml) |
| `consultarSolicitudDispensa()` | Profesor Â· Secretaria | [puml](analisis/consultarSolicitudDispensa/colaboracion.puml) |
| `consultarListaAlumnos()` | Profesor Â· Secretaria | [puml](analisis/consultarListaAlumnos/colaboracion.puml) |
| `guardarSolicitudDispensa()` | Secretaria Â· Director | [puml](analisis/guardarSolicitudDispensa/colaboracion.puml) |

---

## Diseño

[índice completo de diseño](diseño/README.md)

Diagramas de secuencia con tecnología concreta (Vue / Express / Prisma). Cada caso contiene:
- `secuencia.puml` -- Diagrama de secuencia de diseño

| Caso de uso | Actores | Secuencia |
|-------------|---------|-----------|
| `crearUsuario()` | Administrador | [puml](diseño/crearUsuario/secuencia.puml) |
| `consultarUsuario()` | Administrador | [puml](diseño/consultarUsuario/secuencia.puml) |
| `editarUsuario()` | Administrador | [puml](diseño/editarUsuario/secuencia.puml) |
| `crearSesionClase()` | Profesor | [puml](diseño/crearSesionClase/secuencia.puml) |
| `editarSesionClase()` | Profesor | [puml](diseño/editarSesionClase/secuencia.puml) |
| `cerrarSesionClase()` | Profesor | [puml](diseño/cerrarSesionClase/secuencia.puml) |
| `registrarTomaAsistencia()` | Profesor | [puml](diseño/registrarTomaAsistencia/secuencia.puml) |
| `exportarHistorialAsistencias()` | Profesor | [puml](diseño/exportarHistorialAsistencias/secuencia.puml) |
| `consultarDetalleAlumno()` | Profesor | [puml](diseño/consultarDetalleAlumno/secuencia.puml) |
| `importarListasAlumnos()` | SecretariaAcadémica | [puml](diseño/importarListasAlumnos/secuencia.puml) |
| `importarMatricula()` | SecretariaAcadémica | [puml](diseño/importarMatricula/secuencia.puml) |
| `consultarDetalleMatricula()` | SecretariaAcadémica | [puml](diseño/consultarDetalleMatricula/secuencia.puml) |
| `exportarDispensas()` | SecretariaAcadémica | [puml](diseño/exportarDispensas/secuencia.puml) |
| `crearSolicitudDispensa()` | Alumno Â· Secretaria | [puml](diseño/crearSolicitudDispensa/secuencia.puml) |
| `editarSolicitudDispensa()` | Alumno Â· Secretaria Â· Director | [puml](diseño/editarSolicitudDispensa/secuencia.puml) |
| `consultarSolicitudDispensa()` | Profesor Â· Secretaria | [puml](diseño/consultarSolicitudDispensa/secuencia.puml) |
| `consultarListaAlumnos()` | Profesor Â· Secretaria | [puml](diseño/consultarListaAlumnos/secuencia.puml) |
| `guardarSolicitudDispensa()` | Secretaria Â· Director | [puml](diseño/guardarSolicitudDispensa/secuencia.puml) |