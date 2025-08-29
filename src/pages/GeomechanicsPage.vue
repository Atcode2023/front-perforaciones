<template>
  <q-page class="q-pa-md bg-grey-1">
    <!-- Header -->
    <div class="q-mb-lg">
      <div class="text-h4 text-primary text-weight-bold q-mb-sm">
        <q-icon name="science" class="q-mr-sm" size="lg" />
        Registros Geomecánicos
      </div>
      <div class="text-subtitle1 text-grey-7">
        Administre y supervise los cortes y parámetros geomecánicos capturados en sitio
      </div>
      <q-separator color="primary" size="2px" class="q-mt-md" />
    </div>

    <!-- Barra de búsqueda / acciones -->
    <q-card class="q-mb-lg shadow-3" bordered>
      <q-card-section class="q-pa-lg">
        <div class="row items-center q-col-gutter-md">
          <div class="col-12 col-md-8">
            <q-input
              v-model="search"
              label="Buscar registros..."
              placeholder="Sección, evento, observaciones..."
              outlined
              dense
              clearable
              debounce="400"
              @update:model-value="applyFilter"
            >
              <template #prepend><q-icon name="search" color="primary" /></template>
            </q-input>
          </div>
          <div class="col-12 col-md-4 text-right">
            <q-btn
              color="primary"
              label="Nuevo Registro"
              icon="add_circle"
              @click="newItem"
              unelevated
              size="md"
              class="text-weight-bold full-width-mobile"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Diálogo Form -->
    <GeomechanicForm v-model="showForm" :edit-item="editItem" @saved="refresh" />
    <GeomechanicDetail v-model="showDetail" :item="detailItem" />

    <!-- Tabla -->
    <q-card class="shadow-4" bordered>
      <q-table
        :rows="paginatedRows"
        :columns="columns"
        row-key="_id"
        :loading="loading"
        flat
        :pagination="{ rowsPerPage: 0 }"
        class="geome-table"
      >
        <template #top>
          <div class="full-width bg-primary text-white q-pa-md">
            <div class="text-h6 text-weight-bold">
              <q-icon name="table_chart" class="q-mr-sm" /> Lista de Registros
            </div>
            <div class="text-caption">
              {{ pagination?.total || filteredRows.length }} registro{{
                (pagination?.total || filteredRows.length) !== 1 ? 's' : ''
              }}
              encontrado{{ (pagination?.total || filteredRows.length) !== 1 ? 's' : '' }}
            </div>
          </div>
        </template>

        <template #header="props">
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

        <template #body="props">
          <q-tr :props="props" class="hover-row">
            <q-td key="section" :props="props">
              <q-badge color="orange" :label="props.row.section" class="q-pa-xs" />
            </q-td>
            <q-td key="hour_24h" :props="props">
              <q-chip color="secondary" text-color="white" dense>{{ props.row.hour_24h }}</q-chip>
            </q-td>
            <q-td key="lag_depth_ft" :props="props">{{ props.row.lag_depth_ft }}</q-td>
            <q-td key="event" :props="props">
              <q-chip dense color="primary" text-color="white">{{
                props.row.event || 'N/A'
              }}</q-chip>
            </q-td>
            <q-td key="derrumbes" :props="props">
              <q-icon
                :name="props.row.derrumbes ? 'check_circle' : 'cancel'"
                :color="props.row.derrumbes ? 'green' : 'grey'"
              />
            </q-td>
            <q-td key="image_url" :props="props">
              <q-img
                v-if="props.row.image_url"
                :src="publicUrl(props.row.image_url)"
                style="width: 80px; height: 50px"
              />
            </q-td>
            <q-td key="actions" :props="props">
              <div class="row justify-center q-gutter-xs">
                <q-btn
                  size="sm"
                  color="secondary"
                  flat
                  round
                  icon="edit"
                  @click.stop="edit(props.row)"
                >
                  <q-tooltip>Editar registro</q-tooltip>
                </q-btn>
                <q-btn
                  size="sm"
                  color="primary"
                  flat
                  round
                  icon="visibility"
                  @click.stop="viewDetail(props.row)"
                >
                  <q-tooltip>Ver detalle</q-tooltip>
                </q-btn>
                <q-btn
                  size="sm"
                  color="negative"
                  flat
                  round
                  icon="delete"
                  @click.stop="remove(props.row)"
                >
                  <q-tooltip>Eliminar registro</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </q-tr>
        </template>

        <template #loading>
          <q-inner-loading showing color="primary">
            <div class="column items-center">
              <q-spinner-dots size="50px" />
              <div class="q-mt-md text-body1">Cargando registros...</div>
            </div>
          </q-inner-loading>
        </template>

        <template #no-data>
          <div class="full-width row flex-center text-grey-6 q-gutter-sm q-pa-xl">
            <div class="column items-center">
              <q-icon size="3em" name="science" />
              <div class="text-h6 q-mt-md">No hay registros disponibles</div>
              <div class="text-body2 text-center q-mt-sm">
                {{
                  search
                    ? 'No se encontraron registros que coincidan con su búsqueda'
                    : 'Comience creando su primer registro geomecánico'
                }}
              </div>
              <q-btn
                v-if="!search"
                color="primary"
                label="Crear Registro"
                icon="add_circle"
                @click="newItem"
                class="q-mt-md"
                unelevated
              />
            </div>
          </div>
        </template>
      </q-table>
    </q-card>

    <!-- Paginación -->
    <div class="q-mt-lg flex flex-center" v-if="pagination && pagination.total > rowsPerPage">
      <q-card flat bordered class="q-pa-md">
        <div class="row items-center q-col-gutter-md">
          <div class="col-auto">
            <q-pagination
              v-model="page"
              :max="pagination.totalPages"
              color="primary"
              boundary-numbers
              @update:model-value="onPageChange"
            />
          </div>
          <div class="col-auto">
            <q-select
              v-model="rowsPerPage"
              :options="[5, 10, 15, 20]"
              dense
              outlined
              label="Filas"
              style="width: 90px"
              @update:model-value="onRowsPerPageChange"
            />
          </div>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useGeomechanics } from 'src/composables/useGeomechanics';
import GeomechanicForm from 'src/components/GeomechanicForm.vue';
import { publicUrl } from 'src/utils/images';
import GeomechanicDetail from 'src/components/GeomechanicDetail.vue';

const { items, list, deleteItem, pagination, rowsPerPage } = useGeomechanics();
const showForm = ref(false);
const showDetail = ref(false);
const editItem = ref<any>(null);
const detailItem = ref<any>(null);
const search = ref('');
const loading = ref(false);
const page = ref(1);

const columns: any[] = [
  { name: 'section', label: 'Sección', field: 'section', align: 'left' },
  { name: 'hour_24h', label: 'Hora', field: 'hour_24h', align: 'left' },
  { name: 'lag_depth_ft', label: 'Lag Depth (ft)', field: 'lag_depth_ft', align: 'right' },
  { name: 'event', label: 'Evento', field: 'event', align: 'left' },
  { name: 'derrumbes', label: 'Derrumbes', field: 'derrumbes', align: 'center' },
  { name: 'image_url', label: 'Imagen', field: 'image_url', align: 'center' },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' },
];

const filteredRows = computed(() => {
  if (!search.value) return items.value;
  const s = search.value.toLowerCase();
  return items.value.filter((r) =>
    [r.section, r.event, r.remarks]
      .filter(Boolean)
      .some((v: any) => v.toString().toLowerCase().includes(s)),
  );
});

// rows actually displayed (server already paginates, but if we client-filter, re-slice)
const paginatedRows = computed(() => {
  if (!pagination || !pagination.value) return filteredRows.value;
  // If server pagination used (search triggers server query), we already have correct page slice
  return filteredRows.value;
});

onMounted(async () => {
  await refresh();
});

watch(search, async () => {
  page.value = 1;
  await refresh();
});

async function refresh() {
  loading.value = true;
  try {
    await list(search.value, page.value, rowsPerPage.value);
  } finally {
    loading.value = false;
  }
}
function edit(row: any) {
  editItem.value = row;
  showForm.value = true;
}
function viewDetail(row: any) {
  detailItem.value = row;
  showDetail.value = true;
}
async function remove(row: any) {
  await deleteItem(row._id);
  await refresh();
}
function newItem() {
  editItem.value = null;
  showForm.value = true;
}
function applyFilter() {
  // Reiniciar a primera página y refrescar (watch también lo hará, pero forzamos inmediatez)
  page.value = 1;
  void refresh();
}

async function onPageChange() {
  await refresh();
}

async function onRowsPerPageChange() {
  page.value = 1;
  await refresh();
}
</script>

<style scoped>
.geome-table {
  border-radius: 8px;
  overflow: hidden;
}
.hover-row:hover {
  background-color: rgba(25, 118, 210, 0.04);
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
.q-card {
  transition: box-shadow 0.3s ease;
}
.q-btn:hover {
  transform: translateY(-1px);
  transition: transform 0.2s ease;
}
</style>
