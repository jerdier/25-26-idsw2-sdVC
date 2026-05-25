# Reflexión Técnica: Fase de Análisis a Diseño

## Introducción
Este documento detalla la lógica detrás de la transición entre la fase de Análisis (basada en los requisitos de `SdR`) y el inicio del Diseño/Implementación técnica (visto en la Fase 2 con Prisma).

## Mapeo del Dominio
El Diagrama de Clases obtenido del repositorio `enmabry/25-26-IdSw1-SdR` ha sido la base para el esquema de Prisma. Sin embargo, se han realizado ciertos ajustes técnicos para asegurar la robustez del sistema:

1.  **Uso de UUIDs**: En lugar de IDs incrementales, se han utilizado UUIDs para todas las entidades clave (`Alumno`, `Profesor`, `Dispensa`). Esto facilita la seguridad y evita la enumeración de recursos en la API.
2.  **Relaciones Muchos a Muchos**: Las relaciones entre `Alumnos` y `Asignaturas` se han implementado mediante tablas de unión implícitas en Prisma, siguiendo el diseño relacional estándar pero simplificando la manipulación desde el código.
3.  **Gestión de Estados**: El ciclo de vida de las dispensas definido en el Diagrama de Estados se refleja en un `enum EstadoDispensa`. Esto garantiza que la lógica de negocio esté tipada desde el nivel de base de datos.

## Estructura de Proyecto (Modelo RUP)
Siguiendo el modelo `pySigHor`, se ha iniciado la organización de artefactos en la carpeta `/RUP`. Esta separación permite mantener la documentación de análisis agnóstica a la tecnología, mientras que el código en `/src` y los esquemas en `/backend` representan la realización técnica de dichos modelos.

## Decisiones de Arquitectura
- **Independencia Tecnológica**: Aunque ya se ha seleccionado React/Vue y Node.js, los modelos en `/RUP/01-analisis` se mantienen conceptuales.
- **Trazabilidad**: Cada tabla en la base de datos tiene una correspondencia directa con una clase del modelo de dominio, asegurando que no se pierdan requisitos durante el desarrollo.
