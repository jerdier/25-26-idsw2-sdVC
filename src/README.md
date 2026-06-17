# Código fuente

> | [Inicio](../README.md) | [Documentos](../documents/README.md) |
> |---|---|

Aplicación web full-stack en `src/plataforma-educativa/`.

---

## Estructura

```
src/plataforma-educativa/
├── backend/               Node.js · Express · TypeScript · Prisma
│   ├── prisma/
│   │   └── schema.prisma  modelos de base de datos
│   └── src/
│       ├── controllers/   AcademicController, AttendanceController, DispensaController...
│       ├── services/      AcademicService, AttendanceService, DispensaService...
│       ├── routes/        endpoints REST
│       ├── types/         DTOs e interfaces TypeScript
│       └── index.ts       entrada de Express
└── frontend/              Vue 3 · TypeScript · Vite · Vue Router
    └── src/
        ├── views/         AdminDashboard, ProfessorDashboard, StudentDashboard...
        ├── services/      attendanceService, dispensaService, authService...
        └── router/        rutas por rol
```

---

## Arranque rápido

```bash
# Backend
cd src/plataforma-educativa/backend
npm install
npx prisma db push
npx prisma generate
npx ts-node --project tsconfig.json src/index.ts

# Frontend (en otra terminal)
cd src/plataforma-educativa/frontend
npm install
npm run dev
```

Frontend en `http://localhost:5173` · Backend en `http://localhost:3000`
