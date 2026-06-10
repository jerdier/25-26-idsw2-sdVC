# ExplicaciÃ³n del DiseÃ±o: Importar MatrÃ­culas

Este diagrama de secuencia ilustra el diseÃ±o tÃ©cnico para la carga masiva de registros de matrÃ­cula desde archivos de datos.

## Componentes TÃ©cnicos

- **Frontend (Vue)**: Interfaz para la subida del archivo de matrÃ­culas.
- **ImportacionController**: Punto de entrada para la carga de datos masivos.
- **ImportacionService**: Valida la consistencia de los datos de matrÃ­cula antes de su registro.
- **MatriculaRepository**: Repositorio encargado de persistir el lote de matrÃ­culas.

## Flujo de ImplementaciÃ³n

1.  **PeticiÃ³n HTTP**: El Frontend realiza un `POST /api/matriculas/importar`.
2.  **ValidaciÃ³n de Consistencia**: El **ImportacionService** procesa el archivo y verifica que no haya inconsistencias en los datos.
3.  **GestiÃ³n de Errores**:
    -   **400 Bad Request**: Si se detectan datos inconsistentes (`ValidationException`).
4.  **Carga Masiva**:
    -   **200 OK**: Si los datos son vÃ¡lidos, se realiza un `saveAll` en el repositorio y se devuelve el resultado de la importaciÃ³n.

