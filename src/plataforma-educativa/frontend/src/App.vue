<script setup lang="ts">
import { useAuth } from './services/authService';
import { useRouter } from 'vue-router';

const { state, logout: performLogout } = useAuth();
const router = useRouter();

const handleLogout = () => {
  performLogout();
  router.push('/login');
};
</script>

<template>
  <div id="app-container">
    <header class="navbar">
      <div class="brand">
        <span class="logo">🎓</span>
        <h1>CGU - Centro de Gestión</h1>
      </div>
      <nav class="nav-links">
        <router-link to="/">Inicio</router-link>
        <template v-if="!state.isAuthenticated">
          <router-link to="/login" class="login-btn">Acceso</router-link>
        </template>
        <template v-else>
          <div class="user-info">
            <span>{{ state.user?.nombre }}</span>
            <span class="role-tag-small">{{ state.role }}</span>
            <button @click="handleLogout" class="logout-btn">Salir</button>
          </div>
        </template>
      </nav>
    </header>
    
    <main class="viewport">
      <router-view />
    </main>

    <footer class="footer">
      <p>&copy; 2026 Centro de Gestión Universitaria - Sistema Integrado</p>
    </footer>
  </div>
</template>

<style>
:root {
  --primary: #1a2a6c;
  --primary-dark: #0f172a;
  --secondary: #b21f1f;
  --accent: #fdbb2d;
  --bg: #f8fafc;
  --text: #1e293b;
  --text-light: #64748b;
  --white: #ffffff;
  --border: #e2e8f0;
}

body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--bg);
  color: var(--text);
  line-height: 1.5;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 72px;
  background: var(--white);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.brand { display: flex; align-items: center; gap: 12px; }
.brand h1 { font-size: 1.25rem; margin: 0; font-weight: 800; color: var(--primary); letter-spacing: -0.5px; }
.logo { font-size: 1.75rem; }

.nav-links { display: flex; align-items: center; gap: 1.5rem; }
.nav-links a {
  color: var(--text-light);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.nav-links a:hover, .nav-links a.router-link-active { color: var(--primary); }

.login-btn {
  background: var(--primary);
  color: white !important;
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: 700;
}

.login-btn:hover { background: var(--primary-dark); }

.user-info {
  font-size: 0.9rem;
  color: var(--text-light);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;
}

.role-tag-small {
  background: #f1f5f9;
  color: #475569;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}

.logout-btn {
  background: white;
  border: 1px solid var(--border);
  color: var(--text);
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;
}

.logout-btn:hover { background: #f8fafc; border-color: var(--text-light); }

.viewport {
  min-height: calc(100vh - 72px - 80px);
  padding: 0;
}

.footer {
  text-align: center;
  padding: 2rem;
  background: var(--white);
  font-size: 0.875rem;
  color: var(--text-light);
  border-top: 1px solid var(--border);
}

/* Clases globales para dashboards */
.card {
  background: var(--white);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
</style>
