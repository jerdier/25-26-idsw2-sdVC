# Frontend — CGU

[← Código fuente](../../README.md) · [← Inicio](../../../README.md) · [Backend](../backend/)

SPA en Vue 3 + TypeScript + Vite que consume la API REST del backend.

---

## Arranque

```bash
cd src/plataforma-educativa/frontend
npm install
npm run dev
```

Disponible en `http://localhost:5173`.

---

## Vistas y rutas

| Ruta | Vista | Rol requerido |
|------|-------|---------------|
| `/login` | `LoginView.vue` | — |
| `/student` | `StudentDashboard.vue` | `alumno` |
| `/professor` | `ProfessorDashboard.vue` | `profesor` |
| `/director` | `DirectorDashboard.vue` | `directorDeGrado` |
| `/secretaria` | `SecretariaDashboard.vue` | `secretaria` |
| `/admin` | `AdminDashboard.vue` | `administrador` |

El router redirige a `/login` si no hay sesión activa, y a la ruta del rol propio si se intenta acceder a una ruta ajena.

---

## Estructura

```
src/
├── App.vue              ← barra de navegación + <RouterView>
├── main.ts              ← punto de entrada
├── router/
│   └── index.ts         ← rutas y guardas por rol
├── views/
│   ├── LoginView.vue
│   ├── StudentDashboard.vue
│   ├── ProfessorDashboard.vue
│   ├── DirectorDashboard.vue
│   ├── SecretariaDashboard.vue
│   └── AdminDashboard.vue
├── services/
│   ├── api.ts           ← instancia Axios (baseURL: localhost:3000/api)
│   ├── authService.ts   ← login, logout, estado de sesión
│   ├── academicService.ts
│   ├── attendanceService.ts
│   ├── dispensaService.ts
│   └── secretariaService.ts
└── types/
    └── index.ts         ← interfaces TypeScript compartidas
```

---

## Autenticación

- `POST /api/auth/login` devuelve el objeto usuario con su `rol`.
- El frontend guarda `cgu_user` y `cgu_role` en `localStorage`.
- Al recargar la página, el router lee `localStorage` y redirige al dashboard correcto.
- `logout()` limpia `localStorage` y redirige a `/login`.
