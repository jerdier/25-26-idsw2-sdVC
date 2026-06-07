# Explicación del Diseño: Crear Solicitud de Dispensa (Alumno)

Este diagrama detalla el flujo técnico para la creación de una nueva solicitud de dispensa por parte de un alumno.

## Componentes Técnicos

- **Frontend (React)**: Captura los motivos y adjuntos, realizando la petición POST.
- **DispensaController**: Gestiona la recepción de la nueva solicitud de dispensa.
- **DispensaService**: Valida la integridad de la solicitud y coordina el guardado.
- **DispensaRepository**: Realiza la persistencia de la nueva dispensa.

## Flujo de Implementación

1.  **Petición HTTP**: Envío de un `POST /api/dispensas` con los datos de la solicitud.
2.  **Validación**: El **DispensaService** verifica la solicitud mediante `registrarDispensa(dispensaDTO)`.
3.  **Control de Errores**:
    -   **400 Bad Request**: Si la documentación es incompleta o hay errores de validación (`ValidationException`).
4.  **Confirmación**:
    -   **201 Created**: Si la solicitud es válida, se persiste en la base de datos y se devuelve el objeto creado.
