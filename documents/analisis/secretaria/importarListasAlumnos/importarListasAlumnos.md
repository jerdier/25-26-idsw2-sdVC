# Explicación del Diagrama: Importar Listas de Alumnos

Este diagrama ilustra el proceso de carga masiva de alumnos al sistema mediante un archivo externo.

## Componentes Principales

- **PanelSecretaria (:PANEL_SECRETARIA)**: Inicio del proceso de carga de datos.
- **ImportarListasView**: Vista para subir el archivo de alumnos.
- **ImportacionController**: Controlador que procesa el contenido del archivo.
- **AlumnoRepository**: Repositorio encargado de guardar el lote de alumnos en la base de datos.
- **AlumnosImportados (:ALUMNOS_IMPORTADOS_SISTEMA)**: Confirmación de carga exitosa.
- **CompletarGestion (:Collaboration CompletarGestion)**: Manejo de cierre.

## Flujo de Trabajo

1.  **Carga**: Se selecciona el archivo y se inicia la importación desde la vista.
2.  **Procesamiento**: El **ImportacionController** procesa el flujo de datos (`procesarArchivoAlumnos(streamArchivo)`).
3.  **Persistencia**: El controlador guarda los datos resultantes mediante el **AlumnoRepository** (`guardarLoteAlumnos`).
4.  **Resultado**:
    -   **Éxito**: Los alumnos quedan registrados en el sistema (**AlumnosImportados**).
    -   **Cancelación/Error**: Se activa **CompletarGestion**.
