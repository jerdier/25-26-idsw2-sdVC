# Explicación del Diseño: Cerrar Sesión de Clase

Este diagrama de secuencia detalla la implementación técnica del proceso de finalización de una sesión de clase activa por parte del profesor.

## Componentes Técnicos

- **Profesor (Actor)**: Inicia la acción de finalizar la clase.
- **Frontend (React)**: Realiza la petición asíncrona al servidor.
- **SesionController**: Punto de entrada REST que gestiona el cierre de sesiones.
- **SesionService**: Capa de negocio que actualiza el estado de la sesión.
- **SesionRepository**: Interfaz de persistencia para buscar y guardar el estado de la sesión.

## Flujo de Implementación

1.  **Petición HTTP**: El Frontend realiza un `PUT /api/sesiones/{id}/cerrar`.
2.  **Lógica de Servicio**: El controlador delega en `finalizarSesion(id)` del **SesionService**.
3.  **Persistencia**: El servicio busca la sesión (`findById`), actualiza su estado a "Cerrada" y guarda los cambios mediante `save`.
4.  **Respuesta**: El sistema devuelve un código **200 OK** tras completar la operación con éxito.
