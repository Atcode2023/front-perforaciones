<template>
  <q-dialog v-model="dialogValue" persistent maximized>
    <q-card class="shadow-10">
      <q-card-section class="bg-gradient-secondary text-white q-pa-lg">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h4 text-weight-bold">
              <q-icon name="add_box" class="q-mr-sm" size="lg" />
              Agregar Datos Estáticos del Proyecto
            </div>
            <div class="text-subtitle1 opacity-80">Registro de KPIs y datos estáticos</div>
          </div>
          <div class="col-auto">
            <q-btn flat round dense icon="close" v-close-popup size="lg" class="text-white" />
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-pa-lg">
        <q-form @submit.prevent="submit" ref="formRef">
          <q-tabs
            v-model="tab"
            dense
            class="text-primary q-mb-lg shadow-2 rounded-borders bg-grey-1"
            align="left"
            indicator-color="secondary"
            active-color="secondary"
            active-bg-color="white"
          >
            <q-tab name="rop_efec_kpi" label="ROP Efectivo KPI" icon="speed" />
            <q-tab name="rop_avg_kpi" label="ROP Promedio KPI" icon="speed" />
            <q-tab name="trip_rop_kpi" label="Trip ROP KPI" icon="speed" />
            <q-tab name="conex_kpi" label="Conex KPI" icon="speed" />
            <q-tab name="review_kpi" label="Review KPI" icon="timer" />
            <q-tab name="survey_kpi" label="Survey KPI" icon="timer" />
          </q-tabs>

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="rop_efec_kpi" class="q-pa-lg">
              <div class="text-h6 text-primary q-mb-md">
                <q-icon name="speed" class="q-mr-sm" />
                ROP Efectivo KPI
              </div>
              <KpiArrayForm v-model="form.rop_efec_kpi" :fields="['depth', 'rop']" />
            </q-tab-panel>
            <q-tab-panel name="rop_avg_kpi" class="q-pa-lg">
              <div class="text-h6 text-primary q-mb-md">
                <q-icon name="speed" class="q-mr-sm" />
                ROP Promedio KPI
              </div>
              <KpiArrayForm v-model="form.rop_avg_kpi" :fields="['depth', 'rop']" />
            </q-tab-panel>
            <q-tab-panel name="trip_rop_kpi" class="q-pa-lg">
              <div class="text-h6 text-primary q-mb-md">
                <q-icon name="speed" class="q-mr-sm" />
                Trip ROP KPI
              </div>
              <KpiArrayForm v-model="form.trip_rop_kpi" :fields="['depth', 'rop']" />
            </q-tab-panel>
            <q-tab-panel name="conex_kpi" class="q-pa-lg">
              <div class="text-h6 text-primary q-mb-md">
                <q-icon name="speed" class="q-mr-sm" />
                Conex KPI
              </div>
              <KpiArrayForm v-model="form.conex_kpi" :fields="['depth', 'rop']" />
            </q-tab-panel>
            <q-tab-panel name="review_kpi" class="q-pa-lg">
              <div class="text-h6 text-primary q-mb-md">
                <q-icon name="timer" class="q-mr-sm" />
                Review KPI
              </div>
              <KpiArrayForm v-model="form.review_kpi" :fields="['time']" />
            </q-tab-panel>
            <q-tab-panel name="survey_kpi" class="q-pa-lg">
              <div class="text-h6 text-primary q-mb-md">
                <q-icon name="timer" class="q-mr-sm" />
                Survey KPI
              </div>
              <KpiArrayForm v-model="form.survey_kpi" :fields="['time']" />
            </q-tab-panel>
          </q-tab-panels>
        </q-form>
      </q-card-section>

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
          color="secondary"
          label="Agregar Datos Estáticos"
          icon="add_box"
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
import KpiArrayForm from './KpiArrayForm.vue';

const props = defineProps<{ modelValue: boolean; projectId: string; project?: any }>();
const emit = defineEmits(['update:modelValue', 'refresh']);

const $q = useQuasar();
const dialogValue = ref(props.modelValue);
const { createProjectStaticData } = useProjects();
const loading = ref(false);
const tab = ref('rop_efec_kpi');
const formRef = ref();

const form = ref({
  rop_efec_kpi: [],
  rop_avg_kpi: [],
  trip_rop_kpi: [],
  conex_kpi: [],
  review_kpi: [],
  survey_kpi: [],
});

watch(dialogValue, (val) => {
  emit('update:modelValue', val);
});

watch(
  () => props.modelValue,
  (val) => {
    dialogValue.value = val;
    if (val) {
      tab.value = 'rop_efec_kpi';
      // Si existe project_static_data en props.project, cargarlo en el formulario
      if (props.project && props.project.project_static_data) {
        const staticData = props.project.project_static_data;
        form.value = {
          rop_efec_kpi: staticData.rop_efec_kpi || [],
          rop_avg_kpi: staticData.rop_avg_kpi || [],
          trip_rop_kpi: staticData.trip_rop_kpi || [],
          conex_kpi: staticData.conex_kpi || [],
          review_kpi: staticData.review_kpi || [],
          survey_kpi: staticData.survey_kpi || [],
        };
      } else {
        form.value = {
          rop_efec_kpi: [],
          rop_avg_kpi: [],
          trip_rop_kpi: [],
          conex_kpi: [],
          review_kpi: [],
          survey_kpi: [],
        };
      }
    }
  },
  { immediate: true },
);

const submit = async () => {
  try {
    loading.value = true;
    await createProjectStaticData(props.projectId, form.value);

    $q.notify({
      type: 'positive',
      message: 'Datos estáticos agregados exitosamente',
      icon: 'check_circle',
      position: 'top',
    });

    emit('update:modelValue', false);
    emit('refresh');
  } catch (error) {
    console.error(error);
    $q.notify({
      type: 'negative',
      message: 'Error al agregar los datos estáticos. Intente nuevamente.',
      icon: 'error',
      position: 'top',
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.bg-gradient-secondary {
  background: linear-gradient(135deg, var(--q-secondary) 0%, #7b1fa2 100%);
}
.opacity-80 {
  opacity: 0.8;
}
.q-tab-panels {
  min-height: 400px;
}
.q-tab-panel {
  padding: 0;
}
.q-btn:hover {
  transform: translateY(-1px);
  transition: transform 0.2s ease;
}
@media (max-width: 768px) {
  .q-dialog__inner {
    padding: 8px;
  }
}
</style>
