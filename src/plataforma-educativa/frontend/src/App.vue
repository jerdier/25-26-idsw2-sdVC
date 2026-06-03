<template>
  <div id="app-container">
    <header class="navbar">
      <div class="brand">
        <span class="logo">🎓</span>
        <h1>CGU - Centro de Gestión</h1>
      </div>
      <nav class="nav-links">
        <router-link to="/">Inicio</router-link>
        <router-link to="/login" class="login-btn">Acceso</router-link>
      </nav>
    </header>
    
    <main class="viewport">
      <router-view />
    </main>

    <footer class="footer">
      <p>&copy; 2026 Centro de Gestión Universitaria - Sistema Integrado</p>
    </footer>
  </div>
</template>

<style>
:root {
  --primary: #1a2a6c;
  --secondary: #b21f1f;
  --accent: #fdbb2d;
  --bg: #f8f9fa;
  --text: #2c3e50;
  --white: #ffffff;
}

body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--bg);
  color: var(--text);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 2rem;
  background: var(--primary);
  color: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.brand { display: flex; align-items: center; gap: 10px; }
.brand h1 { font-size: 1.2rem; margin: 0; letter-spacing: 1px; }
.logo { font-size: 1.5rem; }

.nav-links a {
  color: #e0e0e0;
  text-decoration: none;
  margin-left: 20px;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover, .nav-links a.router-link-active { color: var(--accent); }

.login-btn {
  background: var(--accent);
  color: var(--primary) !important;
  padding: 6px 15px;
  border-radius: 4px;
  font-weight: bold;
}

.viewport {
  min-height: calc(100vh - 140px);
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.footer {
  text-align: center;
  padding: 1.5rem;
  background: #e9ecef;
  font-size: 0.85rem;
  color: #6c757d;
}

/* Clases globales para dashboards */
.card {
  background: var(--white);
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  margin-bottom: 1.5rem;
}

.btn-primary {
  background: var(--primary);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}
</style>
