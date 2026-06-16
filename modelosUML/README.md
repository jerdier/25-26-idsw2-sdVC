# Modelos UML

[← Inicio](../README.md) · [Imágenes SVG](../images/README.md) · [Documentos](../documents/README.md)

Fuentes PlantUML de todos los diagramas del proyecto, organizados por fase y caso de uso.

---

## Análisis

[→ Índice completo de análisis](analisis/casos-uso/README.md)

Diagramas de colaboración MVC. Cada caso contiene:
- `colaboracion.puml` — Diagrama de colaboración (Boundary / Control / Entity)

| Caso de uso | Actor | Colaboración |
|-------------|-------|-------------|
| `crearUsuario()` | Administrador | [puml](analisis/casos-uso/crearUsuario/colaboracion.puml) |
| `consultarUsuario()` | Administrador | [puml](analisis/casos-uso/consultarUsuario/colaboracion.puml) |
| `editarUsuario()` | Administrador | [puml](analisis/casos-uso/editarUsuario/colaboracion.puml) |
| `crearSolicitudDispensaAlumno()` | Alumno | [puml](analisis/casos-uso/crearSolicitudDispensaAlumno/colaboracion.puml) |
| `consultarEstadoDispensa()` | Alumno | [puml](analisis/casos-uso/consultarEstadoDispensa/colaboracion.puml) |
| `editarSolicitudDispensaAlumno()` | Alumno | [puml](analisis/casos-uso/editarSolicitudDispensaAlumno/colaboracion.puml) |
| `crearSesionClase()` | Profesor | [puml](analisis/casos-uso/crearSesionClase/colaboracion.puml) |
| `editarSesionClase()` | Profesor | [puml](analisis/casos-uso/editarSesionClase/colaboracion.puml) |
| `cerrarSesionClase()` | Profesor | [puml](analisis/casos-uso/cerrarSesionClase/colaboracion.puml) |
| `registrarTomaAsistencia()` | Profesor | [puml](analisis/casos-uso/registrarTomaAsistencia/colaboracion.puml) |
| `exportarHistorialAsistencias()` | Profesor | [puml](analisis/casos-uso/exportarHistorialAsistencias/colaboracion.puml) |
| `consultarListaAlumnosProfesor()` | Profesor | [puml](analisis/casos-uso/consultarListaAlumnosProfesor/colaboracion.puml) |
| `consultarDetalleAlumno()` | Profesor | [puml](analisis/casos-uso/consultarDetalleAlumno/colaboracion.puml) |
| `consultarSolicitudDispensaProfesor()` | Profesor | [puml](analisis/casos-uso/consultarSolicitudDispensaProfesor/colaboracion.puml) |
| `importarListasAlumnos()` | SecretariaAcademica | [puml](analisis/casos-uso/importarListasAlumnos/colaboracion.puml) |
| `consultarListaAlumnosSecretaria()` | SecretariaAcademica | [puml](analisis/casos-uso/consultarListaAlumnosSecretaria/colaboracion.puml) |
| `importarAlumnos()` | SecretariaAcademica | [puml](analisis/casos-uso/importarAlumnos/colaboracion.puml) |
| `verDetalleAlumno()` | SecretariaAcademica | [puml](analisis/casos-uso/verDetalleAlumno/colaboracion.puml) |
| `importarMatriculas()` | SecretariaAcademica | [puml](analisis/casos-uso/importarMatriculas/colaboracion.puml) |
| `consultarDetalleMatricula()` | SecretariaAcademica | [puml](analisis/casos-uso/consultarDetalleMatricula/colaboracion.puml) |
| `crearSolicitudDispensaSecretaria()` | SecretariaAcademica | [puml](analisis/casos-uso/crearSolicitudDispensaSecretaria/colaboracion.puml) |
| `consultarSolicitudDispensaSecretaria()` | SecretariaAcademica | [puml](analisis/casos-uso/consultarSolicitudDispensaSecretaria/colaboracion.puml) |
| `editarSolicitudDispensaSecretaria()` | SecretariaAcademica | [puml](analisis/casos-uso/editarSolicitudDispensaSecretaria/colaboracion.puml) |
| `guardarSolicitudDispensaSecretaria()` | SecretariaAcademica | [puml](analisis/casos-uso/guardarSolicitudDispensaSecretaria/colaboracion.puml) |
| `cerrarSolicitudDispensaSecretaria()` | SecretariaAcademica | [puml](analisis/casos-uso/cerrarSolicitudDispensaSecretaria/colaboracion.puml) |
| `exportarDispensas()` | SecretariaAcademica | [puml](analisis/casos-uso/exportarDispensas/colaboracion.puml) |
| `consultarSolicitudesDispensa()` | DirectorDeGrado | [puml](analisis/casos-uso/consultarSolicitudesDispensa/colaboracion.puml) |
| `editarSolicitudDispensaDirector()` | DirectorDeGrado | [puml](analisis/casos-uso/editarSolicitudDispensaDirector/colaboracion.puml) |
| `guardarSolicitudDispensaDirector()` | DirectorDeGrado | [puml](analisis/casos-uso/guardarSolicitudDispensaDirector/colaboracion.puml) |

---

## Diseño

[→ Índice completo de diseño](diseño/casos-uso/README.md)

Diagramas de secuencia con tecnología concreta (Vue / Express / Prisma). Cada caso contiene:
- `secuencia.puml` — Diagrama de secuencia de diseño

| Caso de uso | Actor | Secuencia |
|-------------|-------|-----------|
| `crearUsuario()` | Administrador | [puml](diseño/casos-uso/crearUsuario/secuencia.puml) |
| `consultarUsuario()` | Administrador | [puml](diseño/casos-uso/consultarUsuario/secuencia.puml) |
| `editarUsuario()` | Administrador | [puml](diseño/casos-uso/editarUsuario/secuencia.puml) |
| `crearSolicitudDispensaAlumno()` | Alumno | [puml](diseño/casos-uso/crearSolicitudDispensaAlumno/secuencia.puml) |
| `consultarEstadoDispensa()` | Alumno | [puml](diseño/casos-uso/consultarEstadoDispensa/secuencia.puml) |
| `editarSolicitudDispensaAlumno()` | Alumno | [puml](diseño/casos-uso/editarSolicitudDispensaAlumno/secuencia.puml) |
| `crearSesionClase()` | Profesor | [puml](diseño/casos-uso/crearSesionClase/secuencia.puml) |
| `editarSesionClase()` | Profesor | [puml](diseño/casos-uso/editarSesionClase/secuencia.puml) |
| `cerrarSesionClase()` | Profesor | [puml](diseño/casos-uso/cerrarSesionClase/secuencia.puml) |
| `registrarTomaAsistencia()` | Profesor | [puml](diseño/casos-uso/registrarTomaAsistencia/secuencia.puml) |
| `exportarHistorialAsistencias()` | Profesor | [puml](diseño/casos-uso/exportarHistorialAsistencias/secuencia.puml) |
| `consultarListaAlumnosProfesor()` | Profesor | [puml](diseño/casos-uso/consultarListaAlumnosProfesor/secuencia.puml) |
| `consultarDetalleAlumno()` | Profesor | [puml](diseño/casos-uso/consultarDetalleAlumno/secuencia.puml) |
| `consultarSolicitudDispensaProfesor()` | Profesor | [puml](diseño/casos-uso/consultarSolicitudDispensaProfesor/secuencia.puml) |
| `importarListasAlumnos()` | SecretariaAcademica | [puml](diseño/casos-uso/importarListasAlumnos/secuencia.puml) |
| `consultarListaAlumnosSecretaria()` | SecretariaAcademica | [puml](diseño/casos-uso/consultarListaAlumnosSecretaria/secuencia.puml) |
| `importarAlumnos()` | SecretariaAcademica | [puml](diseño/casos-uso/importarAlumnos/secuencia.puml) |
| `verDetalleAlumno()` | SecretariaAcademica | [puml](diseño/casos-uso/verDetalleAlumno/secuencia.puml) |
| `importarMatriculas()` | SecretariaAcademica | [puml](diseño/casos-uso/importarMatriculas/secuencia.puml) |
| `consultarDetalleMatricula()` | SecretariaAcademica | [puml](diseño/casos-uso/consultarDetalleMatricula/secuencia.puml) |
| `crearSolicitudDispensaSecretaria()` | SecretariaAcademica | [puml](diseño/casos-uso/crearSolicitudDispensaSecretaria/secuencia.puml) |
| `consultarSolicitudDispensaSecretaria()` | SecretariaAcademica | [puml](diseño/casos-uso/consultarSolicitudDispensaSecretaria/secuencia.puml) |
| `editarSolicitudDispensaSecretaria()` | SecretariaAcademica | [puml](diseño/casos-uso/editarSolicitudDispensaSecretaria/secuencia.puml) |
| `guardarSolicitudDispensaSecretaria()` | SecretariaAcademica | [puml](diseño/casos-uso/guardarSolicitudDispensaSecretaria/secuencia.puml) |
| `cerrarSolicitudDispensaSecretaria()` | SecretariaAcademica | [puml](diseño/casos-uso/cerrarSolicitudDispensaSecretaria/secuencia.puml) |
| `exportarDispensas()` | SecretariaAcademica | [puml](diseño/casos-uso/exportarDispensas/secuencia.puml) |
| `consultarSolicitudesDispensa()` | DirectorDeGrado | [puml](diseño/casos-uso/consultarSolicitudesDispensa/secuencia.puml) |
| `editarSolicitudDispensaDirector()` | DirectorDeGrado | [puml](diseño/casos-uso/editarSolicitudDispensaDirector/secuencia.puml) |
| `guardarSolicitudDispensaDirector()` | DirectorDeGrado | [puml](diseño/casos-uso/guardarSolicitudDispensaDirector/secuencia.puml) |
