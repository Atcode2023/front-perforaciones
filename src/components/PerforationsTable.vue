<template>
  <q-table
    :rows="perforations"
    :columns="columns"
    row-key="_id"
    flat
    bordered
    dense
    :loading="loading"
    class="perforation-table shadow-2"
    :pagination="{ rowsPerPage: 15 }"
  >
    <template v-slot:top>
      <div class="full-width bg-primary text-white q-pa-md rounded-borders-top">
        <div class="text-h6">
          <q-icon name="table_chart" class="q-mr-sm" />
          Datos de Perforación
        </div>
        <div class="text-caption">Total de registros: {{ perforations.length }}</div>
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
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          <template v-if="col.name === 'created_at'">
            <q-chip color="primary" text-color="white" icon="event" size="sm" dense>
              {{ formatDate(props.row.created_at) }}
            </q-chip>
          </template>

          <template v-else-if="col.name === 'comments'">
            <div v-if="props.row.comments" class="comment-cell">
              <q-icon name="comment" color="grey-6" size="xs" class="q-mr-xs" />
              <span class="text-truncate">{{ props.row.comments }}</span>
              <q-tooltip class="bg-dark text-white" max-width="300px">
                {{ props.row.comments }}
              </q-tooltip>
            </div>
            <div v-else class="text-grey-5 text-center">
              <q-icon name="remove" size="xs" />
            </div>
          </template>

          <template v-else-if="col.name === 'shift'">
            <q-chip
              :color="props.row.shift === 'Día' ? 'orange' : 'indigo'"
              text-color="white"
              :icon="props.row.shift === 'Día' ? 'wb_sunny' : 'nights_stay'"
              size="sm"
              dense
            >
              {{ props.row.shift }}
            </q-chip>
          </template>

          <template v-else-if="col.name === 'actions'">
            <q-td>
              <q-btn
                v-if="canEdit(props.row)"
                icon="edit"
                color="primary"
                size="sm"
                flat
                round
                @click="onEdit(props.row)"
                class="q-mr-xs"
              />
              <q-btn
                v-if="canEdit(props.row)"
                icon="delete"
                color="negative"
                size="sm"
                flat
                round
                @click="onDelete(props.row)"
              />
            </q-td>
          </template>

          <template v-else>
            {{ props.row[col.field] || '-' }}
          </template>
        </q-td>
      </q-tr>
    </template>

    <template v-slot:loading>
      <q-inner-loading showing color="primary">
        <q-spinner-dots size="40px" />
        <div class="q-mt-sm text-body2">Cargando datos...</div>
      </q-inner-loading>
    </template>

    <template v-slot:no-data>
      <div class="full-width row flex-center text-grey-6 q-gutter-sm q-pa-lg">
        <q-icon size="2em" name="info" />
        <span>No hay datos de perforación disponibles</span>
      </div>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { formatDateDMY } from 'src/utils/date';
import type { Perforations } from 'src/interfaces/models';
import { useAuth } from 'src/composables/useAuth';

const { user } = useAuth();
const props = defineProps<{ perforations: Perforations[]; loading?: boolean; project?: any }>();
const emits = defineEmits(['edit', 'delete']);

//const filter = ref('');

const columns = [
  {
    name: 'actions',
    label: 'Acciones',
    field: 'actions',
    align: 'left' as const,
    sortable: false,
  },
  {
    name: 'created_at',
    label: 'Fecha',
    field: 'created_at',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'directional_profile_type',
    label: 'Perfil',
    field: 'directional_profile_type',
    align: 'left' as const,
  },
  { name: 'formation', label: 'Formación', field: 'formation', align: 'left' as const },
  { name: 'bha', label: 'BHA', field: 'bha', align: 'left' as const },
  { name: 'from_time', label: 'Desde (h)', field: 'from_time', align: 'right' as const },
  { name: 'to_time', label: 'Hasta (h)', field: 'to_time', align: 'right' as const },
  { name: 'time', label: 'Tiempo (h)', field: 'time', align: 'right' as const },
  { name: 'activity', label: 'Actividad', field: 'activity', align: 'left' as const },
  {
    name: 'circulates_out_of_background',
    label: 'Circula fuera fondo',
    field: 'circulates_out_of_background',
    align: 'right' as const,
  },
  { name: 'depth_from', label: 'Prof. desde (m)', field: 'depth_from', align: 'right' as const },
  { name: 'depth_to', label: 'Prof. hasta (m)', field: 'depth_to', align: 'right' as const },
  {
    name: 'drilled_meters',
    label: 'Metros perforados',
    field: 'drilled_meters',
    align: 'right' as const,
  },
  { name: 'effective_rop', label: 'ROP efectivo', field: 'effective_rop', align: 'right' as const },
  { name: 'tf_type', label: 'Tipo TF', field: 'tf_type', align: 'left' as const },
  { name: 'tfo', label: 'TFO', field: 'tfo', align: 'left' as const },
  { name: 'rpm_surface', label: 'RPM sup.', field: 'rpm_surface', align: 'right' as const },
  { name: 'total_rpm', label: 'RPM total', field: 'total_rpm', align: 'right' as const },
  { name: 'wob', label: 'WOB', field: 'wob', align: 'right' as const },
  { name: 'caudal', label: 'Caudal', field: 'caudal', align: 'right' as const },
  { name: 'tq_bottom', label: 'TQ fondo', field: 'tq_bottom', align: 'right' as const },
  {
    name: 'tq_out_bottom',
    label: 'TQ fuera fondo',
    field: 'tq_out_bottom',
    align: 'right' as const,
  },
  { name: 'spp_bottom', label: 'SPP fondo', field: 'spp_bottom', align: 'right' as const },
  {
    name: 'spp_out_bottom',
    label: 'SPP fuera fondo',
    field: 'spp_out_bottom',
    align: 'right' as const,
  },
  {
    name: 'differential_pressure',
    label: 'Presión diferencial',
    field: 'differential_pressure',
    align: 'right' as const,
  },
  { name: 'peeg_bottom', label: 'PEEG fondo', field: 'peeg_bottom', align: 'right' as const },
  {
    name: 'peeg_out_bottom',
    label: 'PEEG fuera fondo',
    field: 'peeg_out_bottom',
    align: 'right' as const,
  },
  { name: 'peeg_rotating', label: 'PEEG rotando', field: 'peeg_rotating', align: 'right' as const },
  { name: 'mud_density', label: 'Densidad lodo', field: 'mud_density', align: 'right' as const },
  { name: 'shift', label: 'Turno', field: 'shift', align: 'left' as const },
  { name: 'md', label: 'MD', field: 'md', align: 'right' as const },
  { name: 'tvd', label: 'TVD', field: 'tvd', align: 'right' as const },
  { name: 'incl', label: 'Inclinación', field: 'incl', align: 'right' as const },
  { name: 'az', label: 'Azimut', field: 'az', align: 'right' as const },
  { name: 'dls', label: 'DLS', field: 'dls', align: 'right' as const },
  { name: 'comments', label: 'Comentarios', field: 'comments', align: 'left' as const },
  { name: 'rop_kpi', label: 'ROP KPI', field: 'rop_kpi', align: 'right' as const },
  { name: 'rop_efe_kpi', label: 'ROP EFE KPI', field: 'rop_efe_kpi', align: 'right' as const },
  { name: 'rop_trips', label: 'ROP trips', field: 'rop_trips', align: 'right' as const },
  { name: 'rop_avg', label: 'ROP promedio', field: 'rop_avg', align: 'right' as const },
  {
    name: 'pierced_feet_kpi',
    label: 'Pierced feet KPI',
    field: 'pierced_feet_kpi',
    align: 'right' as const,
  },
  { name: 'formations', label: 'Formaciones', field: 'formations', align: 'left' as const },
];

function formatDate(date: string | Date) {
  return formatDateDMY(date);
}

function onEdit(row: any) {
  emits('edit', row);
}

function onDelete(row: any) {
  emits('delete', row);
}

function canEdit(row: any) {
  // Si no es USER, puede editar todo
  if (user.value?.role !== 'USER') return true;
  // Si no hay project, no puede editar
  if (!props.project) return false;
  // Si es ing_day y el turno es Día
  if (user.value?.username === props.project.ing_day?.username && row.shift === 'Día') return true;
  // Si es ing_night y el turno es Noche
  if (user.value?.username === props.project.ing_night?.username && row.shift === 'Noche')
    return true;
  // Si no coincide, no puede editar
  return false;
}
</script>

<style scoped>
.perforation-table {
  border-radius: 8px;
  overflow: hidden;
}

.hover-row:hover {
  background-color: rgba(25, 118, 210, 0.04);
}

.comment-cell {
  max-width: 150px;
  display: flex;
  align-items: center;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rounded-borders-top {
  border-radius: 8px 8px 0 0;
}
</style>
