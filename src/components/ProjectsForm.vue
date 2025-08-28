<template>
  <q-dialog v-model="dialogValue" persistent>
    <q-card style="min-width: 600px; max-width: 800px" class="shadow-10">
      <!-- Header mejorado -->
      <q-card-section class="bg-gradient-primary text-white q-pa-lg">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h5 text-weight-bold">
              <q-icon :name="props.editProject ? 'edit' : 'add_circle'" class="q-mr-sm" size="md" />
              {{ props.editProject ? 'Editar Proyecto' : 'Crear Nuevo Proyecto' }}
            </div>
            <div class="text-subtitle1 opacity-80">
              Complete la información básica del proyecto de perforación
            </div>
          </div>
          <div class="col-auto">
            <q-btn flat round dense icon="close" v-close-popup class="text-white" size="md" />
          </div>
        </div>
      </q-card-section>

      <!-- Contenido del formulario -->
      <q-card-section class="q-pa-lg">
        <q-form @submit.prevent="submit" ref="formRef">
          <!-- Sección Cliente y Pozo -->
          <div class="text-h6 text-primary q-mb-md">
            <q-icon name="business" class="q-mr-sm" />
            Información del Cliente
          </div>
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.customer"
                label="Cliente"
                :rules="[(val) => !!val || 'Este campo es requerido']"
                outlined
                autofocus
              >
                <template v-slot:prepend>
                  <q-icon name="business" color="primary" />
                </template>
                <template v-slot:hint> Nombre de la empresa cliente </template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.well"
                label="Pozo"
                :rules="[(val) => !!val || 'Este campo es requerido']"
                outlined
              >
                <template v-slot:prepend>
                  <q-icon name="location_on" color="green" />
                </template>
                <template v-slot:hint> Identificación del pozo </template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.uwi_sidetrack"
                label="UWI Sidetrack"
                :rules="[(val) => !!val || 'Este campo es requerido']"
                outlined
              >
                <template v-slot:prepend>
                  <q-icon name="code" color="secondary" />
                </template>
                <template v-slot:hint> Unique Well Identifier Sidetrack </template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.equipment"
                label="Equipo"
                :rules="[(val) => !!val || 'Este campo es requerido']"
                outlined
              >
                <template v-slot:prepend>
                  <q-icon name="precision_manufacturing" color="orange" />
                </template>
                <template v-slot:hint> Equipo de perforación asignado </template>
              </q-input>
            </div>
          </div>

          <!-- Sección Técnica -->
          <q-separator class="q-my-lg" />
          <div class="text-h6 text-primary q-mb-md">
            <q-icon name="engineering" class="q-mr-sm" />
            Información Técnica
          </div>
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.section"
                label="Sección"
                :rules="[(val) => !!val || 'Este campo es requerido']"
                outlined
              >
                <template v-slot:prepend>
                  <q-icon name="map" color="purple" />
                </template>
                <template v-slot:hint> Sección del pozo a perforar </template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model.number="form.entry_depth"
                label="Profundidad de Entrada"
                type="number"
                step="0.1"
                min="0"
                :rules="[
                  (val) => (val !== undefined && val !== null) || 'Este campo es requerido',
                  (val) => val >= 0 || 'La profundidad debe ser mayor o igual a 0',
                ]"
                outlined
                suffix="p"
              >
                <template v-slot:prepend>
                  <q-icon name="height" color="deep-orange" />
                </template>
                <template v-slot:hint> Profundidad inicial en metros </template>
              </q-input>
            </div>
          </div>

          <!-- Sección Personal -->
          <q-separator class="q-my-lg" />
          <div class="text-h6 text-primary q-mb-md">
            <q-icon name="people" class="q-mr-sm" />
            Personal Asignado
          </div>
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.ing_day"
                :options="userRoleUsersSelect"
                label="Ingeniero de Día"
                :rules="[(val) => !!val || 'Este campo es requerido']"
                outlined
                option-label="label"
                option-value="value"
                emit-value
                map-options
                use-input
                input-debounce="300"
                @filter="filterUsersDay"
              >
                <template v-slot:prepend>
                  <q-icon name="wb_sunny" color="orange" />
                </template>
                <template v-slot:hint> Ingeniero responsable del turno diurno </template>
              </q-select>
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.ing_night"
                :options="userRoleUsersSelect"
                label="Ingeniero de Noche"
                :rules="[(val) => !!val || 'Este campo es requerido']"
                outlined
                option-label="label"
                option-value="value"
                emit-value
                map-options
                use-input
                input-debounce="300"
                @filter="filterUsersNight"
              >
                <template v-slot:prepend>
                  <q-icon name="nights_stay" color="indigo" />
                </template>
                <template v-slot:hint> Ingeniero responsable del turno nocturno </template>
              </q-select>
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.supervisor"
                :options="userRoleSupervisorSelect"
                label="Supervisor"
                :rules="[(val) => !!val || 'Este campo es requerido']"
                outlined
                option-label="label"
                option-value="value"
                emit-value
                map-options
                use-input
                input-debounce="300"
                @filter="filterSupervisor"
              >
                <template v-slot:prepend>
                  <q-icon name="supervisor_account" color="indigo" />
                </template>
                <template v-slot:hint> Supervisor de avances </template>
              </q-select>
            </div>
          </div>

          <!-- Sección Cronograma -->
          <q-separator class="q-my-lg" />
          <div class="text-h6 text-primary q-mb-md">
            <q-icon name="schedule" class="q-mr-sm" />
            Cronograma
          </div>
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.start_date"
                label="Fecha de Inicio"
                type="date"
                :rules="[(val) => !!val || 'Este campo es requerido']"
                outlined
              >
                <template v-slot:prepend>
                  <q-icon name="event" color="green" />
                </template>
                <template v-slot:hint> Fecha programada de inicio </template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.start_time"
                label="Hora de Inicio"
                type="time"
                :rules="[(val) => !!val || 'Este campo es requerido']"
                outlined
              >
                <template v-slot:prepend>
                  <q-icon name="access_time" color="green" />
                </template>
                <template v-slot:hint> Hora programada de inicio </template>
              </q-input>
            </div>
          </div>

          <!-- Información adicional -->
          <q-card flat bordered class="bg-blue-1 q-mt-lg">
            <q-card-section class="q-pa-md">
              <div class="row items-center">
                <q-icon name="info" color="primary" class="q-mr-sm" />
                <div class="text-body2 text-primary text-weight-medium">Información importante</div>
              </div>
              <div class="text-caption text-grey-7 q-mt-xs">
                Una vez creado el proyecto, podrá agregar BHAs, registros de perforación y otra
                información técnica detallada.
              </div>
            </q-card-section>
          </q-card>
        </q-form>
      </q-card-section>

      <!-- Acciones mejoradas -->
      <q-separator />
      <q-card-actions class="q-pa-lg bg-grey-1">
        <q-space />
        <q-btn
          flat
          label="Cancelar"
          color="grey-7"
          v-close-popup
          :disable="loading"
          class="q-mr-sm"
          size="md"
        />
        <q-btn
          color="primary"
          :label="props.editProject ? 'Guardar Cambios' : 'Crear Proyecto'"
          :icon="props.editProject ? 'edit' : 'add_circle'"
          @click="submit"
          :loading="loading"
          unelevated
          class="text-weight-bold"
          size="md"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useProjects } from 'src/composables/useProjects';
import { useQuasar } from 'quasar';
import { useUsers } from 'src/composables/useUsers';

const props = defineProps<{ modelValue: boolean; editProject?: any }>();
const emit = defineEmits(['update:modelValue', 'refresh', 'edited']);

const $q = useQuasar();
const dialogValue = ref(props.modelValue);
const { createProject, editProjectFunc, form } = useProjects();
const {
  userRoleUsersSelect,
  userRoleSupervisorSelect,
  getUserRoleUsersSelect,
  getUserRoleSupervisorSelect,
} = useUsers();
const loading = ref(false);
const formRef = ref();

watch(dialogValue, (val) => {
  emit('update:modelValue', val);
});

watch(
  () => props.modelValue,
  async (val) => {
    dialogValue.value = val;
    if (val) {
      await getUserRoleUsersSelect();
      await getUserRoleSupervisorSelect();
      if (props.editProject) {
        // Modo edición: rellenar todos los campos

        form.value = {
          customer: props.editProject.customer ?? '',
          well: props.editProject.well ?? '',
          uwi_sidetrack: props.editProject.uwi_sidetrack ?? '',
          equipment: props.editProject.equipment ?? '',
          section: props.editProject.section ?? '',
          ing_day: props.editProject.ing_day._id ?? '',
          ing_night: props.editProject.ing_night._id ?? '',
          supervisor: props.editProject.supervisor?._id ?? '',
          start_date: props.editProject.start_date ?? new Date().toISOString().split('T')[0],
          start_time:
            typeof props.editProject.start_time === 'number'
              ? formatTime(props.editProject.start_time)
              : (props.editProject.start_time ?? '06:00'),
          entry_depth: props.editProject.entry_depth ?? 0,
        };
      } else {
        // Modo creación
        form.value = {
          customer: '',
          well: '',
          uwi_sidetrack: '',
          equipment: '',
          section: '',
          ing_day: '',
          ing_night: '',
          start_date: new Date().toISOString().split('T')[0],
          start_time: '06:00',
          entry_depth: 0,
        } as any;
      }
    }
  },
  { immediate: true },
);

// Helper para convertir número a HH:mm
function formatTime(num: number) {
  const hours = Math.floor(num);
  const minutes = Math.round((num - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Opcional: filtrar usuarios en el select si se requiere búsqueda
const filterUsersDay = (val: string, update: any) => {
  update(() => {
    if (!val) {
      return userRoleUsersSelect.value;
    }
    return userRoleUsersSelect.value.filter((u) =>
      u.label.toLowerCase().includes(val.toLowerCase()),
    );
  });
};

const filterSupervisor = (val: string, update: any) => {
  update(() => {
    if (!val) {
      return userRoleSupervisorSelect.value;
    }
    return userRoleSupervisorSelect.value.filter((u) =>
      u.label.toLowerCase().includes(val.toLowerCase()),
    );
  });
};
const filterUsersNight = filterUsersDay;

const submit = async () => {
  // Validar formulario
  const isValid = await formRef.value?.validate();
  if (!isValid) {
    $q.notify({
      type: 'negative',
      message: 'Por favor complete todos los campos requeridos',
      position: 'top',
    });
    return;
  }

  try {
    loading.value = true;
    const payload = { ...form.value };
    if (typeof payload.start_time === 'string') {
      const [hours, minutes] = payload.start_time.split(':').map(Number);
      payload.start_time = hours + (minutes ? minutes / 60 : 0);
    }
    if (props.editProject && props.editProject._id) {
      await editProjectFunc(props.editProject._id, payload);

      emit('edited');
    } else {
      await createProject(payload);

      emit('refresh');
    }
    emit('update:modelValue', false);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.bg-gradient-primary {
  background: linear-gradient(135deg, var(--q-primary) 0%, #1976d2 100%);
}

.opacity-80 {
  opacity: 0.8;
}

/* Animación suave para el diálogo */
.q-dialog__inner {
  padding: 16px;
}

/* Mejora visual para campos de entrada */
.q-field--outlined .q-field__control:before {
  border-color: rgba(0, 0, 0, 0.12);
}

.q-field--outlined.q-field--focused .q-field__control:before,
.q-field--outlined.q-field--focused .q-field__control:after {
  border-color: var(--q-primary);
}

/* Hover effect for buttons */
.q-btn:hover {
  transform: translateY(-1px);
  transition: transform 0.2s ease;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .q-card {
    min-width: 90vw !important;
    max-width: 90vw !important;
  }
}
</style>
