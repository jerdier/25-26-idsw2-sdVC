# Explicación del Diseño: Crear Sesión de Clase

Este diagrama de secuencia detalla el flujo técnico para la apertura de una nueva sesión de clase, incluyendo el control de concurrencia.

## Componentes Técnicos

- **Frontend (React)**: Formulario de inicio de sesión que envía los parámetros iniciales.
- **SesionController**: Endpoint REST para la creación de nuevas sesiones.
- **SesionService**: Capa de negocio que valida las reglas de apertura de sesión.
- **SesionRepository**: Encargado de persistir la nueva sesión de clase.

## Flujo de Implementación

1.  **Petición HTTP**: El Frontend realiza un `POST /api/sesiones` con los datos de la nueva sesión.
2.  **Validación de Reglas de Negocio**: El **SesionService** verifica si ya existe una sesión activa para evitar duplicidades.
3.  **Gestión de Conflictos**:
    -   **409 Conflict**: Si ya existe una sesión activa, se lanza una `BusinessException` y se devuelve un código 409.
4.  **Persistencia**:
    -   **201 Created**: Si no hay conflictos, se guarda la nueva sesión y se devuelve con un código 201.
