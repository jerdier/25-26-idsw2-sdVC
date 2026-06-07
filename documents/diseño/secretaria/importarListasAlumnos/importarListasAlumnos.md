# Explicación del Diseño: Importar Listas de Alumnos

Este diagrama describe la implementación técnica para la carga masiva de alumnos mediante el procesamiento de archivos externos.

## Componentes Técnicos

- **Frontend (React)**: Permite la subida del archivo CSV o Excel.
- **ImportacionController**: Endpoint encargado de recibir el archivo de importación.
- **ImportacionService**: Lógica de negocio para parsear y validar el contenido del archivo.
- **AlumnoRepository**: Realiza la persistencia masiva de los alumnos procesados.

## Flujo de Implementación

1.  **Petición HTTP**: El Frontend envía el archivo mediante `POST /api/alumnos/importar`.
2.  **Procesamiento**: El **ImportacionService** parsea el archivo.
3.  **Gestión de Errores**:
    -   **400 Bad Request**: Si el archivo tiene un formato incorrecto (`FileFormatException`).
4.  **Persistencia y Resultado**:
    -   **200 OK**: Si el procesamiento es correcto, se guardan todos los alumnos (`saveAll`) y se devuelve un **ImportResultDTO** con el resumen de la operación.
