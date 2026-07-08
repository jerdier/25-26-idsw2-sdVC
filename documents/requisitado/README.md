# CGU -- Requisitado

> | [Inicio](../../README.md) | **Requisitado** | [Índice Análisis](../analisis/README.md) | [Índice Diseño](../diseño/README.md) |
> |---|---|---|---|

Diagramas originales del repositorio CGU (fuente de requisitos), sin modificar.

---

## Modelo del Dominio

| Diagrama | Tipo | PUML | SVG |
|----------|------|------|-----|
| Modelo completo | Clases | [puml](00-modelo-del-dominio/ModeloCompleto.puml) | [svg](00-modelo-del-dominio/ModeloCompleto.svg) |
| Diagrama de objetos | Objetos | [puml](00-modelo-del-dominio/DiagramaDeObjetos.puml) | [svg](00-modelo-del-dominio/DiagramaDeObjetos.svg) |
| Estado: Alumno | Estado | [puml](00-modelo-del-dominio/estado-Alumno.puml) | [svg](00-modelo-del-dominio/estado-Alumno.svg) |
| Estado: Asistencia | Estado | [puml](00-modelo-del-dominio/estado-Asistencia.puml) | [svg](00-modelo-del-dominio/estado-Asistencia.svg) |
| Estado: Dispensas | Estado | [puml](00-modelo-del-dominio/estado-Dispensas.puml) | [svg](00-modelo-del-dominio/estado-Dispensas.svg) |
| Estado: Matrícula | Estado | [puml](00-modelo-del-dominio/estado-Matricula.puml) | [svg](00-modelo-del-dominio/estado-Matricula.svg) |

---

## Actores y Casos de Uso

| Diagrama | PUML | SVG |
|----------|------|-----|
| Actores del sistema | [puml](01-actores-casos-uso/Actores.puml) | [svg](01-actores-casos-uso/Actores.svg) |
| CU: Administrador | [puml](01-actores-casos-uso/Administrador.puml) | [svg](01-actores-casos-uso/Administrador.svg) |
| CU: Alumno | [puml](01-actores-casos-uso/Alumno.puml) | [svg](01-actores-casos-uso/Alumno.svg) |
| CU: Profesor | [puml](01-actores-casos-uso/Profesor.puml) | [svg](01-actores-casos-uso/Profesor.svg) |
| CU: DirectorDeGrado | [puml](01-actores-casos-uso/DirectorDeGrado.puml) | [svg](01-actores-casos-uso/DirectorDeGrado.svg) |
| CU: SecretariaAcademica | [puml](01-actores-casos-uso/Secretaria.puml) | [svg](01-actores-casos-uso/Secretaria.svg) |
| Diagrama de contexto | [puml](01-actores-casos-uso/DiagramaDeContexto.puml) | [svg](01-actores-casos-uso/DiagramaDeContexto.svg) |

---

## Detalle de Casos de Uso

### Abrir

| Caso de uso | Actor | PUML | SVG |
|-------------|-------|------|-----|
| `abrirUsuarios()` | Administrador | [puml](02-detalle/Administrador/abrirUsuarios.puml) | [svg](02-detalle/Administrador/abrirUsuarios.svg) |
| `abrirDispensas()` | Alumno | [puml](02-detalle/Alumno/abrirDispensas.puml) | [svg](02-detalle/Alumno/abrirDispensas.svg) |

### Crear

| Caso de uso | Actor | PUML | SVG |
|-------------|-------|------|-----|
| `crearUsuario()` | Administrador | [puml](02-detalle/Administrador/crearUsuario.puml) | [svg](02-detalle/Administrador/crearUsuario.svg) |
| `crearSesionClase()` | Profesor | [puml](02-detalle/Profesor/crearSesionClase.puml) | [svg](02-detalle/Profesor/crearSesionClase.svg) |
| `crearSolicitudDispensa()` | Alumno · Secretaria | [puml](02-detalle/Alumno/crearSolicitudDispensa.puml) | [svg](02-detalle/Alumno/crearSolicitudDispensa.svg) |

### Consultar

| Caso de uso | Actor | PUML | SVG |
|-------------|-------|------|-----|
| `consultarUsuario()` | Administrador | [puml](02-detalle/Administrador/consultarUsuario.puml) | [svg](02-detalle/Administrador/consultarUsuario.svg) |
| `consultarDetalleAlumno()` | Profesor | [puml](02-detalle/Profesor/consultarDetalleAlumno.puml) | [svg](02-detalle/Profesor/consultarDetalleAlumno.svg) |
| `consultarSolicitudDispensa()` | Alumno · Profesor · Director · Secretaria | [puml](02-detalle/Alumno/consultarSolicitudDispensa.puml) | [svg](02-detalle/Alumno/consultarSolicitudDispensa.svg) |
| `consultarAlumno()` | Secretaria | [puml](02-detalle/Secretaria/consultarAlumno.puml) | [svg](02-detalle/Secretaria/consultarAlumno.svg) |
| `consultarDetalleMatricula()` | Secretaria | [puml](02-detalle/Secretaria/consultarDetalleMatricula.puml) | [svg](02-detalle/Secretaria/consultarDetalleMatricula.svg) |

### Editar

| Caso de uso | Actor | PUML | SVG |
|-------------|-------|------|-----|
| `editarUsuario()` | Administrador | [puml](02-detalle/Administrador/editarUsuario.puml) | [svg](02-detalle/Administrador/editarUsuario.svg) |
| `editarSesionClase()` | Profesor | [puml](02-detalle/Profesor/editarSesionClase.puml) | [svg](02-detalle/Profesor/editarSesionClase.svg) |
| `editarSolicitudDispensa()` | Alumno · Director · Secretaria | [puml](02-detalle/Alumno/editarSolicitudDispensa.puml) | [svg](02-detalle/Alumno/editarSolicitudDispensa.svg) |

### Cerrar

| Caso de uso | Actor | PUML | SVG |
|-------------|-------|------|-----|
| `cerrarSesionClase()` | Profesor | [puml](02-detalle/Profesor/cerrarSesionClase.puml) | [svg](02-detalle/Profesor/cerrarSesionClase.svg) |
| `cerrarCicloAcademico()` | Secretaria | [puml](02-detalle/Secretaria/cerrarCicloAcademico.puml) | [svg](02-detalle/Secretaria/cerrarCicloAcademico.svg) |

### Registrar

| Caso de uso | Actor | PUML | SVG |
|-------------|-------|------|-----|
| `registrarTomaAsistencia()` | Profesor | [puml](02-detalle/Profesor/registrarTomaAsistencia.puml) | [svg](02-detalle/Profesor/registrarTomaAsistencia.svg) |

### Exportar

| Caso de uso | Actor | PUML | SVG |
|-------------|-------|------|-----|
| `exportarHistorialAsistencias()` | Profesor | [puml](02-detalle/Profesor/exportarHistorialAsistencias.puml) | [svg](02-detalle/Profesor/exportarHistorialAsistencias.svg) |

### Importar

| Caso de uso | Actor | PUML | SVG |
|-------------|-------|------|-----|
| `importarAlumnos()` | Secretaria | [puml](02-detalle/Secretaria/importarAlumnos.puml) | [svg](02-detalle/Secretaria/importarAlumnos.svg) |
| `importarMatriculas()` | Secretaria | [puml](02-detalle/Secretaria/importarMatriculas.puml) | [svg](02-detalle/Secretaria/importarMatriculas.svg) |

---

> **Total:** 20 casos de uso detallados
