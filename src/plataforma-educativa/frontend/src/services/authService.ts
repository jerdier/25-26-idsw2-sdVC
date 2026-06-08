import { reactive, readonly } from 'vue';
import api from '../services/api';

interface UserState {
  user: any | null;
  role: 'student' | 'professor' | 'director' | 'secretaria' | 'administrador' | null;
  isAuthenticated: boolean;
  directorId?: string;
}

const state = reactive<UserState>({
  user: JSON.parse(localStorage.getItem('cgu_user') || 'null'),
  role: localStorage.getItem('cgu_role') as any || null,
  isAuthenticated: !!localStorage.getItem('cgu_user'),
  directorId: localStorage.getItem('cgu_director_id') || undefined
});

export const useAuth = () => {
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, role, directorId } = response.data;

      state.user = user;
      state.role = role;
      state.isAuthenticated = true;
      state.directorId = directorId;

      localStorage.setItem('cgu_user', JSON.stringify(user));
      localStorage.setItem('cgu_role', role);
      if (directorId) localStorage.setItem('cgu_director_id', directorId);

      return { success: true, role };
    } catch (error: any) {
      console.error('Login failed:', error);
      const message = error.response?.data?.message || 'Error de conexión con el servidor';
      return { success: false, message };
    }
  };

  const logout = () => {
    state.user = null;
    state.role = null;
    state.isAuthenticated = false;
    state.directorId = undefined;
    localStorage.removeItem('cgu_user');
    localStorage.removeItem('cgu_role');
    localStorage.removeItem('cgu_director_id');
  };

  return {
    state: readonly(state),
    login,
    logout
  };
};
