# ExplicaciÃ³n del DiseÃ±o: Crear Dispensa De Oficio

Este diagrama ilustra el flujo tÃ©cnico para que el personal de secretarÃ­a registre una dispensa institucional de forma directa.

## Componentes TÃ©cnicos

- **Frontend (Vue)**: Formulario de registro "de oficio" que envÃ­a los datos a la API.
- **DispensaController**: Endpoint encargado del registro administrativo de dispensas.
- **DispensaService**: Capa de negocio que procesa la inyecciÃ³n de la dispensa.
- **DispensaRepository**: Realiza la persistencia de la dispensa institucional.

## Flujo de ImplementaciÃ³n

1.  **PeticiÃ³n HTTP**: El Frontend envÃ­a un `POST /api/dispensas/oficio` con los datos correspondientes.
2.  **LÃ³gica de InyecciÃ³n**: El **DispensaService** procesa la solicitud mediante `inyectarDispensa(dispensaDTO)`.
3.  **Persistencia**: Se guarda la entidad en el repositorio mediante el mÃ©todo `save`.
4.  **Respuesta**: El sistema confirma la creaciÃ³n con un cÃ³digo **201 Created**.

