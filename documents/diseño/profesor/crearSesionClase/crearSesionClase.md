# ExplicaciÃ³n del DiseÃ±o: Crear SesiÃ³n de Clase

Este diagrama de secuencia detalla el flujo tÃ©cnico para la apertura de una nueva sesiÃ³n de clase, incluyendo el control de concurrencia.

## Componentes TÃ©cnicos

- **Frontend (Vue)**: Formulario de inicio de sesiÃ³n que envÃ­a los parÃ¡metros iniciales.
- **SesionController**: Endpoint REST para la creaciÃ³n de nuevas sesiones.
- **SesionService**: Capa de negocio que valida las reglas de apertura de sesiÃ³n.
- **SesionRepository**: Encargado de persistir la nueva sesiÃ³n de clase.

## Flujo de ImplementaciÃ³n

1.  **PeticiÃ³n HTTP**: El Frontend realiza un `POST /api/sesiones` con los datos de la nueva sesiÃ³n.
2.  **ValidaciÃ³n de Reglas de Negocio**: El **SesionService** verifica si ya existe una sesiÃ³n activa para evitar duplicidades.
3.  **GestiÃ³n de Conflictos**:
    -   **409 Conflict**: Si ya existe una sesiÃ³n activa, se lanza una `BusinessException` y se devuelve un cÃ³digo 409.
4.  **Persistencia**:
    -   **201 Created**: Si no hay conflictos, se guarda la nueva sesiÃ³n y se devuelve con un cÃ³digo 201.

