import { getApi } from 'src/utils/apiClient';

export const getUsersService = async (search: string, page: number, rowPerPage: number) => {
  try {
    const api = await getApi();
    const response = await api.get('/users', {
      params: { search, page, limit: rowPerPage },
    });

    return response.data;
  } catch (error) {
    console.log('Error fetching users:', error);
  }
};

export const createUserService = async (params: any) => {
  try {
    const api = await getApi();
    const response = await api.post('/users', params);

    return response.data;
  } catch (error) {
    console.log('Error creating user:', error);
  }
};

export const updateUserService = async (params: any, id: string) => {
  try {
    const api = await getApi();
    const response = await api.put(`/users/${id}`, params);
    return response.data;
  } catch (error) {
    console.log('Error updating user:', error);
  }
};

export const deleteUserService = async (id: string) => {
  try {
    const api = await getApi();
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.log('Error deleting user:', error);
  }
};

export const getRolesSelectService = async () => {
  try {
    const api = await getApi();
    const response = await api.get('/users/roles/select');
    return response.data;
  } catch (error) {
    console.log('Error fetching roles:', error);
  }
};

export const getUsersSelectService = async (filter = '') => {
  try {
    const api = await getApi();
    const response = await api.get('/user/select', {
      params: { search: filter },
    });
    return response.data;
  } catch (error) {
    console.log('Error fetching users select:', error);
  }
};

export const getUserByIdService = async (id: number | string) => {
  try {
    const api = await getApi();
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.log('Error fetching user by id:', error);
  }
};

export const getUserRoleUsersSelectService = async () => {
  try {
    const api = await getApi();
    const response = await api.get('/users/role/users');
    return response.data;
  } catch (error) {
    console.log('Error fetching user role users:', error);
  }
};

export const getUserRoleSupervisorSelectService = async () => {
  try {
    const api = await getApi();
    const response = await api.get('/users/role/supervisor');
    return response.data;
  } catch (error) {
    console.log('Error fetching user role users:', error);
  }
};
