<template>
  <div class="home">
    <h1>Bienvenido al Sistema CGU</h1>
    <p>Centro de Gestión Universitaria</p>
    <div class="actions">
      <router-link to="/login" class="btn">Iniciar Sesión</router-link>
    </div>
  </div>
</template>

<style scoped>
.home {
  text-align: center;
  padding: 2rem;
}
.btn {
  background-color: #42b883;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
}
</style>
