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
  if (!email.value || !password.value) {
    errorMsg.value = 'Por favor, introduce tus credenciales.';
    return;
  }

  loading.value = true;
  errorMsg.value = '';

  const result = await performLogin(email.value, password.value);
  
  if (result.success) {
    if (result.role === 'professor') router.push('/professor');
    else if (result.role === 'director') router.push('/director');
    else if (result.role === 'secretaria') router.push('/secretaria');
    else router.push('/student');
  } else {
    errorMsg.value = 'Email o contraseña incorrectos.';
  }
  loading.value = false;
};

// Atajos para pruebas rápidas con datos del seed (Sync con seed.ts)
const quickLogin = (testEmail: string) => {
  email.value = testEmail;
  password.value = 'password123';
  handleLogin();
};
</script>

<template>
  <div class="login-view">
    <div class="login-container">
      <div class="brand-section">
        <div class="logo">CGU</div>
        <h1>Centro de Gestión Universitaria</h1>
        <p>Plataforma Integral de Servicios Académicos</p>
      </div>

      <div class="login-card">
        <div class="login-header">
          <h2>Acceso al Portal</h2>
          <p>Utilice sus credenciales institucionales</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="input-group">
            <label for="email">Correo Institucional</label>
            <div class="input-wrapper">
              <span class="input-icon">📧</span>
              <input 
                id="email" 
                v-model="email" 
                type="email" 
                placeholder="usuario@universidad.edu"
                required
              />
            </div>
          </div>

          <div class="input-group">
            <label for="password">Contraseña</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input 
                id="password" 
                v-model="password" 
                type="password" 
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div v-if="errorMsg" class="error-alert">{{ errorMsg }}</div>

          <button type="submit" class="btn-submit" :disabled="loading">
            {{ loading ? 'Iniciando sesión...' : 'Entrar al Sistema' }}
          </button>
        </form>

        <div class="test-accounts">
          <p>Entornos de Validación (Demo):</p>
          <div class="chips">
            <button @click="quickLogin('test.docente1@universidad.edu')" class="chip">Docente 1</button>
            <button @click="quickLogin('test.alumno1@mail.com')" class="chip">Alumno 1</button>
            <button @click="quickLogin('test.director1@universidad.edu')" class="chip">Director 1</button>
            <button @click="quickLogin('test.secretaria1@universidad.edu')" class="chip">Secretaría 1</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
  font-family: 'Inter', -apple-system, sans-serif;
}

.login-container {
  display: flex;
  width: 1000px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.brand-section {
  flex: 1;
  background: #1a2a6c;
  color: white;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
}

.logo {
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: -2px;
  margin-bottom: 20px;
}

.brand-section h1 {
  font-size: 2.2rem;
  line-height: 1.1;
  margin-bottom: 15px;
}

.brand-section p {
  opacity: 0.8;
  font-size: 1.1rem;
}

.login-card {
  flex: 1.2;
  padding: 60px;
  background: white;
}

.login-header {
  margin-bottom: 40px;
}

.login-header h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 8px;
}

.login-header p {
  color: #95a5a6;
  font-size: 0.95rem;
}

.input-group {
  margin-bottom: 25px;
}

.input-group label {
  display: block;
  font-weight: 600;
  font-size: 0.85rem;
  margin-bottom: 8px;
  color: #34495e;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  font-size: 1.1rem;
  pointer-events: none;
}

.input-wrapper input {
  width: 100%;
  padding: 14px 14px 14px 40px;
  border: 2px solid #f1f2f6;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s;
  background: #f8f9fa;
}

.input-wrapper input:focus {
  border-color: #1a2a6c;
  background: white;
  outline: none;
  box-shadow: 0 0 0 4px rgba(26, 42, 108, 0.1);
}

.btn-submit {
  width: 100%;
  background: #1a2a6c;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
}

.btn-submit:hover {
  background: #243b55;
  transform: translateY(-1px);
}

.btn-submit:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.error-alert {
  background: #fee2e2;
  color: #991b1b;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  margin-bottom: 20px;
  border: 1px solid #fecaca;
}

.test-accounts {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #f1f2f6;
}

.test-accounts p {
  font-size: 0.8rem;
  color: #95a5a6;
  margin-bottom: 15px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip {
  background: #f1f2f6;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  color: #57606f;
  transition: all 0.2s;
}

.chip:hover {
  background: #1a2a6c;
  color: white;
}

@media (max-width: 1024px) {
  .login-container {
    width: 90%;
    flex-direction: column;
  }
  .brand-section {
    padding: 40px;
  }
  .login-card {
    padding: 40px;
  }
}
</style>
