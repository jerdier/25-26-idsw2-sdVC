# ExplicaciÃ³n del DiseÃ±o: Consultar Dispensas (Profesor)

Este diagrama de secuencia describe el flujo tÃ©cnico para que un profesor visualice las dispensas aprobadas que afectan a sus alumnos y grupos.

## Componentes TÃ©cnicos

- **Frontend (Vue)**: Solicita el listado de dispensas relevantes para el profesor autenticado.
- **DispensaController**: Endpoint encargado de la gestiÃ³n de dispensas desde la perspectiva del profesor.
- **DispensaService**: Capa de negocio que filtra las dispensas aprobadas.
- **DispensaRepository**: Realiza la bÃºsqueda en la base de datos de dispensas por profesor.

## Flujo de ImplementaciÃ³n

1.  **PeticiÃ³n HTTP**: El Frontend realiza un `GET /api/dispensas/profesor/{profesorId}`.
2.  **LÃ³gica de Servicio**: El controlador llama a `obtenerDispensasAprobadas(profesorId)` del **DispensaService**.
3.  **Filtrado**: El servicio busca especÃ­ficamente las dispensas con estado aprobado asociadas al profesor (`findAprobadasByProfesor`).
4.  **Respuesta**: El servidor responde con un cÃ³digo **200 OK** y la lista de objetos **DispensaDTO**.

