# ExplicaciÃ³n del DiseÃ±o: Consultar Solicitudes (Director de Grado)

Este diagrama de secuencia describe la implementaciÃ³n tÃ©cnica del proceso mediante el cual el Director de Grado consulta las solicitudes que estÃ¡n pendientes de su resoluciÃ³n.

## Componentes TÃ©cnicos

- **DirectorDeGrado (Actor)**: Inicia la consulta desde el panel de gestiÃ³n.
- **Frontend (Vue)**: Realiza la llamada asÃ­ncrona a la API para obtener las solicitudes pendientes.
- **DispensaController**: Endpoint REST que recibe la peticiÃ³n de filtrado por estado.
- **DispensaService**: Capa de negocio que coordina la obtenciÃ³n de las solicitudes pendientes.
- **DispensaRepository**: Interfaz de persistencia para buscar registros con estado "PENDIENTE".

## Flujo de ImplementaciÃ³n

1.  **PeticiÃ³n HTTP**: El Frontend realiza un `GET /api/dispensas/estado/pendientes`.
2.  **LÃ³gica de Servicio**: El controlador delega en `obtenerDispensasPendientes()` del **DispensaService**.
3.  **Consulta a Base de Datos**: El servicio utiliza `findByEstado("PENDIENTE")` del repositorio para recuperar la lista.
4.  **Respuesta**: El sistema devuelve un cÃ³digo **200 OK** con la lista de objetos **DispensaDTO** correspondientes.

