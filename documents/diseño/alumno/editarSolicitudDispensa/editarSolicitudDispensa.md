# ExplicaciÃ³n del DiseÃ±o: Editar Solicitud de Dispensa (Alumno)

Este diagrama de secuencia ilustra el proceso tÃ©cnico para que un alumno modifique una solicitud de dispensa ya existente.

## Componentes TÃ©cnicos

- **Frontend (Vue)**: Interfaz para la ediciÃ³n que envÃ­a una peticiÃ³n PUT con los cambios.
- **DispensaController**: Endpoint encargado de la actualizaciÃ³n de la solicitud.
- **DispensaService**: Capa de negocio que verifica si el estado actual permite la ediciÃ³n.
- **DispensaRepository**: Actualiza el registro en la base de datos.

## Flujo de ImplementaciÃ³n

1.  **PeticiÃ³n HTTP**: RealizaciÃ³n de un `PUT /api/dispensas/{id}` con la informaciÃ³n actualizada.
2.  **Control de Estado**: El **DispensaService** verifica si la solicitud aÃºn es editable (ej. si no ha sido ya resuelta).
3.  **Escenarios de Respuesta**:
    -   **403 Forbidden**: Si el estado actual de la dispensa no permite modificaciones (`IllegalStateException`).
    -   **200 OK**: Si la ediciÃ³n estÃ¡ permitida, se guardan los cambios en el repositorio y se devuelve la solicitud actualizada.

