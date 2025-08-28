<template>
  <q-dialog v-model="dialogValue" persistent>
    <q-card style="min-width: 500px" class="shadow-10">
      <!-- Header mejorado -->
      <q-card-section class="bg-primary text-white q-pa-lg">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h5 text-weight-bold">
              <q-icon name="build_circle" class="q-mr-sm" size="md" />
              {{ isEdit ? 'Editar BHA' : 'Agregar BHA' }}
            </div>
            <div class="text-caption opacity-80">Configuración de Bottom Hole Assembly</div>
          </div>
          <div class="col-auto">
            <q-btn flat round dense icon="close" v-close-popup class="text-white" />
          </div>
        </div>
      </q-card-section>

      <!-- Contenido del formulario -->
      <q-card-section class="q-pa-lg">
        <q-form @submit.prevent="submit" ref="formRef">
          <div class="row q-col-gutter-md">
            <!-- Engine OD -->
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.engine_od"
                label="Diámetro del Motor (Engine OD)"
                :rules="[(val) => !!val || 'Este campo es requerido']"
                outlined
                dense
                autofocus
                class="q-mb-md"
              >
                <template v-slot:prepend>
                  <q-icon name="straighten" color="primary" />
                </template>
                <template v-slot:hint> Especifique el diámetro exterior del motor </template>
              </q-input>
            </div>

            <!-- Engine Type -->
            <div class="col-12 col-sm-6">
              <q-select
                v-model="form.engine_type"
                :options="engineTypeOptions"
                label="Tipo de Motor (Engine Type)"
                :rules="[(val) => !!val || 'Este campo es requerido']"
                outlined
                dense
                emit-value
                map-options
                class="q-mb-md"
              >
                <template v-slot:prepend>
                  <q-icon name="category" color="secondary" />
                </template>
                <template v-slot:hint> Seleccione el tipo de motor </template>
              </q-select>
            </div>

            <!-- Factor -->
            <div class="col-12 col-sm-6">
              <q-input
                v-model.number="form.factor"
                label="Factor"
                type="number"
                step="0.1"
                min="0"
                :rules="[
                  (val) => (val !== undefined && val !== null) || 'Este campo es requerido',
                  (val) => val > 0 || 'El factor debe ser mayor a 0',
                ]"
                outlined
                dense
                class="q-mb-md"
              >
                <template v-slot:prepend>
                  <q-icon name="functions" color="orange" />
                </template>
                <template v-slot:hint> Factor de configuración del BHA </template>
              </q-input>
            </div>

            <!-- Trepan -->
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.trepan"
                label="Trepan"
                :rules="[(val) => !!val || 'Este campo es requerido']"
                outlined
                dense
                class="q-mb-md"
              >
                <template v-slot:prepend>
                  <q-icon name="hardware" color="green" />
                </template>
                <template v-slot:hint> Especificación del trepan </template>
              </q-input>
            </div>
          </div>

          <!-- Información adicional -->
          <q-card flat bordered class="bg-blue-1 q-mt-md">
            <q-card-section class="q-pa-md">
              <div class="row items-center">
                <q-icon name="info" color="primary" class="q-mr-sm" />
                <div class="text-body2 text-primary text-weight-medium">Información importante</div>
              </div>
              <div class="text-caption text-grey-7 q-mt-xs">
                Asegúrese de verificar todas las especificaciones antes de agregar el BHA al
                proyecto.
              </div>
            </q-card-section>
          </q-card>
        </q-form>
      </q-card-section>

      <!-- Acciones mejoradas -->
      <q-separator />
      <q-card-actions class="q-pa-lg">
        <q-space />
        <q-btn
          flat
          label="Cancelar"
          color="grey-7"
          v-close-popup
          :disable="loading"
          class="q-mr-sm"
        />
        <q-btn
          color="primary"
          :label="isEdit ? 'Guardar Cambios' : 'Agregar BHA'"
          :icon="isEdit ? 'save' : 'add_circle'"
          @click="submit"
          :loading="loading"
          unelevated
          class="text-weight-bold"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useProjects } from 'src/composables/useProjects';
import { useQuasar } from 'quasar';

const props = defineProps<{ modelValue: boolean; projectId: string; editData?: any }>();
const emit = defineEmits(['update:modelValue', 'refresh']);

const $q = useQuasar();
const dialogValue = ref(props.modelValue);
const { createBha, editBha } = useProjects();
const loading = ref(false);
const formRef = ref();
const isEdit = ref(false);

const form = ref({
  engine_od: '',
  engine_type: '',
  factor: 1,
  trepan: '',
});

// Opciones para el tipo de motor
const engineTypeOptions = [
  { label: 'Motor de Desplazamiento Positivo', value: 'PDM' },
  { label: 'Motor Turbina', value: 'Turbine' },
  { label: 'Motor Rotativo', value: 'Rotary' },
  { label: 'Motor Direccional', value: 'Directional' },
  { label: 'Otro', value: 'Other' },
];

watch(dialogValue, (val) => {
  emit('update:modelValue', val);
});

watch(
  () => props.modelValue,
  (val) => {
    dialogValue.value = val;
    if (val) {
      if (props.editData) {
        // Modo edición
        isEdit.value = true;
        form.value = {
          engine_od: props.editData.engine_od,
          engine_type: props.editData.engine_type,
          factor: props.editData.factor,
          trepan: props.editData.trepan,
        };
      } else {
        // Modo creación
        isEdit.value = false;
        form.value = {
          engine_od: '',
          engine_type: '',
          factor: 1,
          trepan: '',
        };
      }
    }
  },
  { immediate: true },
);

const submit = async () => {
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
    if (isEdit.value && props.editData && props.editData._id) {
      await editBha(props.projectId, props.editData._id, form.value);
      $q.notify({
        type: 'positive',
        message: 'BHA editado exitosamente',
        icon: 'check_circle',
        position: 'top',
      });
    } else {
      await createBha(props.projectId, form.value);
      $q.notify({
        type: 'positive',
        message: 'BHA agregado exitosamente',
        icon: 'check_circle',
        position: 'top',
      });
    }
    emit('update:modelValue', false);
    emit('refresh');
  } catch (error: any) {
    console.log(error);

    $q.notify({
      type: 'negative',
      message: isEdit.value
        ? 'Error al editar el BHA. Intente nuevamente.'
        : 'Error al agregar el BHA. Intente nuevamente.',
      icon: 'error',
      position: 'top',
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
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

/* Hover effect para botones */
.q-btn:hover {
  transform: translateY(-1px);
  transition: transform 0.2s ease;
}
</style>
