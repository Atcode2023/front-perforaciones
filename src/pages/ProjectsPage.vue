<template>
  <q-page class="q-pa-md bg-grey-1">
    <!-- Header mejorado -->
    <div class="q-mb-lg">
      <div class="text-h4 text-primary text-weight-bold q-mb-sm">
        <q-icon name="work" class="q-mr-sm" size="lg" />
        Gestión de Proyectos
      </div>
      <div class="text-subtitle1 text-grey-7">
        Administre y supervise todos los proyectos de perforación
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
              label="Buscar proyectos..."
              placeholder="Cliente, pozo, equipo, sección, ingeniero..."
              outlined
              dense
              clearable
              debounce="400"
              @keyup.enter="fetchProjects"
              @update:model-value="fetchProjects"
              class="full-width"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="primary" />
              </template>
              <template v-slot:hint> Busque por cualquier campo del proyecto </template>
            </q-input>
          </div>
          <div class="col-12 col-md-4 text-right">
            <q-btn
              v-if="user?.role === 'ADMIN'"
              color="primary"
              label="Nuevo Proyecto"
              icon="add_circle"
              @click="showForm = true"
              unelevated
              size="md"
              class="text-weight-bold full-width-mobile"
            />
          </div>
        </div>

        <!-- Estadísticas rápidas -->
      </q-card-section>
    </q-card>

    <ProjectsForm
      v-model="showForm"
      :edit-project="editProjectData"
      @refresh="fetchProjects"
      @edited="onProjectEdited"
    />

    <!-- Tabla mejorada -->
    <q-card class="shadow-4" bordered>
      <q-table
        :rows="projects"
        :columns="columns"
        row-key="id"
        :loading="loading"
        flat
        :pagination="{ rowsPerPage: 0 }"
        class="projects-table"
      >
        <template v-slot:top>
          <div class="full-width bg-primary text-white q-pa-md">
            <div class="text-h6 text-weight-bold">
              <q-icon name="table_chart" class="q-mr-sm" />
              Lista de Proyectos
            </div>
            <div class="text-caption">
              {{ projects.length }} proyecto{{ projects.length !== 1 ? 's' : '' }} encontrado{{
                projects.length !== 1 ? 's' : ''
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
          <q-tr :props="props" class="hover-row cursor-pointer" @click="viewProject(props.row)">
            <q-td key="customer" :props="props">
              <div class="row items-center">
                <q-icon name="business" color="primary" class="q-mr-sm" />
                <div>
                  <div class="text-weight-medium">{{ props.row.customer }}</div>
                </div>
              </div>
            </q-td>

            <q-td key="well" :props="props">
              <div class="row items-center">
                <q-icon name="location_on" color="green" class="q-mr-sm" />
                <div class="text-weight-medium">{{ props.row.well }}</div>
              </div>
            </q-td>

            <q-td key="equipment" :props="props">
              <q-chip
                color="secondary"
                text-color="white"
                icon="precision_manufacturing"
                size="md"
                dense
              >
                {{ props.row.equipment }}
              </q-chip>
            </q-td>

            <q-td key="section" :props="props">
              <q-badge color="orange" :label="props.row.section" class="q-pa-xs" />
            </q-td>

            <q-td key="ing_day" :props="props">
              <div class="row items-center">
                <q-icon name="wb_sunny" color="orange" size="sm" class="q-mr-xs" />
                <span class="text-body2">{{ props.row.ing_day.username }}</span>
              </div>
            </q-td>

            <q-td key="supervisor" :props="props">
              <div class="row items-center">
                <q-icon name="supervisor_account" color="teal" size="sm" class="q-mr-xs" />
                <span class="text-body2">{{ props.row.supervisor?.username || '-' }}</span>
              </div>
            </q-td>

            <q-td key="ing_night" :props="props">
              <div class="row items-center">
                <q-icon name="nights_stay" color="indigo" size="sm" class="q-mr-xs" />
                <span class="text-body2">{{ props.row.ing_night.username }}</span>
              </div>
            </q-td>

            <q-td key="start_date" :props="props">
              <q-chip color="primary" text-color="white" icon="event" size="md" dense>
                {{ formatDate(props.row.start_date) }}
              </q-chip>
            </q-td>

            <q-td key="actions" :props="props">
              <div class="row justify-center q-gutter-xs">
                <q-btn
                  size="sm"
                  color="primary"
                  flat
                  round
                  icon="visibility"
                  @click.stop="viewProject(props.row)"
                >
                  <q-tooltip>Ver detalles del proyecto</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="user?.role === 'ADMIN'"
                  size="sm"
                  color="secondary"
                  flat
                  round
                  icon="edit"
                  @click.stop="editProject(props.row)"
                >
                  <q-tooltip>Editar proyecto</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="user?.role === 'ADMIN'"
                  size="sm"
                  color="negative"
                  flat
                  round
                  icon="delete"
                  @click.stop="deleteProject(props.row)"
                >
                  <q-tooltip>Eliminar proyecto</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </q-tr>
        </template>

        <template v-slot:loading>
          <q-inner-loading showing color="primary">
            <div class="column items-center">
              <q-spinner-dots size="50px" />
              <div class="q-mt-md text-body1">Cargando proyectos...</div>
            </div>
          </q-inner-loading>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center text-grey-6 q-gutter-sm q-pa-xl">
            <div class="column items-center">
              <q-icon size="3em" name="work_off" />
              <div class="text-h6 q-mt-md">No hay proyectos disponibles</div>
              <div class="text-body2 text-center q-mt-sm">
                {{
                  search
                    ? 'No se encontraron proyectos que coincidan con su búsqueda'
                    : 'Comience creando su primer proyecto'
                }}
              </div>
              <q-btn
                v-if="!search"
                color="primary"
                label="Crear Primer Proyecto"
                icon="add_circle"
                @click="showForm = true"
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
              de {{ pagination.total }} proyectos
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
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useProjects } from 'src/composables/useProjects';
import ProjectsForm from 'src/components/ProjectsForm.vue';
import { formatDateDMYHM } from 'src/utils/date';
import { useRouter } from 'vue-router';
import { useAuth } from 'src/composables/useAuth';

const router = useRouter();
const { user } = useAuth();

const { projects, getProjects, pagination, rowsPerPage } = useProjects();
const search = ref('');
const loading = ref(false);
const showForm = ref(false);
const editProjectData = ref<any>(null);

const columns = [
  { name: 'customer', label: 'Cliente', field: 'customer', align: 'left' as const, sortable: true },
  { name: 'well', label: 'Pozo', field: 'well', align: 'left' as const, sortable: true },
  { name: 'equipment', label: 'Equipo', field: 'equipment', align: 'left' as const },
  { name: 'section', label: 'Sección', field: 'section', align: 'left' as const },
  {
    name: 'ing_day',
    label: 'Ing. Día',
    field: (row: any) => row.ing_day.username,
    align: 'left' as const,
  },
  {
    name: 'supervisor',
    label: 'Supervisor',
    field: (row: any) => row.supervisor?.username || '-',
    align: 'left' as const,
  },
  {
    name: 'ing_night',
    label: 'Ing. Noche',
    field: (row: any) => row.ing_night.username,
    align: 'left' as const,
  },
  {
    name: 'start_date',
    label: 'Fecha Creación',
    field: 'start_date',
    align: 'left' as const,
    sortable: true,
  },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' as const },
];

const formatDate = (val: string) => {
  return formatDateDMYHM(val);
};

const fetchProjects = async () => {
  loading.value = true;
  await getProjects(search.value, pagination.value?.page || 1, rowsPerPage.value).finally(() => {
    loading.value = false;
  });
};

const onPageChange = async (pageNum: number) => {
  if (pagination.value) {
    pagination.value.page = pageNum;
    await fetchProjects();
  }
};

const viewProject = (project: any) => {
  void router.push({ path: `/projects/${project._id || project.id}` });
};

const editProject = (project: any) => {
  editProjectData.value = project;
  showForm.value = true;
};

const onProjectEdited = async () => {
  editProjectData.value = null;
  await fetchProjects();
};

const deleteProject = async (project: any) => {
  await useProjects().deleteProject(project._id || project.id);
  await fetchProjects();
};

onMounted(async () => {
  await fetchProjects();
});
</script>

<style scoped>
.projects-table {
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

  .projects-table .q-table__container {
    font-size: 0.875rem;
  }
}
</style>
