# Explicación del Diseño: Crear Dispensa De Oficio

Este diagrama ilustra el flujo técnico para que el personal de secretaría registre una dispensa institucional de forma directa.

## Componentes Técnicos

- **Frontend (React)**: Formulario de registro "de oficio" que envía los datos a la API.
- **DispensaController**: Endpoint encargado del registro administrativo de dispensas.
- **DispensaService**: Capa de negocio que procesa la inyección de la dispensa.
- **DispensaRepository**: Realiza la persistencia de la dispensa institucional.

## Flujo de Implementación

1.  **Petición HTTP**: El Frontend envía un `POST /api/dispensas/oficio` con los datos correspondientes.
2.  **Lógica de Inyección**: El **DispensaService** procesa la solicitud mediante `inyectarDispensa(dispensaDTO)`.
3.  **Persistencia**: Se guarda la entidad en el repositorio mediante el método `save`.
4.  **Respuesta**: El sistema confirma la creación con un código **201 Created**.
