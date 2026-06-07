# Explicación del Diseño: Editar/Resolver Solicitud (Director de Grado)

Este diagrama de secuencia detalla el flujo técnico para que el Director de Grado evalúe y emita una resolución definitiva sobre una solicitud de dispensa.

## Componentes Técnicos

- **Frontend (React)**: Interfaz que captura la decisión (Aprobar/Rechazar) y el comentario del director, enviando una petición PUT.
- **DispensaController**: Endpoint encargado de procesar la resolución de la solicitud.
- **DispensaService**: Capa de negocio que valida la resolución (ej. requiere justificación si se rechaza) y actualiza el estado.
- **DispensaRepository**: Gestiona la búsqueda de la solicitud y el guardado de la resolución final.

## Flujo de Implementación

1.  **Petición HTTP**: Se realiza un `PUT /api/dispensas/{id}/resolver` con los datos de la resolución.
2.  **Verificación**: El **DispensaService** localiza la solicitud mediante `findById(id)`.
3.  **Gestión de Errores**:
    -   **400 Bad Request**: Si falta información obligatoria para la resolución (ej. el motivo del rechazo), lanzando una `ValidationException`.
4.  **Resolución Exitosa**:
    -   **200 OK**: Si la resolución es válida, se actualiza el estado de la dispensa, se persiste mediante `save` en el repositorio y se devuelve el objeto actualizado.
