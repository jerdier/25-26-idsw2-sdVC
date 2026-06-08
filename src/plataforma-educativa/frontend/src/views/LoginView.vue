<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../services/authService';

const router = useRouter();
const { login: performLogin } = useAuth();

const email = ref('');
const password = ref('');
const errorMsg = ref('');
const loading = ref(false);

const handleLogin = async () => {
  if (!email.value || !password.value) return;
  loading.value = true;
  errorMsg.value = '';

  const result = await performLogin(email.value, password.value);
  
  if (result.success) {
    if (result.role === 'administrador') router.push('/administrador');
    else if (result.role === 'secretaria') router.push('/secretaria');
    else if (result.role === 'professor') router.push('/professor');
    else if (result.role === 'director') router.push('/director');
    else router.push('/student');
  } else {
    errorMsg.value = result.message || 'Error de autenticación.';
  }
  loading.value = false;
};

const quickLogin = (e: string, p: string = 'password123') => { 
  email.value = e; 
  password.value = p; 
  handleLogin(); 
};
</script>

<template>
  <div class="login-corp">
    <div class="login-wrapper card-base">
      <header class="login-header">
        <div class="logo-box">CGU</div>
        <h1>Bienvenido de nuevo</h1>
        <p>Inicie sesión en el Centro de Gestión Universitaria</p>
      </header>

      <form @submit.prevent="handleLogin" class="form-corp">
        <div class="f-row">
          <label class="form-label">Correo Institucional</label>
          <input v-model="email" type="email" class="form-input" placeholder="usuario@universidad.edu" required />
        </div>
        <div class="f-row">
          <label class="form-label">Contraseña</label>
          <input v-model="password" type="password" class="form-input" placeholder="••••••••" required />
        </div>

        <div v-if="errorMsg" class="alert-err">{{ errorMsg }}</div>

        <button type="submit" class="btn-primary btn-full" :disabled="loading">
          {{ loading ? 'Autenticando...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <footer class="demo-zone">
        <label class="form-label text-center">Entorno de Pruebas</label>
        <div class="btn-grid">
          <button class="btn-outline" @click="quickLogin('test.alumno1@mail.com')">Alumno</button>
          <button class="btn-outline" @click="quickLogin('test.profesor1@universidad.edu')">Profesor</button>
          <button class="btn-outline" @click="quickLogin('test.director1@universidad.edu')">Director</button>
          <button class="btn-outline" @click="quickLogin('test.secretaria1@universidad.edu')">Secretaría</button>
          <button class="btn-outline root" @click="quickLogin('admin@universidad.edu', 'admin123')">Administrador</button>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.login-corp { 
  min-height: 100vh; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  background: var(--bg-main); 
  padding: 1rem;
}
.login-wrapper { 
  width: 100%; 
  max-width: 480px; 
  padding: 3rem 2.5rem; 
  box-shadow: var(--shadow-lg);
}

.login-header { text-align: center; margin-bottom: 2.5rem; }
.logo-box { 
  display: inline-flex; 
  align-items: center; 
  justify-content: center;
  background: var(--text-primary); 
  color: var(--bg-card); 
  width: 48px;
  height: 48px;
  border-radius: 12px; 
  font-weight: 800; 
  font-size: 1.1rem; 
  margin-bottom: 1.5rem; 
}
.login-header h1 { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em; }
.login-header p { font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.5rem; }

.form-corp { display: flex; flex-direction: column; gap: 1.5rem; }
.btn-full { width: 100%; margin-top: 0.5rem; padding: 0.85rem; font-size: 0.9rem; }

.alert-err { 
  background: var(--error-bg); 
  color: var(--error); 
  padding: 1rem; 
  border-radius: var(--radius-sm); 
  font-size: 0.85rem; 
  font-weight: 500; 
  border: 1px solid rgba(220, 38, 38, 0.2);
}

.demo-zone { margin-top: 3rem; border-top: 1px solid var(--border); padding-top: 2rem; }
.text-center { text-align: center; margin-bottom: 1rem; }
.btn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.btn-grid button { padding: 0.6rem; font-size: 0.75rem; }
.root { grid-column: span 2; border-color: var(--border); color: var(--text-primary); }
.root:hover { border-color: var(--accent-primary); color: var(--accent-primary); }
</style>
