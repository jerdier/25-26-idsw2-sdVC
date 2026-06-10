# ExplicaciÃ³n del DiseÃ±o: Editar/Resolver Solicitud (Director de Grado)

Este diagrama de secuencia detalla el flujo tÃ©cnico para que el Director de Grado evalÃºe y emita una resoluciÃ³n definitiva sobre una solicitud de dispensa.

## Componentes TÃ©cnicos

- **Frontend (Vue)**: Interfaz que captura la decisiÃ³n (Aprobar/Rechazar) y el comentario del director, enviando una peticiÃ³n PUT.
- **DispensaController**: Endpoint encargado de procesar la resoluciÃ³n de la solicitud.
- **DispensaService**: Capa de negocio que valida la resoluciÃ³n (ej. requiere justificaciÃ³n si se rechaza) y actualiza el estado.
- **DispensaRepository**: Gestiona la bÃºsqueda de la solicitud y el guardado de la resoluciÃ³n final.

## Flujo de ImplementaciÃ³n

1.  **PeticiÃ³n HTTP**: Se realiza un `PUT /api/dispensas/{id}/resolver` con los datos de la resoluciÃ³n.
2.  **VerificaciÃ³n**: El **DispensaService** localiza la solicitud mediante `findById(id)`.
3.  **GestiÃ³n de Errores**:
    -   **400 Bad Request**: Si falta informaciÃ³n obligatoria para la resoluciÃ³n (ej. el motivo del rechazo), lanzando una `ValidationException`.
4.  **ResoluciÃ³n Exitosa**:
    -   **200 OK**: Si la resoluciÃ³n es vÃ¡lida, se actualiza el estado de la dispensa, se persiste mediante `save` en el repositorio y se devuelve el objeto actualizado.

