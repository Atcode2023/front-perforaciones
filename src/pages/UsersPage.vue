<template>
  <q-page class="q-pa-md bg-grey-1">
    <!-- Header mejorado -->
    <div class="q-mb-lg">
      <div class="text-h4 text-primary text-weight-bold q-mb-sm">
        <q-icon name="people" class="q-mr-sm" size="lg" />
        Gestión de Usuarios
      </div>
      <div class="text-subtitle1 text-grey-7">
        Administre y supervise todos los usuarios del sistema
      </div>
      <q-separator color="primary" size="2px" class="q-mt-md" />
    </div>

    <!-- Barra de búsqueda y acciones mejorada -->
    <q-card class="q-mb-lg shadow-3" bordered>
      <q-card-section class="q-pa-lg">
        <div class="row items-center q-col-gutter-md">
          <div class="col-12 col-md-8">
            <q-input
              v-model="search"
              label="Buscar usuarios..."
              placeholder="Username, rol..."
              outlined
              dense
              clearable
              debounce="400"
              @keyup.enter="fetchUsers"
              @update:model-value="fetchUsers"
              class="full-width"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="primary" />
              </template>
              <template v-slot:hint> Busque por username o rol </template>
            </q-input>
          </div>
          <div class="col-12 col-md-4 text-right">
            <q-btn
              color="primary"
              label="Nuevo Usuario"
              icon="person_add"
              @click="openCreateUser"
              unelevated
              size="md"
              class="text-weight-bold full-width-mobile"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabla mejorada -->
    <q-card class="shadow-4" bordered>
      <q-table
        :rows="users"
        :columns="columns"
        row-key="id"
        :loading="loading"
        flat
        hide-pagination
        :pagination="{ rowsPerPage: 0 }"
        class="users-table"
      >
        <template v-slot:top>
          <div class="full-width bg-primary text-white q-pa-md">
            <div class="text-h6 text-weight-bold">
              <q-icon name="table_chart" class="q-mr-sm" />
              Lista de Usuarios
            </div>
            <div class="text-caption">
              {{ users.length }} usuario{{ users.length !== 1 ? 's' : '' }} encontrado{{
                users.length !== 1 ? 's' : ''
              }}
            </div>
          </div>
        </template>

        <template v-slot:header="props">
          <q-tr :props="props" class="bg-grey-3">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="text-weight-bold text-primary"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props" class="hover-row">
            <q-td key="username" :props="props">
              <div class="row items-center">
                <q-avatar color="primary" text-color="white" size="sm" class="q-mr-sm">
                  {{ props.row.username.charAt(0).toUpperCase() }}
                </q-avatar>
                <div>
                  <div class="text-weight-medium">{{ props.row.username }}</div>
                </div>
              </div>
            </q-td>

            <q-td key="role" :props="props">
              <q-chip
                :color="getRoleColor(props.row.role)"
                text-color="white"
                :icon="getRoleIcon(props.row.role)"
                size="md"
                dense
              >
                {{ props.row.role }}
              </q-chip>
            </q-td>

            <q-td key="created_at" :props="props">
              <q-chip color="primary" text-color="white" icon="event" size="md" dense>
                {{ formatDate(props.row.created_at) }}
              </q-chip>
            </q-td>

            <q-td key="actions" :props="props">
              <div class="row justify-center q-gutter-xs">
                <q-btn
                  size="sm"
                  color="secondary"
                  flat
                  round
                  icon="edit"
                  @click="openEditUser(props.row)"
                >
                  <q-tooltip>Editar usuario</q-tooltip>
                </q-btn>
                <q-btn
                  size="sm"
                  color="negative"
                  flat
                  round
                  icon="delete"
                  @click="confirmDeleteUser(props.row)"
                >
                  <q-tooltip>Eliminar usuario</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </q-tr>
        </template>

        <template v-slot:loading>
          <q-inner-loading showing color="primary">
            <div class="column items-center">
              <q-spinner-dots size="50px" />
              <div class="q-mt-md text-body1">Cargando usuarios...</div>
            </div>
          </q-inner-loading>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center text-grey-6 q-gutter-sm q-pa-xl">
            <div class="column items-center">
              <q-icon size="3em" name="people_outline" />
              <div class="text-h6 q-mt-md">No hay usuarios disponibles</div>
              <div class="text-body2 text-center q-mt-sm">
                {{
                  search
                    ? 'No se encontraron usuarios que coincidan con su búsqueda'
                    : 'Comience creando su primer usuario'
                }}
              </div>
              <q-btn
                v-if="!search"
                color="primary"
                label="Crear Primer Usuario"
                icon="person_add"
                @click="openCreateUser"
                class="q-mt-md"
                unelevated
              />
            </div>
          </div>
        </template>
      </q-table>
    </q-card>

    <!-- Paginación mejorada -->
    <div
      class="q-mt-lg flex flex-center"
      v-if="pagination && pagination.total > pagination.pageSize"
    >
      <q-card flat bordered class="q-pa-md">
        <div class="row items-center q-col-gutter-md">
          <div class="col-auto">
            <div class="text-body2 text-grey-7">
              Mostrando {{ (pagination.page - 1) * pagination.pageSize + 1 }} -
              {{ Math.min(pagination.page * pagination.pageSize, pagination.total) }}
              de {{ pagination.total }} usuarios
            </div>
          </div>
          <div class="col-auto">
            <q-pagination
              v-model="pagination.page"
              :max="pagination.pageCount"
              :max-pages="6"
              :boundary-numbers="true"
              @update:model-value="onPageChange"
              color="primary"
              active-design="unelevated"
              active-color="primary"
              active-text-color="white"
            />
          </div>
        </div>
      </q-card>
    </div>

    <!-- Formulario de usuarios -->
    <UsersForm v-if="showForm" v-model="showForm" :user-id="editUserId" @refresh="fetchUsers" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUsers } from 'src/composables/useUsers';
import UsersForm from 'src/components/UsersForm.vue';
import { formatDateDMYHM } from 'src/utils/date';
import { Dialog } from 'quasar';

const { users, getUsers, pagination, rowsPerPage, deleteUser } = useUsers();
const search = ref('');
const loading = ref(false);
const showForm = ref(false);
const editUserId = ref<string | number | null>(null);

// Estadísticas computadas
// const adminUsers = computed(() => {
//   return users.value.filter((user) => user.role === 'ADMIN').length;
// });

const columns = [
  { name: 'username', label: 'Usuario', field: 'username', align: 'left' as const, sortable: true },
  { name: 'role', label: 'Rol', field: 'role', align: 'left' as const, sortable: true },
  {
    name: 'created_at',
    label: 'Fecha Creación',
    field: 'created_at',
    align: 'left' as const,
    sortable: true,
  },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' as const },
];

const formatDate = (val: string) => {
  return formatDateDMYHM(val);
};

const getRoleColor = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return 'red';
    case 'MANAGER':
      return 'orange';
    case 'USER':
    default:
      return 'blue';
  }
};

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return 'admin_panel_settings';
    case 'MANAGER':
      return 'supervisor_account';
    case 'USER':
    default:
      return 'person';
  }
};

const fetchUsers = async () => {
  loading.value = true;
  await getUsers(search.value, pagination.value?.page || 1, rowsPerPage.value).finally(() => {
    loading.value = false;
  });
};

const onPageChange = async (pageNum: number) => {
  if (pagination.value) {
    pagination.value.page = pageNum;
    await fetchUsers();
  }
};

const openEditUser = (user: any) => {
  editUserId.value = user.id || user._id;
  showForm.value = true;
};

const openCreateUser = () => {
  editUserId.value = null;
  showForm.value = true;
};

const confirmDeleteUser = (user: any) => {
  Dialog.create({
    title: 'Confirmar Eliminación',
    message: `¿Está seguro que desea eliminar el usuario "${user.username}"?`,
    html: true,
    cancel: {
      label: 'Cancelar',
      color: 'grey',
      flat: true,
    },
    ok: {
      label: 'Eliminar',
      color: 'negative',
      unelevated: true,
    },
    persistent: true,
  }).onOk(() => {
    const userId = user.id;
    void (async () => {
      try {
        await deleteUser(userId);
        await fetchUsers();
      } catch (error) {
        console.error('Error eliminando usuario:', error);
      }
    })();
  });
};

onMounted(async () => {
  await fetchUsers();
});
</script>

<style scoped>
.users-table {
  border-radius: 8px;
  overflow: hidden;
}

.hover-row:hover {
  background-color: rgba(25, 118, 210, 0.04);
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

.full-width-mobile {
  width: 100%;
}

@media (min-width: 768px) {
  .full-width-mobile {
    width: auto;
  }
}

/* Animaciones suaves */
.q-card {
  transition: box-shadow 0.3s ease;
}

.q-btn:hover {
  transform: translateY(-1px);
  transition: transform 0.2s ease;
}

/* Mejoras para dispositivos móviles */
@media (max-width: 768px) {
  .hover-row:hover {
    transform: none;
  }

  .users-table .q-table__container {
    font-size: 0.875rem;
  }
}

/* Estilos adicionales para avatares y chips */
.q-avatar {
  font-weight: bold;
}

.q-chip {
  font-weight: 500;
}
</style>
