# ExplicaciÃ³n del DiseÃ±o: Importar Listas de Alumnos

Este diagrama describe la implementaciÃ³n tÃ©cnica para la carga masiva de alumnos mediante el procesamiento de archivos externos.

## Componentes TÃ©cnicos

- **Frontend (Vue)**: Permite la subida del archivo CSV o Excel.
- **ImportacionController**: Endpoint encargado de recibir el archivo de importaciÃ³n.
- **ImportacionService**: LÃ³gica de negocio para parsear y validar el contenido del archivo.
- **AlumnoRepository**: Realiza la persistencia masiva de los alumnos procesados.

## Flujo de ImplementaciÃ³n

1.  **PeticiÃ³n HTTP**: El Frontend envÃ­a el archivo mediante `POST /api/alumnos/importar`.
2.  **Procesamiento**: El **ImportacionService** parsea el archivo.
3.  **GestiÃ³n de Errores**:
    -   **400 Bad Request**: Si el archivo tiene un formato incorrecto (`FileFormatException`).
4.  **Persistencia y Resultado**:
    -   **200 OK**: Si el procesamiento es correcto, se guardan todos los alumnos (`saveAll`) y se devuelve un **ImportResultDTO** con el resumen de la operaciÃ³n.

