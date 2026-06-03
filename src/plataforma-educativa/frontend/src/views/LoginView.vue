<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const login = (role: string) => {
  if (role === 'professor') {
    router.push('/professor');
  } else if (role === 'director') {
    router.push('/director');
  } else if (role === 'secretaria') {
    router.push('/secretaria');
  } else {
    router.push('/student');
  }
};
</script>

<template>
  <div class="login">
    <h2>Acceso al Sistema Educativo</h2>
    <div class="form-container">
      <p>Seleccione su perfil de acceso:</p>
      <div class="btn-group">
        <button @click="login('professor')" class="btn-login prof">Área Docente</button>
        <button @click="login('student')" class="btn-login stud">Área Alumno</button>
        <button @click="login('director')" class="btn-login dir">Dirección de Grado</button>
        <button @click="login('secretaria')" class="btn-login sec">Secretaría Académica</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login { padding: 50px; text-align: center; }
.form-container { 
  max-width: 400px; 
  margin: 0 auto; 
  background: white; 
  padding: 30px; 
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}
.btn-group { display: flex; flex-direction: column; gap: 15px; margin-top: 20px; }
.btn-login {
  padding: 12px;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
}
.btn-login:hover { transform: translateY(-2px); }
.prof { background: #3498db; }
.stud { background: #2ecc71; }
.dir { background: #e67e22; }
.sec { background: #1a2a6c; }
</style>
