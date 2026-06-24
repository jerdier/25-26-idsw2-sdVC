# CGU — Centro de Gestión Universitaria

> Sistema que centraliza los procesos de gestión académica en una única plataforma, integrando las operaciones de secretaría, dirección de grado y docentes: gestión de estudiantes, asistencias, dispensas y procedimientos administrativos.

> **Requisitado (CGU):** [github.com/enmabry/25-26-IdSw1-SdR](https://github.com/enmabry/25-26-IdSw1-SdR)

---

## Navegación

| Sección | Descripción |
|---------|-------------|
| [Requisitado](documents/requisitado/README.md) | Actores, casos de uso y modelo del dominio |
| [Análisis](documents/analisis/README.md) | Diagramas de colaboración MVC por caso de uso |
| [Diseño](documents/diseño/README.md) | Diagramas de secuencia por caso de uso |
| [Implementación](src/README.md) | Backend (Node.js + Prisma) y Frontend (Vue 3) |
| [Qué hace](QUE_HACE.md) | Descripción funcional del sistema (primer commit) |
| [Conversation log](conversation-log.md) | Registro cronológico de sesiones de construcción |

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | Vue 3 · TypeScript · Vite · Vue Router |
| **Backend** | Node.js · Express 5 · TypeScript |
| **ORM / DB** | Prisma 7 · PostgreSQL |
| **Estilos** | CSS custom properties (design tokens) |

---

## Roles del sistema

| Rol | Acceso |
|-----|--------|
| `alumno` | Solicitar y gestionar dispensas propias |
| `profesor` | Crear sesiones, registrar asistencia, consultar dispensas |
| `directorDeGrado` | Aprobar o rechazar solicitudes de dispensa |
| `secretaria` | Consultar catálogo de dispensas y expedientes |
| `administrador` | Gestión de usuarios y asignaturas |

---

## Inicio rápido

```bash
# 1. Backend
cd src/plataforma-educativa/backend
npm install
npx prisma db push
npx prisma generate
npx ts-node --project tsconfig.json src/index.ts

# 2. Frontend (en otra terminal)
cd src/plataforma-educativa/frontend
npm install
npm run dev
```

El frontend arranca en `http://localhost:5173` y el backend en `http://localhost:3000`.

---

## Estructura del repositorio

```
25-26-idsw2-sdVC/
├── README.md               ← este archivo
├── QUE_HACE.md             ← descripción funcional (primer commit)
├── conversation-log.md     ← log de construcción
├── documents/              ← documentación de análisis y diseño
├── images/                 ← SVGs exportados de los diagramas
├── modelosUML/             ← fuentes .puml de todos los diagramas
└── src/                    ← código fuente de la aplicación
    └── plataforma-educativa/
        ├── backend/
        └── frontend/
```

---

## Artefactos obligatorios

| # | Artefacto | Estado |
|---|-----------|--------|
| 0 | `QUE_HACE.md` | Primer commit, sin modificar |
| 1 | `README.md` | Este archivo |
| 2 | Código fuente | [`/src`](src/README.md) |
| 3 | Diagramas UML | [Fuentes `.puml`](modelosUML/README.md) — [SVGs](images/README.md) |
| 4 | Documentación | [`/documents`](documents/README.md) |
| 5 | `conversation-log.md` | [`conversation-log.md`](conversation-log.md) |
