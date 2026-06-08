<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../services/authService';

const { state } = useAuth();
const router = useRouter();

const roleLabels: Record<string, string> = {
  student: 'Estudiante',
  professor: 'Profesor',
  director: 'Director de Grado',
  secretaria: 'Secretaría Académica',
  admin: 'Administrador'
};

const homeRoute = computed(() => {
  if (!state.role) return '/login';
  switch (state.role) {
    case 'student': return '/student';
    case 'professor': return '/professor';
    case 'director': return '/director';
    case 'secretaria': return '/secretaria';
    case 'admin': return '/administrador';
    default: return '/';
  }
});
</script>

<template>
  <nav v-if="state.isAuthenticated" class="navbar-corp">
    <div class="nav-container">
      <router-link :to="homeRoute" class="brand">
        <span class="logo">CGU</span>
        <span class="brand-text">Gestión Universitaria</span>
      </router-link>

      <div class="user-meta">
        <router-link to="/profile" class="profile-access">
          <div class="meta-info">
            <span class="m-name">{{ state.user?.nombre }}</span>
            <span class="m-role">{{ roleLabels[state.role || ''] }}</span>
          </div>
          <div class="meta-avatar">
            {{ state.user?.nombre?.charAt(0).toUpperCase() }}
          </div>
        </router-link>
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

.brand { display: flex; align-items: center; gap: 12px; }
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

.profile-access { 
  display: flex; 
  align-items: center; 
  gap: 12px; 
  padding: 6px; 
  border-radius: var(--radius-md); 
  transition: background 0.2s; 
}
.profile-access:hover { background: var(--bg-main); }

.meta-info { display: flex; flex-direction: column; text-align: right; }
.m-name { font-weight: 600; font-size: 0.85rem; color: var(--text-primary); }
.m-role { font-size: 0.7rem; color: var(--text-secondary); font-weight: 600; }

.meta-avatar { 
  width: 36px; 
  height: 36px; 
  background: var(--accent-surface); 
  border: 1px solid var(--border); 
  color: var(--accent-primary); 
  border-radius: 50%; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  font-weight: 700; 
  font-size: 0.9rem; 
}
</style>
