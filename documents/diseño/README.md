# CGU — Diseño · Índice de Casos de Uso

> | [Inicio](../../README.md) | [Documentos](../README.MD) | [Análisis](../analisis/README.md) | **Diseño** |
> |---|---|---|---|

Índice de todos los diagramas de diseño (secuencia con tecnología concreta) del sistema CGU.  
Cada carpeta contiene: `README.md` (documentación), fuentes en [`/modelosUML/diseño/`](../../modelosUML/diseño/).

---

## Administrador

| Caso de uso | Actor | Diseño |
|-------------|-------|--------|
| `crearUsuario()` | Administrador | [ver diseño](crearUsuario/README.md) |
| `consultarUsuario()` | Administrador | [ver diseño](consultarUsuario/README.md) |
| `editarUsuario()` | Administrador | [ver diseño](editarUsuario/README.md) |

---

## Alumno

| Caso de uso | Actor | Diseño |
|-------------|-------|--------|
| `crearSolicitudDispensaAlumno()` | Alumno | [ver diseño](crearSolicitudDispensaAlumno/README.md) |
| `consultarEstadoDispensa()` | Alumno | [ver diseño](consultarEstadoDispensa/README.md) |
| `editarSolicitudDispensaAlumno()` | Alumno | [ver diseño](editarSolicitudDispensaAlumno/README.md) |

---

## Profesor

| Caso de uso | Actor | Diseño |
|-------------|-------|--------|
| `crearSesionClase()` | Profesor | [ver diseño](crearSesionClase/README.md) |
| `editarSesionClase()` | Profesor | [ver diseño](editarSesionClase/README.md) |
| `cerrarSesionClase()` | Profesor | [ver diseño](cerrarSesionClase/README.md) |
| `registrarTomaAsistencia()` | Profesor | [ver diseño](registrarTomaAsistencia/README.md) |
| `exportarHistorialAsistencias()` | Profesor | [ver diseño](exportarHistorialAsistencias/README.md) |
| `consultarListaAlumnosProfesor()` | Profesor | [ver diseño](consultarListaAlumnosProfesor/README.md) |
| `consultarDetalleAlumno()` | Profesor | [ver diseño](consultarDetalleAlumno/README.md) |
| `consultarSolicitudDispensaProfesor()` | Profesor | [ver diseño](consultarSolicitudDispensaProfesor/README.md) |

---

## SecretariaAcademica

| Caso de uso | Actor | Diseño |
|-------------|-------|--------|
| `importarListasAlumnos()` | SecretariaAcademica | [ver diseño](importarListasAlumnos/README.md) |
| `consultarListaAlumnosSecretaria()` | SecretariaAcademica | [ver diseño](consultarListaAlumnosSecretaria/README.md) |
| `importarAlumnos()` | SecretariaAcademica | [ver diseño](importarAlumnos/README.md) |
| `verDetalleAlumno()` | SecretariaAcademica | [ver diseño](verDetalleAlumno/README.md) |
| `importarMatriculas()` | SecretariaAcademica | [ver diseño](importarMatriculas/README.md) |
| `consultarDetalleMatricula()` | SecretariaAcademica | [ver diseño](consultarDetalleMatricula/README.md) |
| `crearSolicitudDispensaSecretaria()` | SecretariaAcademica | [ver diseño](crearSolicitudDispensaSecretaria/README.md) |
| `consultarSolicitudDispensaSecretaria()` | SecretariaAcademica | [ver diseño](consultarSolicitudDispensaSecretaria/README.md) |
| `editarSolicitudDispensaSecretaria()` | SecretariaAcademica | [ver diseño](editarSolicitudDispensaSecretaria/README.md) |
| `guardarSolicitudDispensaSecretaria()` | SecretariaAcademica | [ver diseño](guardarSolicitudDispensaSecretaria/README.md) |
| `cerrarSolicitudDispensaSecretaria()` | SecretariaAcademica | [ver diseño](cerrarSolicitudDispensaSecretaria/README.md) |
| `exportarDispensas()` | SecretariaAcademica | [ver diseño](exportarDispensas/README.md) |

---

## DirectorDeGrado

| Caso de uso | Actor | Diseño |
|-------------|-------|--------|
| `consultarSolicitudesDispensa()` | DirectorDeGrado | [ver diseño](consultarSolicitudesDispensa/README.md) |
| `editarSolicitudDispensaDirector()` | DirectorDeGrado | [ver diseño](editarSolicitudDispensaDirector/README.md) |
| `guardarSolicitudDispensaDirector()` | DirectorDeGrado | [ver diseño](guardarSolicitudDispensaDirector/README.md) |

---

> **Total:** 29 casos de uso · Fuentes PlantUML en [`modelosUML/diseño/casos-uso/`](../../modelosUML/diseño/)
