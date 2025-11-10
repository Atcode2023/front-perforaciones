import { getApi } from 'src/utils/apiClient';

export const loginService = async (username: string, password: string) => {
  try {
    const api = await getApi();
    const response = await api.post('auth/login', {
      username,
      password,
    });

    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
  }
};

export const logoutService = async () => {
  try {
    const api = await getApi();
    await api.post('/logout');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

export const putUserService = async (
  payload: {
    username: string;
    password?: string;
  },
  id: string,
) => {
  try {
    const api = await getApi();
    const response = await api.put(`/users/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error('Update user failed:', error);
    throw error;
  }
};
