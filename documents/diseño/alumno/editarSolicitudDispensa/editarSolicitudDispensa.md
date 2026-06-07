# Explicación del Diseño: Editar Solicitud de Dispensa (Alumno)

Este diagrama de secuencia ilustra el proceso técnico para que un alumno modifique una solicitud de dispensa ya existente.

## Componentes Técnicos

- **Frontend (React)**: Interfaz para la edición que envía una petición PUT con los cambios.
- **DispensaController**: Endpoint encargado de la actualización de la solicitud.
- **DispensaService**: Capa de negocio que verifica si el estado actual permite la edición.
- **DispensaRepository**: Actualiza el registro en la base de datos.

## Flujo de Implementación

1.  **Petición HTTP**: Realización de un `PUT /api/dispensas/{id}` con la información actualizada.
2.  **Control de Estado**: El **DispensaService** verifica si la solicitud aún es editable (ej. si no ha sido ya resuelta).
3.  **Escenarios de Respuesta**:
    -   **403 Forbidden**: Si el estado actual de la dispensa no permite modificaciones (`IllegalStateException`).
    -   **200 OK**: Si la edición está permitida, se guardan los cambios en el repositorio y se devuelve la solicitud actualizada.
