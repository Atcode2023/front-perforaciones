import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { loginService, putUserService } from 'src/services/auth';
import { useSecureStorage } from './useSecureStorage';
import { Notify } from 'quasar';

// Create a reactive state that will be shared across the app
const secureStorage = useSecureStorage();
const token = ref<string | null>(secureStorage.getItem('auth_token'));
interface User {
  id: number;
  username: string;
  role: string;
}

const user = ref<User | null>(secureStorage.getItem('user'));

export function useAuth() {
  const router = useRouter();

  const isAuthenticated = computed(() => !!token.value);

  const login = async (username: string, password: string) => {
    try {
      const response = await loginService(username, password);

      if (response && response.user) {
        secureStorage.setItem('user', {
          id: response.user._id,
          username: response.user.username,
          role: response.user.role,
        });
        user.value = response.user;
      }

      if (response && response.token) {
        secureStorage.setItem('auth_token', response.token);
        token.value = response.token;
        await router.push('/users');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = () => {
    secureStorage.removeItem('auth_token');
    secureStorage.removeItem('user');
    token.value = null;
    user.value = null;
    void router.push('/login');
  };

  const checkAuth = () => {
    const storedToken = secureStorage.getItem('auth_token');
    if (storedToken) {
      token.value = storedToken;
      const storedUser = secureStorage.getItem('user');
      if (storedUser) {
        user.value = storedUser;
      }
    }
  };

  const updateProfile = async (payload: { username: string; password?: string }) => {
    try {
      const user = secureStorage.getItem('user');

      const response = await putUserService(payload, user.id);

      secureStorage.setItem('user', {
        id: response.data._id,
        username: response.data.username,
        role: response.data.role,
      });
      user.value = secureStorage.getItem('user');

      if (response.success) {
        Notify.create({
          type: 'positive',
          message: response.message,
        });
      }

      return response;
    } catch (error) {
      console.error('Update profile failed:', error);
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    updateProfile,
  };
}
