# ExplicaciÃ³n del DiseÃ±o: Consultar Dispensas (SecretarÃ­a)

Este diagrama de secuencia detalla la implementaciÃ³n tÃ©cnica para la visualizaciÃ³n de todas las solicitudes de dispensa registradas en el sistema.

## Componentes TÃ©cnicos

- **Frontend (Vue)**: Componente que solicita el historial total de trÃ¡mites.
- **DispensaController**: Endpoint REST encargado de la administraciÃ³n de dispensas.
- **DispensaService**: LÃ³gica de negocio para recuperar el listado completo.
- **DispensaRepository**: Repositorio JPA para obtener todas las dispensas.

## Flujo de ImplementaciÃ³n

1.  **PeticiÃ³n HTTP**: El Frontend realiza un `GET /api/dispensas/todas`.
2.  **LÃ³gica de Servicio**: El controlador llama a `listarTodasLasDispensas()` del **DispensaService**.
3.  **Consulta**: El servicio solicita todas las entidades al repositorio (`findAll`).
4.  **Respuesta**: El servidor responde con un cÃ³digo **200 OK** y la lista completa de objetos **DispensaDTO**.

