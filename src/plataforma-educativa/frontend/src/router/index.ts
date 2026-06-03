import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import ProfessorDashboard from '../views/ProfessorDashboard.vue';
import StudentDashboard from '../views/StudentDashboard.vue';
import DirectorDashboard from '../views/DirectorDashboard.vue';
import SecretariaDashboard from '../views/SecretariaDashboard.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/professor', name: 'professor-dashboard', component: ProfessorDashboard },
    { path: '/student', name: 'student-dashboard', component: StudentDashboard },
    { path: '/director', name: 'director-dashboard', component: DirectorDashboard },
    { path: '/secretaria', name: 'secretaria-dashboard', component: SecretariaDashboard },
  ],
});

export default router;
