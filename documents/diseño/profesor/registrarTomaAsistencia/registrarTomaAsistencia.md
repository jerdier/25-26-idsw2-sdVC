# ExplicaciÃ³n del DiseÃ±o: Registrar Toma Asistencia

Este diagrama describe el diseÃ±o tÃ©cnico del proceso de registro masivo de asistencias durante una sesiÃ³n de clase.

## Componentes TÃ©cnicos

- **Frontend (Vue)**: EnvÃ­a el listado completo de alumnos y su estado de asistencia (Presente/Ausente).
- **AsistenciaController**: Endpoint encargado del procesamiento de registros de asistencia.
- **AsistenciaService**: Capa de negocio que valida el estado de la sesiÃ³n antes del registro.
- **AsistenciaRepository**: Realiza la persistencia masiva de los registros.

## Flujo de ImplementaciÃ³n

1.  **PeticiÃ³n HTTP**: El Frontend envÃ­a un `POST /api/asistencias/lote` con el listado de alumnos.
2.  **VerificaciÃ³n de Estado**: El **AsistenciaService** comprueba si la sesiÃ³n de clase sigue abierta.
3.  **Control de Errores**:
    -   **400 Bad Request**: Si se intenta pasar lista en una sesiÃ³n ya cerrada, se lanza una `IllegalStateException` devolviendo un cÃ³digo 400.
4.  **Persistencia Masiva**:
    -   **200 OK**: Si la sesiÃ³n es vÃ¡lida, se guardan todos los registros mediante `saveAll` y se confirma la operaciÃ³n.

