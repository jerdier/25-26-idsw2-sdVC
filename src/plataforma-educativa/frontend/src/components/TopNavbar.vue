<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../services/authService';

const { state, logout } = useAuth();
const router = useRouter();

const roleLabels: Record<string, string> = {
  alumno: 'Alumno',
  profesor: 'Profesor',
  directorDeGrado: 'Director de Grado',
  secretaria: 'Secretaría Académica',
  administrador: 'Administrador'
};

const homeRoute = computed(() => {
  if (!state.role) return '/login';
  switch (state.role) {
    case 'alumno': return '/alumno';
    case 'profesor': return '/profesor';
    case 'directorDeGrado': return '/director';
    case 'secretaria': return '/secretaria';
    case 'administrador': return '/administrador';
    default: return '/';
  }
});

const handleLogout = () => {
  logout();
  router.push('/login');
};
</script>

<template>
  <nav v-if="state.isAuthenticated" class="navbar-corp">
    <div class="nav-container">
      <router-link :to="homeRoute" class="brand">
        <span class="logo">CGU</span>
        <span class="brand-text">Gestión Universitaria</span>
      </router-link>

      <div class="user-meta">
        <div class="meta-info">
          <span class="m-name">{{ state.user?.nombre }}</span>
          <span class="m-role">{{ roleLabels[state.role || ''] }}</span>
        </div>
        <div class="meta-avatar">
          {{ state.user?.nombre?.charAt(0).toUpperCase() }}
        </div>
        <button class="btn-logout" @click="handleLogout">Salir</button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar-corp {
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  height: 64px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
}
.nav-container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand { display: flex; align-items: center; gap: 12px; text-decoration: none; }
.logo {
  background: var(--text-primary);
  color: var(--bg-card);
  font-weight: 800;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
}
.brand-text {
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.user-meta { display: flex; align-items: center; gap: 12px; }
.meta-info { display: flex; flex-direction: column; text-align: right; }
.m-name { font-weight: 600; font-size: 0.85rem; color: var(--text-primary); }
.m-role { font-size: 0.7rem; color: var(--text-secondary); font-weight: 600; }

.meta-avatar {
  width: 36px;
  height: 36px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
}

.btn-logout {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 6px 14px;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.15s;
}
.btn-logout:hover { border-color: var(--error); color: var(--error); background: var(--error-bg); }
</style>
