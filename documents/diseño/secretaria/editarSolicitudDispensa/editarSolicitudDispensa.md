# Explicación del Diseño: Editar Dispensa (Secretaría)

Este diagrama describe la implementación técnica para que secretaría rectifique o corrija datos en un registro de dispensa existente.

## Componentes Técnicos

- **Frontend (React)**: Interfaz de rectificación que envía los cambios a un endpoint específico.
- **DispensaController**: Controlador REST para la edición administrativa de dispensas.
- **DispensaService**: Capa de negocio que gestiona la corrección de datos.
- **DispensaRepository**: Actualiza la entidad corregida en la base de datos.

## Flujo de Implementación

1.  **Petición HTTP**: El Frontend realiza un `PUT /api/dispensas/{id}/rectificar`.
2.  **Lógica de Corrección**: El controlador llama a `corregirDatosDispensa(id, dispensaDTO)` del **DispensaService**.
3.  **Actualización**: El servicio persiste los cambios mediante el método `save` del repositorio.
4.  **Respuesta**: Se devuelve el **DispensaDTO** rectificado con un código **200 OK**.
