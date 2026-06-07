# Explicación del Diseño: Editar Sesión de Clase

Este diagrama describe la implementación técnica para la modificación de parámetros de una sesión de clase en curso.

## Componentes Técnicos

- **Frontend (React)**: Interfaz de edición que envía los cambios a la API.
- **SesionController**: Controlador REST encargado de la gestión de sesiones.
- **SesionService**: Capa de negocio que procesa el reajuste de la sesión.
- **SesionRepository**: Actualiza los datos de la sesión en la base de datos.

## Flujo de Implementación

1.  **Petición HTTP**: El Frontend realiza un `PUT /api/sesiones/{id}`.
2.  **Lógica de Servicio**: El controlador llama a `reajustarSesion(id, sesionDTO)` del **SesionService**.
3.  **Actualización**: El servicio persiste los cambios mediante el método `save` del repositorio.
4.  **Respuesta**: Se devuelve el **SesionDTO** actualizado con un código **200 OK**.
