# Explicación del Diagrama: Importar Matrícula

Este diagrama describe la carga masiva de registros de matrícula desde un fichero externo (ej. Excel).

## Componentes Principales

- **PanelSecretaria (:PANEL_SECRETARIA)**: Punto de inicio para la actualización de matrículas.
- **ImportarMatriculaView**: Vista para la carga del fichero de matrículas.
- **ImportacionController**: Controlador que procesa la lógica de importación masiva.
- **MatriculaRepository**: Repositorio donde se registran las matrículas cargadas.
- **MatriculasCargadas (:MATRICULAS_CARGADAS_EXITO)**: Estado final tras completar la importación.
- **CompletarGestion (:Collaboration CompletarGestion)**: Cierre del flujo.

## Flujo de Trabajo

1.  **Inicio**: Se solicita la importación de matrícula desde el panel de secretaría.
2.  **Procesamiento**: La vista envía el fichero al **ImportacionController** (`procesarExcelMatriculas(fichero)`).
3.  **Registro**: El controlador delega la persistencia masiva en el **MatriculaRepository** (`registrarMatriculasMasivas`).
4.  **Resultado Final**:
    -   **Éxito**: Se alcanza el estado **MatriculasCargadas**.
    -   **Cancelación/Error**: Se activa **CompletarGestion**.
