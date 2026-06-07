# Explicación del Diseño: Consultar Dispensas (Profesor)

Este diagrama de secuencia describe el flujo técnico para que un profesor visualice las dispensas aprobadas que afectan a sus alumnos y grupos.

## Componentes Técnicos

- **Frontend (React)**: Solicita el listado de dispensas relevantes para el profesor autenticado.
- **DispensaController**: Endpoint encargado de la gestión de dispensas desde la perspectiva del profesor.
- **DispensaService**: Capa de negocio que filtra las dispensas aprobadas.
- **DispensaRepository**: Realiza la búsqueda en la base de datos de dispensas por profesor.

## Flujo de Implementación

1.  **Petición HTTP**: El Frontend realiza un `GET /api/dispensas/profesor/{profesorId}`.
2.  **Lógica de Servicio**: El controlador llama a `obtenerDispensasAprobadas(profesorId)` del **DispensaService**.
3.  **Filtrado**: El servicio busca específicamente las dispensas con estado aprobado asociadas al profesor (`findAprobadasByProfesor`).
4.  **Respuesta**: El servidor responde con un código **200 OK** y la lista de objetos **DispensaDTO**.
