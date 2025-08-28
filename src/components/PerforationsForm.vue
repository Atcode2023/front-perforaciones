<template>
  <q-dialog v-model="dialogValue" persistent maximized>
    <q-card class="shadow-10">
      <!-- Header mejorado -->
      <q-card-section class="bg-gradient-secondary text-white q-pa-lg">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h4 text-weight-bold">
              <q-icon :name="isEdit ? 'edit' : 'add_box'" class="q-mr-sm" size="lg" />
              {{ isEdit ? 'Editar Perforación' : 'Agregar Perforación' }}
            </div>
            <div class="text-subtitle1 opacity-80">
              {{
                isEdit ? 'Editar datos de perforación' : 'Registro completo de datos de perforación'
              }}
            </div>
          </div>
          <div class="col-auto">
            <q-btn flat round dense icon="close" v-close-popup size="lg" class="text-white" />
          </div>
        </div>
      </q-card-section>

      <!-- Contenido del formulario -->
      <q-card-section class="q-pa-lg">
        <q-form @submit.prevent="submit" ref="formRef">
          <!-- Tabs mejorados -->
          <q-tabs
            v-model="tab"
            dense
            class="text-primary q-mb-lg shadow-2 rounded-borders bg-grey-1"
            align="left"
            indicator-color="secondary"
            active-color="secondary"
            active-bg-color="white"
          >
            <q-tab name="principales" label="Principales" icon="settings" />
            <q-tab name="tiempos" label="Tiempos" icon="schedule" />
            <q-tab name="profundidad" label="Profundidad" icon="height" />
            <q-tab name="rpm" label="RPM" icon="rotate_right" />
            <q-tab name="torque" label="Torque" icon="settings_applications" />
            <q-tab name="presion" label="Presión" icon="compress" />
            <q-tab name="peso_gancho" label="Peso Gancho" icon="fitness_center" />
            <q-tab name="fluido" label="Fluido" icon="water_drop" />
            <q-tab name="turno" label="Turno" icon="access_time" />
            <q-tab name="survey" label="Survey" icon="explore" />
          </q-tabs>

          <q-tab-panels v-model="tab" animated class="">
            <!-- Panel Principales -->
            <q-tab-panel name="principales" class="q-pa-lg">
              <div class="text-h6 text-primary q-mb-md">
                <q-icon name="settings" class="q-mr-sm" />
                Datos Principales
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-4">
                  <q-input
                    v-model="form.directional_profile_type"
                    label="Perfil Direccional"
                    :rules="[(val) => !!val || 'Este campo es requerido']"
                    outlined
                    autofocus
                  >
                    <template v-slot:prepend>
                      <q-icon name="trending_up" color="primary" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-4">
                  <q-input
                    v-model="form.formation"
                    label="Formación"
                    :rules="[(val) => !!val || 'Este campo es requerido']"
                    outlined
                  >
                    <template v-slot:prepend>
                      <q-icon name="layers" color="brown" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-4">
                  <q-select
                    v-model="form.bha"
                    :options="props.bhaOptions"
                    label="BHA"
                    outlined
                    emit-value
                    map-options
                  >
                    <template v-slot:prepend>
                      <q-icon name="build_circle" color="secondary" />
                    </template>
                  </q-select>
                </div>
                <div class="col-12 col-md-4">
                  <q-select
                    v-model="form.activity"
                    :options="activityOptions"
                    label="Actividad"
                    :rules="[(val) => !!val || 'Este campo es requerido']"
                    outlined
                    emit-value
                    map-options
                  >
                    <template v-slot:prepend>
                      <q-icon name="work" color="green" />
                    </template>
                  </q-select>
                </div>
                <div class="col-12 col-md-4">
                  <q-input
                    v-model="form.tf_type"
                    label="Tipo TF"
                    :rules="[(val) => !!val || 'Este campo es requerido']"
                    outlined
                  >
                    <template v-slot:prepend>
                      <q-icon name="category" color="orange" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-4">
                  <q-input v-model="form.tfo" label="TFO" outlined>
                    <template v-slot:prepend>
                      <q-icon name="settings_input_component" color="purple" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-4">
                  <q-input
                    v-model.number="form.wob"
                    label="WOB (Weight on Bit)"
                    type="number"
                    step="0.1"
                    :rules="[
                      (val) => (val !== null && val !== undefined) || 'Este campo es requerido',
                    ]"
                    outlined
                    suffix="klb"
                  >
                    <template v-slot:prepend>
                      <q-icon name="fitness_center" color="red" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-4">
                  <q-input
                    v-model.number="form.caudal"
                    label="Caudal"
                    type="number"
                    step="0.1"
                    :rules="[
                      (val) => (val !== null && val !== undefined) || 'Este campo es requerido',
                    ]"
                    outlined
                    suffix="gpm"
                  >
                    <template v-slot:prepend>
                      <q-icon name="water_drop" color="blue" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-4">
                  <q-input
                    v-model="form.comments"
                    label="Comentarios"
                    type="textarea"
                    outlined
                    rows="3"
                  >
                    <template v-slot:prepend>
                      <q-icon name="comment" color="grey-6" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-4">
                  <q-input v-model="form.formations" label="Formaciones" outlined>
                    <template v-slot:prepend>
                      <q-icon name="terrain" color="brown-6" />
                    </template>
                  </q-input>
                </div>
              </div>
            </q-tab-panel>

            <!-- Panel Tiempos -->
            <q-tab-panel name="tiempos" class="q-pa-lg">
              <div class="text-h6 text-primary q-mb-md">
                <q-icon name="schedule" class="q-mr-sm" />
                Control de Tiempos
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model.number="form.to_time"
                    label="Tiempo Hasta"
                    type="number"
                    step="0.1"
                    :rules="[
                      (val) => (val !== null && val !== undefined) || 'Este campo es requerido',
                    ]"
                    outlined
                    suffix="hrs"
                  >
                    <template v-slot:prepend>
                      <q-icon name="timer" color="primary" />
                    </template>
                  </q-input>
                </div>
              </div>
            </q-tab-panel>

            <!-- Panel Profundidad -->
            <q-tab-panel name="profundidad" class="q-pa-lg">
              <div class="text-h6 text-primary q-mb-md">
                <q-icon name="height" class="q-mr-sm" />
                Medidas de Profundidad
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model.number="form.depth_to"
                    label="Profundidad Hasta"
                    type="number"
                    step="0.1"
                    :rules="[
                      (val) => (val !== null && val !== undefined) || 'Este campo es requerido',
                    ]"
                    outlined
                    suffix="p"
                  >
                    <template v-slot:prepend>
                      <q-icon name="straighten" color="deep-orange" />
                    </template>
                  </q-input>
                </div>
                <!-- Nuevo campo pierced_feet_kpi -->
                <div class="col-12 col-md-6">
                  <q-input
                    v-model.number="form.pierced_feet_kpi"
                    label="Pies Perforados KPI"
                    type="number"
                    step="0.1"
                    outlined
                    suffix="p"
                  >
                    <template v-slot:prepend>
                      <q-icon name="speed" color="blue" />
                    </template>
                  </q-input>
                </div>
              </div>
            </q-tab-panel>

            <!-- Panel RPM -->
            <q-tab-panel name="rpm" class="q-pa-lg">
              <div class="text-h6 text-primary q-mb-md">
                <q-icon name="rotate_right" class="q-mr-sm" />
                Revoluciones por Minuto
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model.number="form.rpm_surface"
                    label="RPM Superficie"
                    type="number"
                    :rules="[
                      (val) => (val !== null && val !== undefined) || 'Este campo es requerido',
                    ]"
                    outlined
                    suffix="rpm"
                  >
                    <template v-slot:prepend>
                      <q-icon name="rotate_right" color="green" />
                    </template>
                  </q-input>
                </div>
              </div>
            </q-tab-panel>

            <!-- Panel Torque -->
            <q-tab-panel name="torque" class="q-pa-lg">
              <div class="text-h6 text-primary q-mb-md">
                <q-icon name="settings_applications" class="q-mr-sm" />
                Medidas de Torque
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model.number="form.tq_bottom"
                    label="TQ Fondo"
                    type="number"
                    step="0.1"
                    :rules="[
                      (val) => (val !== null && val !== undefined) || 'Este campo es requerido',
                    ]"
                    outlined
                    suffix="ft-lbs"
                  >
                    <template v-slot:prepend>
                      <q-icon name="settings_applications" color="red" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model.number="form.tq_out_bottom"
                    label="TQ Fuera Fondo"
                    type="number"
                    step="0.1"
                    outlined
                    suffix="ft-lbs"
                  >
                    <template v-slot:prepend>
                      <q-icon name="settings_applications" color="orange" />
                    </template>
                  </q-input>
                </div>
              </div>
            </q-tab-panel>

            <!-- Panel Presión -->
            <q-tab-panel name="presion" class="q-pa-lg">
              <div class="text-h6 text-primary q-mb-md">
                <q-icon name="compress" class="q-mr-sm" />
                Medidas de Presión
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model.number="form.spp_bottom"
                    label="SPP Fondo"
                    type="number"
                    step="0.1"
                    outlined
                    suffix="psi"
                  >
                    <template v-slot:prepend>
                      <q-icon name="compress" color="blue" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model.number="form.spp_out_bottom"
                    label="SPP Fuera Fondo"
                    type="number"
                    step="0.1"
                    outlined
                    suffix="psi"
                  >
                    <template v-slot:prepend>
                      <q-icon name="compress" color="light-blue" />
                    </template>
                  </q-input>
                </div>
              </div>
            </q-tab-panel>

            <!-- Panel Peso en el Gancho -->
            <q-tab-panel name="peso_gancho" class="q-pa-lg">
              <div class="text-h6 text-primary q-mb-md">
                <q-icon name="fitness_center" class="q-mr-sm" />
                Peso en el Gancho (PEEG)
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-4">
                  <q-input
                    v-model.number="form.peeg_bottom"
                    label="PEEG Fondo"
                    type="number"
                    step="0.1"
                    outlined
                    suffix="klb"
                  >
                    <template v-slot:prepend>
                      <q-icon name="fitness_center" color="red" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-4">
                  <q-input
                    v-model.number="form.peeg_out_bottom"
                    label="PEEG Fuera Fondo"
                    type="number"
                    step="0.1"
                    outlined
                    suffix="klb"
                  >
                    <template v-slot:prepend>
                      <q-icon name="fitness_center" color="orange" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-4">
                  <q-input
                    v-model.number="form.peeg_rotating"
                    label="PEEG Rotando"
                    type="number"
                    step="0.1"
                    outlined
                    suffix="klb"
                  >
                    <template v-slot:prepend>
                      <q-icon name="fitness_center" color="green" />
                    </template>
                  </q-input>
                </div>
              </div>
            </q-tab-panel>

            <!-- Panel Fluido -->
            <q-tab-panel name="fluido" class="q-pa-lg">
              <div class="text-h6 text-primary q-mb-md">
                <q-icon name="water_drop" class="q-mr-sm" />
                Propiedades del Fluido
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model.number="form.mud_density"
                    label="Densidad del Lodo"
                    type="number"
                    step="0.1"
                    outlined
                    suffix="ppg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="water_drop" color="brown" />
                    </template>
                  </q-input>
                </div>
              </div>
            </q-tab-panel>

            <!-- Panel Turno -->
            <q-tab-panel name="turno" class="q-pa-lg">
              <div class="text-h6 text-primary q-mb-md">
                <q-icon name="access_time" class="q-mr-sm" />
                Información del Turno
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-select
                    v-model="form.shift"
                    :options="shiftOptions"
                    label="Turno"
                    outlined
                    emit-value
                    map-options
                    :disable="isStaffDisabled"
                  >
                    <template v-slot:prepend>
                      <q-icon name="access_time" color="indigo" />
                    </template>
                  </q-select>
                </div>
              </div>
            </q-tab-panel>

            <!-- Panel Survey -->
            <q-tab-panel name="survey" class="q-pa-lg">
              <div class="text-h6 text-primary q-mb-md">
                <q-icon name="explore" class="q-mr-sm" />
                Datos de Survey
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-3">
                  <q-input
                    v-model.number="form.md"
                    label="MD (Measured Depth)"
                    type="number"
                    step="0.1"
                    outlined
                    suffix="p"
                  >
                    <template v-slot:prepend>
                      <q-icon name="straighten" color="primary" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-3">
                  <q-input
                    v-model.number="form.tvd"
                    label="TVD (True Vertical Depth)"
                    type="number"
                    step="0.1"
                    outlined
                    suffix="p"
                  >
                    <template v-slot:prepend>
                      <q-icon name="height" color="green" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-3">
                  <q-input
                    v-model.number="form.incl"
                    label="Inclinación"
                    type="number"
                    step="0.1"
                    outlined
                    suffix="°"
                  >
                    <template v-slot:prepend>
                      <q-icon name="trending_up" color="orange" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-3">
                  <q-input
                    v-model.number="form.az"
                    label="Azimut"
                    type="number"
                    step="0.1"
                    outlined
                    suffix="°"
                  >
                    <template v-slot:prepend>
                      <q-icon name="explore" color="red" />
                    </template>
                  </q-input>
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
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
          :color="isEdit ? 'primary' : 'secondary'"
          :label="isEdit ? 'Guardar Cambios' : 'Agregar Perforación'"
          :icon="isEdit ? 'edit' : 'add_box'"
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
import { ref, watch, computed } from 'vue';
import { useProjects } from 'src/composables/useProjects';
import { useQuasar } from 'quasar';
import { useAuth } from 'src/composables/useAuth';

const props = defineProps<{
  modelValue: boolean;
  projectId: string;
  bhaOptions: any;
  editData?: any;
  project?: any; // <-- nuevo prop
}>();
const emit = defineEmits(['update:modelValue', 'refresh']);

const $q = useQuasar();
const dialogValue = ref(props.modelValue);
const { createPerforation, editPerforation } = useProjects();
const { user } = useAuth();
const loading = ref(false);
const tab = ref('principales');
const formRef = ref();

const isEdit = computed(() => !!props.editData && !!props.editData._id);
const isStaffDisabled = computed(() => user.value?.role === 'USER');
const selectedShift = ref('');

const defaultForm = () => ({
  directional_profile_type: '',
  formation: '',
  bha: '',
  to_time: 0,
  activity: '',
  depth_to: 0,
  tf_type: '',
  tfo: '',
  rpm_surface: 0,
  wob: 0,
  caudal: 0,
  tq_bottom: 0,
  tq_out_bottom: 0,
  spp_bottom: 0,
  spp_out_bottom: 0,
  peeg_bottom: 0,
  peeg_out_bottom: 0,
  peeg_rotating: 0,
  mud_density: 0,
  shift: '',
  md: 0,
  tvd: 0,
  incl: 0,
  az: 0,
  comments: '',
  pierced_feet_kpi: 0,
  formations: '',
});

const form = ref(defaultForm());

watch(dialogValue, (val) => {
  emit('update:modelValue', val);
});

watch(
  () => props.modelValue,
  (val) => {
    dialogValue.value = val;
    if (val) {
      tab.value = 'principales';
      if (isEdit.value) {
        // Si es edición, inicializa el formulario con los datos a editar
        form.value = { ...defaultForm(), ...props.editData };
      } else {
        form.value = defaultForm();
      }
    }
  },
  { immediate: true },
);

watch(
  () => props.project,
  (project) => {
    if (isStaffDisabled.value && project) {
      if (user.value?.username === project.ing_day?.username) {
        selectedShift.value = 'Día';
      } else if (user.value?.username === project.ing_night?.username) {
        selectedShift.value = 'Noche';
      }
      form.value.shift = selectedShift.value;
    }
  },
  { immediate: true },
);

watch(isStaffDisabled, (disabled) => {
  if (disabled && selectedShift.value) {
    form.value.shift = selectedShift.value;
  }
});

const submit = async () => {
  // Validar campos requeridos
  if (
    !form.value.directional_profile_type ||
    !form.value.formation ||
    form.value.to_time === undefined ||
    !form.value.activity ||
    form.value.depth_to === undefined ||
    !form.value.tf_type
  ) {
    $q.notify({
      type: 'negative',
      message: 'Por favor complete todos los campos requeridos',
      position: 'top',
    });
    return;
  }

  try {
    loading.value = true;
    if (isEdit.value) {
      // Editar perforación
      await editPerforation(props.projectId, props.editData._id, form.value);
      $q.notify({
        type: 'positive',
        message: 'Perforación actualizada exitosamente',
        icon: 'check_circle',
        position: 'top',
      });
    } else {
      // Crear perforación
      await createPerforation(props.projectId, form.value);
      $q.notify({
        type: 'positive',
        message: 'Perforación agregada exitosamente',
        icon: 'check_circle',
        position: 'top',
      });
    }
    emit('update:modelValue', false);
    emit('refresh');
  } catch (error) {
    console.error(error);
    $q.notify({
      type: 'negative',
      message: isEdit.value
        ? 'Error al actualizar la perforación. Intente nuevamente.'
        : 'Error al agregar la perforación. Intente nuevamente.',
      icon: 'error',
      position: 'top',
    });
  } finally {
    loading.value = false;
  }
};

const activityOptions = [
  { label: 'Circula', value: 'Circula' },
  { label: 'Conexión', value: 'Conexión' },
  { label: 'Desliza', value: 'Desliza' },
  { label: 'Otros', value: 'Otros' },
  { label: 'Perfora cemento', value: 'Perfora cemento' },
  { label: 'Rota', value: 'Rota' },
  { label: 'Survey', value: 'Survey' },
  { label: 'Arma BHA', value: 'Arma BHA' },
  { label: 'Desarma BHA', value: 'Desarma BHA' },
  { label: 'Repasa', value: 'Repasa' },
  { label: 'Downlink', value: 'Downlink' },
];

const shiftOptions = [
  { label: 'Día', value: 'Día' },
  { label: 'Noche', value: 'Noche' },
];
</script>

<style scoped>
.bg-gradient-secondary {
  background: linear-gradient(135deg, var(--q-secondary) 0%, #7b1fa2 100%);
}

.opacity-80 {
  opacity: 0.8;
}

/* Mejoras visuales para las pestañas */
.q-tab-panels {
  min-height: 400px;
}

.q-tab-panel {
  padding: 0;
}

/* Hover effects */
.q-btn:hover {
  transform: translateY(-1px);
  transition: transform 0.2s ease;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .q-dialog__inner {
    padding: 8px;
  }
}
</style>
