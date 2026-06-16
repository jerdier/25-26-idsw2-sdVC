# Modelos UML

[← Inicio](../README.md) · [Imágenes SVG](../images/README.md) · [Documentos](../documents/README.md)

Fuentes PlantUML de todos los diagramas del proyecto, organizados por fase y caso de uso.

---

## Análisis

[→ Índice completo de análisis](analisis/README.md)

Diagramas de colaboración MVC. Cada caso contiene:
- `colaboracion.puml` — Diagrama de colaboración (Boundary / Control / Entity)

| Caso de uso | Actor | Colaboración |
|-------------|-------|-------------|
| `crearUsuario()` | Administrador | [puml](analisis/crearUsuario/colaboracion.puml) |
| `consultarUsuario()` | Administrador | [puml](analisis/consultarUsuario/colaboracion.puml) |
| `editarUsuario()` | Administrador | [puml](analisis/editarUsuario/colaboracion.puml) |
| `crearSolicitudDispensaAlumno()` | Alumno | [puml](analisis/crearSolicitudDispensaAlumno/colaboracion.puml) |
| `consultarEstadoDispensa()` | Alumno | [puml](analisis/consultarEstadoDispensa/colaboracion.puml) |
| `editarSolicitudDispensaAlumno()` | Alumno | [puml](analisis/editarSolicitudDispensaAlumno/colaboracion.puml) |
| `crearSesionClase()` | Profesor | [puml](analisis/crearSesionClase/colaboracion.puml) |
| `editarSesionClase()` | Profesor | [puml](analisis/editarSesionClase/colaboracion.puml) |
| `cerrarSesionClase()` | Profesor | [puml](analisis/cerrarSesionClase/colaboracion.puml) |
| `registrarTomaAsistencia()` | Profesor | [puml](analisis/registrarTomaAsistencia/colaboracion.puml) |
| `exportarHistorialAsistencias()` | Profesor | [puml](analisis/exportarHistorialAsistencias/colaboracion.puml) |
| `consultarListaAlumnosProfesor()` | Profesor | [puml](analisis/consultarListaAlumnosProfesor/colaboracion.puml) |
| `consultarDetalleAlumno()` | Profesor | [puml](analisis/consultarDetalleAlumno/colaboracion.puml) |
| `consultarSolicitudDispensaProfesor()` | Profesor | [puml](analisis/consultarSolicitudDispensaProfesor/colaboracion.puml) |
| `importarListasAlumnos()` | SecretariaAcademica | [puml](analisis/importarListasAlumnos/colaboracion.puml) |
| `consultarListaAlumnosSecretaria()` | SecretariaAcademica | [puml](analisis/consultarListaAlumnosSecretaria/colaboracion.puml) |
| `importarAlumnos()` | SecretariaAcademica | [puml](analisis/importarAlumnos/colaboracion.puml) |
| `verDetalleAlumno()` | SecretariaAcademica | [puml](analisis/verDetalleAlumno/colaboracion.puml) |
| `importarMatriculas()` | SecretariaAcademica | [puml](analisis/importarMatriculas/colaboracion.puml) |
| `consultarDetalleMatricula()` | SecretariaAcademica | [puml](analisis/consultarDetalleMatricula/colaboracion.puml) |
| `crearSolicitudDispensaSecretaria()` | SecretariaAcademica | [puml](analisis/crearSolicitudDispensaSecretaria/colaboracion.puml) |
| `consultarSolicitudDispensaSecretaria()` | SecretariaAcademica | [puml](analisis/consultarSolicitudDispensaSecretaria/colaboracion.puml) |
| `editarSolicitudDispensaSecretaria()` | SecretariaAcademica | [puml](analisis/editarSolicitudDispensaSecretaria/colaboracion.puml) |
| `guardarSolicitudDispensaSecretaria()` | SecretariaAcademica | [puml](analisis/guardarSolicitudDispensaSecretaria/colaboracion.puml) |
| `cerrarSolicitudDispensaSecretaria()` | SecretariaAcademica | [puml](analisis/cerrarSolicitudDispensaSecretaria/colaboracion.puml) |
| `exportarDispensas()` | SecretariaAcademica | [puml](analisis/exportarDispensas/colaboracion.puml) |
| `consultarSolicitudesDispensa()` | DirectorDeGrado | [puml](analisis/consultarSolicitudesDispensa/colaboracion.puml) |
| `editarSolicitudDispensaDirector()` | DirectorDeGrado | [puml](analisis/editarSolicitudDispensaDirector/colaboracion.puml) |
| `guardarSolicitudDispensaDirector()` | DirectorDeGrado | [puml](analisis/guardarSolicitudDispensaDirector/colaboracion.puml) |

---

## Diseño

[→ Índice completo de diseño](diseño/README.md)

Diagramas de secuencia con tecnología concreta (Vue / Express / Prisma). Cada caso contiene:
- `secuencia.puml` — Diagrama de secuencia de diseño

| Caso de uso | Actor | Secuencia |
|-------------|-------|-----------|
| `crearUsuario()` | Administrador | [puml](diseño/crearUsuario/secuencia.puml) |
| `consultarUsuario()` | Administrador | [puml](diseño/consultarUsuario/secuencia.puml) |
| `editarUsuario()` | Administrador | [puml](diseño/editarUsuario/secuencia.puml) |
| `crearSolicitudDispensaAlumno()` | Alumno | [puml](diseño/crearSolicitudDispensaAlumno/secuencia.puml) |
| `consultarEstadoDispensa()` | Alumno | [puml](diseño/consultarEstadoDispensa/secuencia.puml) |
| `editarSolicitudDispensaAlumno()` | Alumno | [puml](diseño/editarSolicitudDispensaAlumno/secuencia.puml) |
| `crearSesionClase()` | Profesor | [puml](diseño/crearSesionClase/secuencia.puml) |
| `editarSesionClase()` | Profesor | [puml](diseño/editarSesionClase/secuencia.puml) |
| `cerrarSesionClase()` | Profesor | [puml](diseño/cerrarSesionClase/secuencia.puml) |
| `registrarTomaAsistencia()` | Profesor | [puml](diseño/registrarTomaAsistencia/secuencia.puml) |
| `exportarHistorialAsistencias()` | Profesor | [puml](diseño/exportarHistorialAsistencias/secuencia.puml) |
| `consultarListaAlumnosProfesor()` | Profesor | [puml](diseño/consultarListaAlumnosProfesor/secuencia.puml) |
| `consultarDetalleAlumno()` | Profesor | [puml](diseño/consultarDetalleAlumno/secuencia.puml) |
| `consultarSolicitudDispensaProfesor()` | Profesor | [puml](diseño/consultarSolicitudDispensaProfesor/secuencia.puml) |
| `importarListasAlumnos()` | SecretariaAcademica | [puml](diseño/importarListasAlumnos/secuencia.puml) |
| `consultarListaAlumnosSecretaria()` | SecretariaAcademica | [puml](diseño/consultarListaAlumnosSecretaria/secuencia.puml) |
| `importarAlumnos()` | SecretariaAcademica | [puml](diseño/importarAlumnos/secuencia.puml) |
| `verDetalleAlumno()` | SecretariaAcademica | [puml](diseño/verDetalleAlumno/secuencia.puml) |
| `importarMatriculas()` | SecretariaAcademica | [puml](diseño/importarMatriculas/secuencia.puml) |
| `consultarDetalleMatricula()` | SecretariaAcademica | [puml](diseño/consultarDetalleMatricula/secuencia.puml) |
| `crearSolicitudDispensaSecretaria()` | SecretariaAcademica | [puml](diseño/crearSolicitudDispensaSecretaria/secuencia.puml) |
| `consultarSolicitudDispensaSecretaria()` | SecretariaAcademica | [puml](diseño/consultarSolicitudDispensaSecretaria/secuencia.puml) |
| `editarSolicitudDispensaSecretaria()` | SecretariaAcademica | [puml](diseño/editarSolicitudDispensaSecretaria/secuencia.puml) |
| `guardarSolicitudDispensaSecretaria()` | SecretariaAcademica | [puml](diseño/guardarSolicitudDispensaSecretaria/secuencia.puml) |
| `cerrarSolicitudDispensaSecretaria()` | SecretariaAcademica | [puml](diseño/cerrarSolicitudDispensaSecretaria/secuencia.puml) |
| `exportarDispensas()` | SecretariaAcademica | [puml](diseño/exportarDispensas/secuencia.puml) |
| `consultarSolicitudesDispensa()` | DirectorDeGrado | [puml](diseño/consultarSolicitudesDispensa/secuencia.puml) |
| `editarSolicitudDispensaDirector()` | DirectorDeGrado | [puml](diseño/editarSolicitudDispensaDirector/secuencia.puml) |
| `guardarSolicitudDispensaDirector()` | DirectorDeGrado | [puml](diseño/guardarSolicitudDispensaDirector/secuencia.puml) |
