# Explicación del Diseño: Registrar Toma Asistencia

Este diagrama describe el diseño técnico del proceso de registro masivo de asistencias durante una sesión de clase.

## Componentes Técnicos

- **Frontend (React)**: Envía el listado completo de alumnos y su estado de asistencia (Presente/Ausente).
- **AsistenciaController**: Endpoint encargado del procesamiento de registros de asistencia.
- **AsistenciaService**: Capa de negocio que valida el estado de la sesión antes del registro.
- **AsistenciaRepository**: Realiza la persistencia masiva de los registros.

## Flujo de Implementación

1.  **Petición HTTP**: El Frontend envía un `POST /api/asistencias/lote` con el listado de alumnos.
2.  **Verificación de Estado**: El **AsistenciaService** comprueba si la sesión de clase sigue abierta.
3.  **Control de Errores**:
    -   **400 Bad Request**: Si se intenta pasar lista en una sesión ya cerrada, se lanza una `IllegalStateException` devolviendo un código 400.
4.  **Persistencia Masiva**:
    -   **200 OK**: Si la sesión es válida, se guardan todos los registros mediante `saveAll` y se confirma la operación.
