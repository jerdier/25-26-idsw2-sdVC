# Explicación del Diseño: Importar Matrículas

Este diagrama de secuencia ilustra el diseño técnico para la carga masiva de registros de matrícula desde archivos de datos.

## Componentes Técnicos

- **Frontend (React)**: Interfaz para la subida del archivo de matrículas.
- **ImportacionController**: Punto de entrada para la carga de datos masivos.
- **ImportacionService**: Valida la consistencia de los datos de matrícula antes de su registro.
- **MatriculaRepository**: Repositorio encargado de persistir el lote de matrículas.

## Flujo de Implementación

1.  **Petición HTTP**: El Frontend realiza un `POST /api/matriculas/importar`.
2.  **Validación de Consistencia**: El **ImportacionService** procesa el archivo y verifica que no haya inconsistencias en los datos.
3.  **Gestión de Errores**:
    -   **400 Bad Request**: Si se detectan datos inconsistentes (`ValidationException`).
4.  **Carga Masiva**:
    -   **200 OK**: Si los datos son válidos, se realiza un `saveAll` en el repositorio y se devuelve el resultado de la importación.
