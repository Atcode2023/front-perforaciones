import { defineBoot } from '#q-app/wrappers';
import axios, { type AxiosInstance } from 'axios';
import { Notify } from 'quasar';
import SecureLS from 'secure-ls';
import { useRouter } from 'vue-router';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: 'https://api.colibrioil.com/' });
const ls = new SecureLS({ encodingType: 'aes' });

// Interceptor para agregar el token de autenticación en el header Authorization
// Usar SecureLS para obtener el token, igual que en useAuth
api.interceptors.request.use(
  (config) => {
    const token = ls.get('auth_token');
    if (token) {
      if (config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(new Error(error?.message || 'Request error')),
);

// Interceptor de respuesta para mostrar errores con Notify
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    if (status === 401) {
      Notify.create({
        type: 'negative',
        message: 'No autorizado (401). Por favor, inicia sesión de nuevo.',
      });
      const router = useRouter();
      await router.push('login'); // Redirige a la ruta login
      return Promise.reject(new Error('Unauthorized'));
    }

    let message = 'Ocurrió un error inesperado';
    if (status === 400) message = 'Solicitud incorrecta (400)';
    if (status === 404) message = 'Recurso no encontrado (404)';
    if (status === 500) message = 'Error interno del servidor (500)';
    if ([400, 404, 500].includes(status)) {
      Notify.create({ type: 'negative', message });
    }
    return Promise.reject(new Error(error?.message || 'Request error'));
  },
);

export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
