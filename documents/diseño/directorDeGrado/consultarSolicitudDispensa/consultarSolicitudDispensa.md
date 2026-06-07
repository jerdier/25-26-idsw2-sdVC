# Explicación del Diseño: Consultar Solicitudes (Director de Grado)

Este diagrama de secuencia describe la implementación técnica del proceso mediante el cual el Director de Grado consulta las solicitudes que están pendientes de su resolución.

## Componentes Técnicos

- **DirectorDeGrado (Actor)**: Inicia la consulta desde el panel de gestión.
- **Frontend (React)**: Realiza la llamada asíncrona a la API para obtener las solicitudes pendientes.
- **DispensaController**: Endpoint REST que recibe la petición de filtrado por estado.
- **DispensaService**: Capa de negocio que coordina la obtención de las solicitudes pendientes.
- **DispensaRepository**: Interfaz de persistencia para buscar registros con estado "PENDIENTE".

## Flujo de Implementación

1.  **Petición HTTP**: El Frontend realiza un `GET /api/dispensas/estado/pendientes`.
2.  **Lógica de Servicio**: El controlador delega en `obtenerDispensasPendientes()` del **DispensaService**.
3.  **Consulta a Base de Datos**: El servicio utiliza `findByEstado("PENDIENTE")` del repositorio para recuperar la lista.
4.  **Respuesta**: El sistema devuelve un código **200 OK** con la lista de objetos **DispensaDTO** correspondientes.
