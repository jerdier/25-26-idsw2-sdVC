# ExplicaciÃ³n del DiseÃ±o: Editar SesiÃ³n de Clase

Este diagrama describe la implementaciÃ³n tÃ©cnica para la modificaciÃ³n de parÃ¡metros de una sesiÃ³n de clase en curso.

## Componentes TÃ©cnicos

- **Frontend (Vue)**: Interfaz de ediciÃ³n que envÃ­a los cambios a la API.
- **SesionController**: Controlador REST encargado de la gestiÃ³n de sesiones.
- **SesionService**: Capa de negocio que procesa el reajuste de la sesiÃ³n.
- **SesionRepository**: Actualiza los datos de la sesiÃ³n en la base de datos.

## Flujo de ImplementaciÃ³n

1.  **PeticiÃ³n HTTP**: El Frontend realiza un `PUT /api/sesiones/{id}`.
2.  **LÃ³gica de Servicio**: El controlador llama a `reajustarSesion(id, sesionDTO)` del **SesionService**.
3.  **ActualizaciÃ³n**: El servicio persiste los cambios mediante el mÃ©todo `save` del repositorio.
4.  **Respuesta**: Se devuelve el **SesionDTO** actualizado con un cÃ³digo **200 OK**.

