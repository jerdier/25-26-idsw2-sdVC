# Código fuente

[← Inicio](../README.md) · [Modelos UML](../modelosUML/README.md) · [Documentos](../documents/README.md)

Implementación de la plataforma CGU dividida en backend y frontend.

---

## Estructura

```
src/
└── plataforma-educativa/
    ├── backend/            ← API REST (Node.js + Express + Prisma)
    └── frontend/           ← SPA (Vue 3 + TypeScript + Vite)
```

---

## Backend

**Stack:** Node.js · Express 5 · TypeScript · Prisma 7 · PostgreSQL

```
backend/
├── prisma/
│   └── schema.prisma       ← modelos de datos
├── src/
│   ├── controllers/        ← manejadores HTTP
│   ├── services/           ← lógica de negocio
│   ├── routes/             ← definición de rutas
│   ├── lib/                ← cliente Prisma
│   └── index.ts            ← entrada de la aplicación
├── prisma.config.ts
└── tsconfig.json
```

**Arranque:**
```bash
cd src/plataforma-educativa/backend
npm install
npx prisma db push
npx prisma generate
npx ts-node --project tsconfig.json src/index.ts
```

API disponible en `http://localhost:3000`.

---

## Frontend

**Stack:** Vue 3 · TypeScript · Vite · Vue Router

Ver [README del frontend](plataforma-educativa/frontend/README.md) para detalles de vistas y rutas.

**Arranque:**
```bash
cd src/plataforma-educativa/frontend
npm install
npm run dev
```

Aplicación disponible en `http://localhost:5173`.

---

## Variables de entorno

El backend necesita un archivo `.env` en `src/plataforma-educativa/backend/` con:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/gestor_educativo"
```
