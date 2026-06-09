<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuth } from '../services/authService';

const { state, logout } = useAuth();
const router = useRouter();

const handleLogout = () => {
  logout();
  router.push('/login');
};

const roleLabels: Record<string, string> = {
  student: 'Estudiante',
  professor: 'Profesor',
  director: 'Director de Grado',
  secretaria: 'Secretaría Académica',
  administrador: 'Administrador'
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
};
</script>

<template>
  <div class="container-wide profile-layout">
    <header class="page-header">
      <div class="header-info">
        <h1>Mi Perfil</h1>
        <p class="dim">Consulta tus datos maestros y configuración de cuenta.</p>
      </div>
    </header>

    <main class="profile-grid">
      <!-- Identidad -->
      <section class="card-base profile-card">
        <div class="identity-header">
          <div class="avatar-l">
            {{ state.user?.nombre?.charAt(0).toUpperCase() }}
          </div>
          <div class="identity-text">
            <span class="role-tag">{{ roleLabels[state.role || ''] }}</span>
            <h2>{{ state.user?.nombre }}</h2>
            <span class="email-dim">{{ state.user?.email }}</span>
          </div>
        </div>

        <div class="details-list">
          <div class="detail-item">
            <label class="form-label">Identificador Único</label>
            <code>{{ state.user?.id }}</code>
          </div>
          <div v-if="state.user?.numeroRegistro" class="detail-item">
            <label class="form-label">Número de Registro</label>
            <code>{{ state.user.numeroRegistro }}</code>
          </div>
          <div class="detail-item">
            <label class="form-label">Fecha de Alta</label>
            <span>{{ formatDate(state.user?.createdAt) }}</span>
          </div>
        </div>
      </section>

      <!-- Seguridad -->
      <section class="card-base settings-card">
        <div class="panel-header"><h3>Acceso y Seguridad</h3></div>
        <div class="settings-content">
          <p class="dim-text">La gestión de contraseñas y permisos está centralizada. Contacte con el administrador para modificaciones críticas.</p>
          
          <div class="account-status">
            <div class="status-marker"></div>
            <span>Cuenta Activa en Servidor Central</span>
          </div>

          <button @click="handleLogout" class="btn-outline btn-logout">Cerrar Sesión de Forma Segura</button>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.profile-layout { max-width: 900px; margin: 0 auto; }
.page-header { margin-bottom: 2.5rem; text-align: center; }
.header-info h1 { font-size: 2rem; font-weight: 700; letter-spacing: -0.02em; color: var(--text-primary); }

.profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }

.profile-card { padding: 2.5rem; }
.identity-header { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1rem; margin-bottom: 2.5rem; padding-bottom: 2.5rem; border-bottom: 1px solid var(--border); }
.avatar-l { width: 80px; height: 80px; background: var(--accent-surface); color: var(--accent-primary); border: 1px solid var(--border); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 700; }

.identity-text h2 { font-size: 1.5rem; font-weight: 600; color: var(--text-primary); margin: 4px 0; }
.role-tag { font-size: 0.75rem; font-weight: 700; color: var(--accent-primary); text-transform: uppercase; letter-spacing: 0.05em; background: var(--bg-input); padding: 4px 10px; border-radius: 99px; }
.email-dim { font-size: 0.9rem; color: var(--text-secondary); }

.details-list { display: flex; flex-direction: column; gap: 1.5rem; }
.detail-item span { font-weight: 500; font-size: 0.95rem; }
.detail-item code { font-family: var(--font-mono); color: var(--text-primary); font-size: 0.85rem; background: var(--bg-input); padding: 4px 8px; border-radius: 4px; border: 1px solid var(--border); }

.settings-card { display: flex; flex-direction: column; }
.panel-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); }
.panel-header h3 { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }

.settings-content { padding: 2rem; display: flex; flex-direction: column; height: 100%; }
.dim-text { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 2rem; }

.account-status { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 600; color: var(--success); margin-bottom: auto; background: var(--success-bg); padding: 12px; border-radius: var(--radius-sm); border: 1px solid rgba(5, 150, 105, 0.2); }
.status-marker { width: 8px; height: 8px; background: var(--success); border-radius: 50%; }

.btn-logout { border-color: var(--error); color: var(--error); margin-top: 2rem; }
.btn-logout:hover { background: var(--error-bg); }

@media (max-width: 768px) { .profile-grid { grid-template-columns: 1fr; } }
</style>
