import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import ProfesorDashboard from '../views/ProfesorDashboard.vue';
import AlumnoDashboard from '../views/AlumnoDashboard.vue';
import DirectorDeGradoDashboard from '../views/DirectorDeGradoDashboard.vue';
import SecretariaDashboard from '../views/SecretariaDashboard.vue';
import AdministradorDashboard from '../views/AdministradorDashboard.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/profesor', name: 'profesor-dashboard', component: ProfesorDashboard, meta: { requiresAuth: true, role: 'profesor' } },
    { path: '/alumno', name: 'alumno-dashboard', component: AlumnoDashboard, meta: { requiresAuth: true, role: 'alumno' } },
    { path: '/director', name: 'director-dashboard', component: DirectorDeGradoDashboard, meta: { requiresAuth: true, role: 'directorDeGrado' } },
    { path: '/secretaria', name: 'secretaria-dashboard', component: SecretariaDashboard, meta: { requiresAuth: true, role: 'secretaria' } },
    { path: '/administrador', name: 'admin-dashboard', component: AdministradorDashboard, meta: { requiresAuth: true, role: 'administrador' } }
  ]
});

router.beforeEach((to, _from, next) => {
  const isAuthenticated = !!localStorage.getItem('cgu_user');
  const userRole = localStorage.getItem('cgu_role');

  if (to.meta.requiresAuth && !isAuthenticated) return next('/login');

  if (to.path === '/login' && isAuthenticated) {
    if (userRole === 'administrador') return next('/administrador');
    if (userRole === 'secretaria') return next('/secretaria');
    if (userRole === 'profesor') return next('/profesor');
    if (userRole === 'directorDeGrado') return next('/director');
    return next('/alumno');
  }

  if (to.meta.role && to.meta.role !== userRole) {
    if (userRole === 'administrador') return next('/administrador');
    if (userRole === 'secretaria') return next('/secretaria');
    if (userRole === 'profesor') return next('/profesor');
    if (userRole === 'directorDeGrado') return next('/director');
    return next('/alumno');
  }

  next();
});

export default router;
