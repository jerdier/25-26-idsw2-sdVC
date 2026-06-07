# Explicación del Diseño: Consultar Detalle Alumno

Este diagrama de secuencia describe el flujo técnico para que un profesor consulte la ficha detallada de un alumno, incluyendo su historial académico.

## Componentes Técnicos

- **Frontend (React)**: Componente que solicita los detalles del alumno al servidor.
- **AlumnoController**: Endpoint REST encargado de la gestión de información de alumnos.
- **AlumnoService**: Capa de negocio que agrega la información necesaria para el detalle.
- **AlumnoRepository**: Repositorio que realiza una consulta proyectada para obtener todos los campos requeridos.

## Flujo de Implementación

1.  **Petición HTTP**: El Frontend ejecuta un `GET /api/alumnos/{id}/detalle`.
2.  **Lógica de Servicio**: El controlador llama a `obtenerFichaCompleta(id)` en el **AlumnoService**.
3.  **Proyección de Datos**: El servicio utiliza un método optimizado del repositorio (`findDetalleCompletoById`) para obtener una proyección de los datos.
4.  **Respuesta**: Se devuelve un objeto **AlumnoDetalleDTO** con un código de respuesta **200 OK**.
