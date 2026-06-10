# ExplicaciÃ³n del DiseÃ±o: Cerrar SesiÃ³n de Clase

Este diagrama de secuencia detalla la implementaciÃ³n tÃ©cnica del proceso de finalizaciÃ³n de una sesiÃ³n de clase activa por parte del profesor.

## Componentes TÃ©cnicos

- **Profesor (Actor)**: Inicia la acciÃ³n de finalizar la clase.
- **Frontend (Vue)**: Realiza la peticiÃ³n asÃ­ncrona al servidor.
- **SesionController**: Punto de entrada REST que gestiona el cierre de sesiones.
- **SesionService**: Capa de negocio que actualiza el estado de la sesiÃ³n.
- **SesionRepository**: Interfaz de persistencia para buscar y guardar el estado de la sesiÃ³n.

## Flujo de ImplementaciÃ³n

1.  **PeticiÃ³n HTTP**: El Frontend realiza un `PUT /api/sesiones/{id}/cerrar`.
2.  **LÃ³gica de Servicio**: El controlador delega en `finalizarSesion(id)` del **SesionService**.
3.  **Persistencia**: El servicio busca la sesiÃ³n (`findById`), actualiza su estado a "Cerrada" y guarda los cambios mediante `save`.
4.  **Respuesta**: El sistema devuelve un cÃ³digo **200 OK** tras completar la operaciÃ³n con Ã©xito.

