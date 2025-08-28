import { ref } from 'vue';
import type { Pagination, User } from '../interfaces/models';
import {
  getUsersService,
  createUserService,
  updateUserService,
  deleteUserService,
  getUsersSelectService,
  getUserByIdService,
  getUserRoleUsersSelectService,
  getUserRoleSupervisorSelectService,
} from '../services/user';
import { Notify } from 'quasar';

export function useUsers() {
  const form = ref({
    username: '',
    password: '',
    role: 'USER',
    userId: undefined as string | number | undefined,
  });

  const users = ref<User[]>([]);
  const user = ref<User | null>(null);
  const usersSelect = ref<any[]>([]);
  const pagination = ref<Pagination>();
  const rowsPerPage = ref(5);
  const page = ref(1);
  const userRoleUsersSelect = ref<any[]>([]);
  const userRoleSupervisorSelect = ref<any[]>([]);

  const getUsers = async (search: string, page: number, rowPerPage: number) => {
    try {
      const response = await getUsersService(search, page, rowPerPage);

      console.log('Response from getUsers:', response);

      users.value = response.data.results.map((u: any) => ({
        ...u,
        id: u._id, // para que la tabla use row-key="id"
      }));
      // Adaptar la paginación para Quasar, pero mantener el tipo Pagination para TS
      pagination.value = {
        page: response.data.page,
        pageSize: response.data.limit,
        total: response.data.totalResults,
        pageCount: response.data.totalPages,
      } as Pagination;
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const createUser = async (params: any) => {
    try {
      const response = await createUserService(params);

      if (response.success) {
        Notify.create({
          type: 'positive',
          message: response.message,
        });
      }
    } catch (error) {
      console.log('Error creating user:', error);
    }
  };

  const updateUser = async (params: any, userId: any) => {
    try {
      console.log(params);
      const response = await updateUserService(params, userId);
      if (response.success) {
        Notify.create({
          type: 'positive',
          message: response.message,
        });
      }
    } catch (error) {
      console.log('Error updating user:', error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const response = await deleteUserService(id);

      if (response.success) {
        Notify.create({
          type: 'positive',
          message: response.message,
        });
      }
    } catch (error) {
      console.log('Error deleting user:', error);
    }
  };

  const getUsersSelect = async (filter = '') => {
    try {
      const response = await getUsersSelectService(filter);
      usersSelect.value = response.users;
    } catch (error) {
      console.error('Error fetching users select:', error);
    }
  };

  const getUserById = async (id: number | string) => {
    try {
      const response = await getUserByIdService(id);
      user.value = response.data;
      return response.data;
    } catch (error) {
      console.error('Error fetching user by id:', error);
    }
  };

  const getUserRoleUsersSelect = async () => {
    try {
      const response = await getUserRoleUsersSelectService();
      // Espera que response.data sea el array de usuarios
      userRoleUsersSelect.value = (response?.data ?? []).map((u: any) => ({
        label: u.username,
        value: u._id,
        ...u,
      }));
    } catch (error) {
      console.error('Error fetching user role users select:', error);
    }
  };

  const getUserRoleSupervisorSelect = async () => {
    try {
      const response = await getUserRoleSupervisorSelectService();
      // Espera que response.data sea el array de usuarios
      userRoleSupervisorSelect.value = (response?.data ?? []).map((u: any) => ({
        label: u.username,
        value: u._id,
        ...u,
      }));
    } catch (error) {
      console.error('Error fetching user role users select:', error);
    }
  };

  const traslateNameSelect = (name: string) => {
    switch (name) {
      case 'secretary':
        return 'Secretaria';
      default:
        return name;
    }
  };

  return {
    form,
    users,
    user,
    pagination,
    rowsPerPage,
    page,
    usersSelect,
    userRoleUsersSelect,
    userRoleSupervisorSelect,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getUsersSelect,
    getUserById,
    getUserRoleUsersSelect,
    traslateNameSelect,
    getUserRoleSupervisorSelect,
  };
}
