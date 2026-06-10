# ExplicaciÃ³n del DiseÃ±o: Editar Dispensa (SecretarÃ­a)

Este diagrama describe la implementaciÃ³n tÃ©cnica para que secretarÃ­a rectifique o corrija datos en un registro de dispensa existente.

## Componentes TÃ©cnicos

- **Frontend (Vue)**: Interfaz de rectificaciÃ³n que envÃ­a los cambios a un endpoint especÃ­fico.
- **DispensaController**: Controlador REST para la ediciÃ³n administrativa de dispensas.
- **DispensaService**: Capa de negocio que gestiona la correcciÃ³n de datos.
- **DispensaRepository**: Actualiza la entidad corregida en la base de datos.

## Flujo de ImplementaciÃ³n

1.  **PeticiÃ³n HTTP**: El Frontend realiza un `PUT /api/dispensas/{id}/rectificar`.
2.  **LÃ³gica de CorrecciÃ³n**: El controlador llama a `corregirDatosDispensa(id, dispensaDTO)` del **DispensaService**.
3.  **ActualizaciÃ³n**: El servicio persiste los cambios mediante el mÃ©todo `save` del repositorio.
4.  **Respuesta**: Se devuelve el **DispensaDTO** rectificado con un cÃ³digo **200 OK**.

