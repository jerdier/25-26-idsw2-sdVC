# ExplicaciÃ³n del DiseÃ±o: Crear Solicitud de Dispensa (Alumno)

Este diagrama detalla el flujo tÃ©cnico para la creaciÃ³n de una nueva solicitud de dispensa por parte de un alumno.

## Componentes TÃ©cnicos

- **Frontend (Vue)**: Captura los motivos y adjuntos, realizando la peticiÃ³n POST.
- **DispensaController**: Gestiona la recepciÃ³n de la nueva solicitud de dispensa.
- **DispensaService**: Valida la integridad de la solicitud y coordina el guardado.
- **DispensaRepository**: Realiza la persistencia de la nueva dispensa.

## Flujo de ImplementaciÃ³n

1.  **PeticiÃ³n HTTP**: EnvÃ­o de un `POST /api/dispensas` con los datos de la solicitud.
2.  **ValidaciÃ³n**: El **DispensaService** verifica la solicitud mediante `registrarDispensa(dispensaDTO)`.
3.  **Control de Errores**:
    -   **400 Bad Request**: Si la documentaciÃ³n es incompleta o hay errores de validaciÃ³n (`ValidationException`).
4.  **ConfirmaciÃ³n**:
    -   **201 Created**: Si la solicitud es vÃ¡lida, se persiste en la base de datos y se devuelve el objeto creado.

