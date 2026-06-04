<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../services/authService';

const router = useRouter();
const { login: performLogin } = useAuth();

const email = ref('');
const errorMsg = ref('');
const loading = ref(false);

const handleLogin = async () => {
  if (!email.value) {
    errorMsg.value = 'Por favor, introduce tu email académico.';
    return;
  }

  loading.value = true;
  errorMsg.value = '';

  const result = await performLogin(email.value);
  
  if (result.success) {
    // Redirigir según el rol obtenido de la DB
    if (result.role === 'professor') router.push('/professor');
    else if (result.role === 'director') router.push('/director');
    else if (result.role === 'secretaria') router.push('/secretaria');
    else router.push('/student');
  } else {
    errorMsg.value = 'No se encontró ningún usuario con ese email.';
  }
  loading.value = false;
};

// Atajos para pruebas rápidas con datos del seed (Sync con seed.ts)
const quickLogin = (testEmail: string) => {
  email.value = testEmail;
  handleLogin();
};
</script>

<template>
  <div class="login-view">
    <div class="login-card">
      <div class="login-header">
        <span class="icon">🔐</span>
        <h2>Identificación de Usuario</h2>
        <p>Introduce tu correo institucional para acceder al panel</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <label for="email">Correo Electrónico</label>
          <input 
            id="email" 
            v-model="email" 
            type="email" 
            placeholder="ejemplo@universidad.edu"
            required
          />
        </div>

        <div v-if="errorMsg" class="error-alert">{{ errorMsg }}</div>

        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? 'Verificando...' : 'Entrar al Sistema' }}
        </button>
      </form>

      <div class="test-accounts">
        <p>Cuentas de prueba (Seed):</p>
        <div class="chips">
          <button @click="quickLogin('javier.perez@universidad.edu')" class="chip">Profesor</button>
          <button @click="quickLogin('juan@mail.com')" class="chip">Alumno</button>
          <button @click="quickLogin('maria.garcia@universidad.edu')" class="chip">Directora</button>
          <button @click="quickLogin('secretaria@universidad.edu')" class="chip">Secretaría</button>
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
  min-height: 70vh;
}

.login-card {
  background: white;
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 450px;
  text-align: center;
}

.login-header .icon { font-size: 3rem; display: block; margin-bottom: 10px; }
.login-header h2 { margin: 0; color: var(--primary); }
.login-header p { color: #7f8c8d; font-size: 0.9rem; margin: 10px 0 25px; }

.login-form { text-align: left; }
.input-group { margin-bottom: 20px; }
.input-group label { display: block; font-weight: bold; font-size: 0.85rem; margin-bottom: 8px; color: #34495e; }
.input-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
  box-sizing: border-box;
}
.input-group input:focus { border-color: var(--primary); outline: none; }

.btn-submit {
  width: 100%;
  background: var(--primary);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.3s;
}
.btn-submit:hover { opacity: 0.9; }
.btn-submit:disabled { background: #bdc3c7; }

.error-alert {
  background: #fff5f5;
  color: #e74c3c;
  padding: 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  margin-bottom: 20px;
  border-left: 4px solid #e74c3c;
}

.test-accounts {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}
.test-accounts p { font-size: 0.8rem; color: #95a5a6; margin-bottom: 10px; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.chip {
  background: #f1f2f6;
  border: none;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  cursor: pointer;
  color: #57606f;
  transition: background 0.2s;
}
.chip:hover { background: #dfe4ea; }
</style>
