import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '../services/authService';

import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import ProfessorDashboard from '../views/ProfessorDashboard.vue';
import StudentDashboard from '../views/StudentDashboard.vue';
import DirectorDashboard from '../views/DirectorDashboard.vue';
import SecretariaDashboard from '../views/SecretariaDashboard.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import ProfileView from '../views/ProfileView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
    { path: '/professor', name: 'professor-dashboard', component: ProfessorDashboard, meta: { requiresAuth: true, role: 'professor' } },
    { path: '/student', name: 'student-dashboard', component: StudentDashboard, meta: { requiresAuth: true, role: 'student' } },
    { path: '/director', name: 'director-dashboard', component: DirectorDashboard, meta: { requiresAuth: true, role: 'director' } },
    { path: '/secretaria', name: 'secretaria-dashboard', component: SecretariaDashboard, meta: { requiresAuth: true, role: 'secretaria' } },
    { path: '/administrador', name: 'admin-dashboard', component: AdminDashboard, meta: { requiresAuth: true, role: 'administrador' } },
    ],
    });

    router.beforeEach((to, from, next) => {
  // 1. Leemos los datos directamente del almacenamiento del navegador (es síncrono e inmediato)
  const isAuthenticated = !!localStorage.getItem('cgu_user');
  const userRole = localStorage.getItem('cgu_role'); // Esto devolverá 'administrador', 'secretaria', etc.

  // 2. Si la ruta requiere autenticación y el usuario no está logueado -> Al login
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login');
  }

  // 3. Si ya inició sesión e intenta ir al /login -> Lo mandamos a su panel correcto
  if (to.path === '/login' && isAuthenticated) {
    if (userRole === 'administrador') return next('/administrador');
    if (userRole === 'secretaria') return next('/secretaria');
    if (userRole === 'professor') return next('/professor');
    if (userRole === 'director') return next('/director');
    return next('/student');
  }

  // 4. Protección por Roles: Si la ruta pide un rol y no coincide con el del usuario
  if (to.meta.role) {
    if (to.meta.role !== userRole) {
      // Lo redirigimos forzosamente a la pantalla que le corresponde según su rol real
      if (userRole === 'administrador') return next('/administrador');
      if (userRole === 'secretaria') return next('/secretaria');
      if (userRole === 'professor') return next('/professor');
      if (userRole === 'director') return next('/director');
      return next('/student');
    }
  }

  // 5. Si todo coincide, permitimos el acceso
  next();
});

export default router;
