<template>
  <div class="login">
    <h2>Iniciar Sesión</h2>
    <div class="form">
      <button @click="login('professor')">Entrar como Profesor</button>
      <button @click="login('student')">Entrar como Alumno</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const login = (role: string) => {
  if (role === 'professor') {
    router.push('/professor');
  } else {
    router.push('/student');
  }
};
</script>
