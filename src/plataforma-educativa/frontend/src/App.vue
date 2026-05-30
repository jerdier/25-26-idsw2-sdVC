<template>
  <header>
    <nav>
      <router-link to="/">Inicio</router-link> |
      <router-link to="/login">Login</router-link>
    </nav>
  </header>
  
  <main>
    <router-view />
  </main>
</template>

<style>
header {
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #ddd;
}
nav a {
  margin-right: 10px;
  color: #2c3e50;
  text-decoration: none;
}
nav a.router-link-active {
  font-weight: bold;
  color: #42b883;
}
main {
  padding: 2rem;
}
</style>
