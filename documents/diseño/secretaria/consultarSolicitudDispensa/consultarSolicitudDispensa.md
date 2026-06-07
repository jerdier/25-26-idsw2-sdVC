# Explicación del Diseño: Consultar Dispensas (Secretaría)

Este diagrama de secuencia detalla la implementación técnica para la visualización de todas las solicitudes de dispensa registradas en el sistema.

## Componentes Técnicos

- **Frontend (React)**: Componente que solicita el historial total de trámites.
- **DispensaController**: Endpoint REST encargado de la administración de dispensas.
- **DispensaService**: Lógica de negocio para recuperar el listado completo.
- **DispensaRepository**: Repositorio JPA para obtener todas las dispensas.

## Flujo de Implementación

1.  **Petición HTTP**: El Frontend realiza un `GET /api/dispensas/todas`.
2.  **Lógica de Servicio**: El controlador llama a `listarTodasLasDispensas()` del **DispensaService**.
3.  **Consulta**: El servicio solicita todas las entidades al repositorio (`findAll`).
4.  **Respuesta**: El servidor responde con un código **200 OK** y la lista completa de objetos **DispensaDTO**.
