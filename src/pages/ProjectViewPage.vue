<template>
  <q-page class="q-pa-md bg-grey-1">
    <div v-if="project">
      <!-- Header mejorado -->
      <div class="q-mb-lg">
        <div class="text-h4 text-primary q-mb-sm">
          <q-icon name="engineering" class="q-mr-sm" />
          {{ project.customer }} - {{ project.well }}
        </div>
        <q-separator color="primary" size="2px" class="q-mb-md" />
      </div>

      <!-- Información del proyecto mejorada -->
      <q-card class="q-mb-lg shadow-4" bordered>
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            <q-icon name="info" class="q-mr-sm" />
            Información del Proyecto
          </div>
        </q-card-section>

        <q-card-section class="q-pa-lg">
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-6">
              <q-list separator>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="business" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Cliente</q-item-label>
                    <q-item-label caption class="text-body1">{{ project.customer }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="location_on" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Pozo</q-item-label>
                    <q-item-label caption class="text-body1">{{ project.well }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="code" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">UWI Sidetrack</q-item-label>
                    <q-item-label caption class="text-body1">{{
                      project.uwi_sidetrack
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="precision_manufacturing" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Equipo</q-item-label>
                    <q-item-label caption class="text-body1">{{ project.equipment }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="map" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Sección</q-item-label>
                    <q-item-label caption class="text-body1">{{ project.section }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <div class="col-12 col-md-6">
              <q-list separator>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="wb_sunny" color="orange" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Ing. Día</q-item-label>
                    <q-item-label caption class="text-body1">{{
                      project.ing_day.username
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="nights_stay" color="indigo" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Ing. Noche</q-item-label>
                    <q-item-label caption class="text-body1">{{
                      project.ing_night.username
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="event" color="green" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Fecha de inicio</q-item-label>
                    <q-item-label caption class="text-body1">{{ project.start_date }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="schedule" color="green" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Hora de inicio</q-item-label>
                    <q-item-label caption class="text-body1">{{ project.start_time }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="height" color="deep-orange" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Profundidad de entrada</q-item-label>
                    <q-item-label caption class="text-body1">{{
                      project.entry_depth
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Botones de acción mejorados -->
      <div class="q-mb-lg" v-if="user?.role !== 'SUPERVISOR'">
        <q-btn
          color="primary"
          label="Agregar BHA"
          icon="add_circle"
          @click="showBhaForm = true"
          class="q-mr-md q-mb-sm"
          size="md"
          unelevated
        />
        <q-btn
          color="secondary"
          label="Agregar Perforación"
          icon="add_box"
          @click="showPerforationForm = true"
          class="q-mr-md q-mb-sm"
          size="md"
          unelevated
        />
        <q-btn
          color="accent"
          label="Agregar Datos Estáticos"
          icon="add_chart"
          @click="showStaticDataForm = true"
          class="q-mb-sm"
          size="md"
          unelevated
        />
      </div>

      <BhasForm
        v-if="showBhaForm"
        v-model="showBhaForm"
        :project-id="project._id"
        @refresh="fetchProject"
      />
      <BhasForm
        v-if="showEditBhaForm"
        v-model="showEditBhaForm"
        :project-id="project._id"
        :edit-data="editingBha"
        @refresh="
          () => {
            showEditBhaForm = false;
            fetchProject();
          }
        "
      />
      <PerforationsForm
        v-if="showPerforationForm"
        v-model="showPerforationForm"
        :project-id="project._id"
        :bha-options="bhaOptions || []"
        :project="project"
        @refresh="fetchProject"
      />
      <PerforationsForm
        v-if="showEditPerforationForm"
        v-model="showEditPerforationForm"
        :project-id="project._id"
        :bha-options="bhaOptions || []"
        :edit-data="editingPerforation"
        :project="project"
        @refresh="onEditPerforationRefresh"
      />
      <ProjectStaticDataForm
        v-model="showStaticDataForm"
        :project-id="project._id"
        :project="project"
        @refresh="fetchProject"
      />

      <!-- Sección BHA mejorada -->
      <div
        v-if="project.bhas && project.bhas.length > 0 && user?.role !== 'SUPERVISOR'"
        class="q-mb-lg"
      >
        <div class="text-h5 text-primary q-mb-md">
          <q-icon name="build_circle" class="q-mr-sm" />
          BHAs del Proyecto
        </div>

        <div class="row q-col-gutter-md">
          <div
            v-for="(bha, idx) in project.bhas"
            :key="bha._id || bha.engine_od + bha.engine_type + bha.trepan"
            class="col-12 col-sm-6 col-md-4"
          >
            <q-card class="shadow-3 hover-shadow" bordered>
              <q-card-section class="bg-gradient-primary text-white">
                <div class="row items-center justify-between">
                  <div class="text-h6">
                    <q-icon name="settings" class="q-mr-sm" />
                    BHA #{{ idx + 1 }}
                  </div>
                  <div v-if="user?.role === 'ADMIN'">
                    <q-btn
                      icon="edit"
                      color="secondary"
                      dense
                      flat
                      @click="onEditBha(bha)"
                      class="q-mr-xs bg-white"
                      size="md"
                    />
                    <q-btn
                      icon="delete"
                      color="negative"
                      dense
                      flat
                      @click="onDeleteBha(bha)"
                      class="bg-white"
                      size="md"
                    />
                  </div>
                </div>
              </q-card-section>

              <q-card-section class="q-pa-md">
                <q-list dense>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="straighten" color="primary" size="sm" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-caption text-grey-7">Diámetro motor</q-item-label>
                      <q-item-label class="text-weight-medium">{{ bha.engine_od }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="category" color="secondary" size="sm" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-caption text-grey-7">Tipo de motor</q-item-label>
                      <q-item-label class="text-weight-medium">{{ bha.engine_type }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="functions" color="orange" size="sm" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-caption text-grey-7">Factor</q-item-label>
                      <q-item-label class="text-weight-medium">{{ bha.factor }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="hardware" color="green" size="sm" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-caption text-grey-7">Trepan</q-item-label>
                      <q-item-label class="text-weight-medium">{{ bha.trepan }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Sección de perforaciones mejorada -->
      <div class="q-mb-lg" v-if="user?.role !== 'SUPERVISOR'">
        <div class="text-h5 text-primary q-mb-md">
          <q-icon name="table_chart" class="q-mr-sm" />
          Tabla de Perforaciones
        </div>
        <PerforationsTable
          :perforations="project.perforations || []"
          :project="project"
          @edit="handleEditPerforation"
          @delete="handleDeletePerforation"
        />
      </div>

      <!-- Sección Datos Estáticos del Proyecto -->
      <ProjectStaticDataSummary
        v-if="project.project_static_data && user?.role !== 'SUPERVISOR'"
        :project-static-data="project.project_static_data"
      />

      <!-- Sección KPI del Proyecto -->
      <div v-if="project.kpi && user?.role !== 'SUPERVISOR'" class="q-mb-lg">
        <div class="text-h5 text-primary q-mb-md">
          <q-icon name="insights" class="q-mr-sm" />
          Resumen KPI del Proyecto
        </div>
        <ProjectKpiSummary :kpi="project.kpi" />
      </div>

      <div class="q-mb-lg">
        <ProjectReport :project-id="project._id" />
      </div>
    </div>

    <!-- Loading mejorado -->
    <div v-else class="flex flex-center q-pa-xl">
      <div class="text-center">
        <q-spinner-dots color="primary" size="3em" />
        <div class="text-h6 text-grey-7 q-mt-md">Cargando proyecto...</div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProjects } from 'src/composables/useProjects';
import BhasForm from 'src/components/BhasForm.vue';
import PerforationsForm from 'src/components/PerforationsForm.vue';
import PerforationsTable from 'src/components/PerforationsTable.vue';
import ProjectStaticDataForm from 'src/components/ProjectStaticDataForm.vue';
import ProjectKpiSummary from 'src/components/ProjectKpiSummary.vue';
import ProjectStaticDataSummary from 'src/components/ProjectStaticDataSummary.vue';
import ProjectReport from 'src/components/ProjectReport.vue';
import { useAuth } from 'src/composables/useAuth';
import { useQuasar } from 'quasar';

const route = useRoute();
const { user } = useAuth();
const $q = useQuasar();

const { project, getProjectById, deletePerforation, deleteBha } = useProjects();
const showBhaForm = ref(false);
const editingBha = ref<any>(null);
const showEditBhaForm = ref(false);
const showPerforationForm = ref(false);
const showStaticDataForm = ref(false);
const bhaOptions = ref<any>([]);
const editingPerforation = ref<any>(null);
const showEditPerforationForm = ref(false);

const fetchProject = async () => {
  await getProjectById(route.params.id as string);

  if (project.value && project.value.bhas) {
    bhaOptions.value = project.value.bhas.map((bha, index) => ({
      label: `BHA #${index + 1}`,
      value: bha._id,
    }));
  }
};

onMounted(async () => {
  await fetchProject();
});

function handleEditPerforation(row: any) {
  editingPerforation.value = { ...row };
  showEditPerforationForm.value = true;
}

const onEditPerforationRefresh = async () => {
  showEditPerforationForm.value = false;
  await fetchProject();
};

const handleDeletePerforation = async (row: any) => {
  if (!project.value) return;
  await deletePerforation(project.value._id, row._id);
  await fetchProject();
};

const onEditBha = (bha: any) => {
  editingBha.value = { ...bha };
  showEditBhaForm.value = true;
};

const onDeleteBha = (bha: any) => {
  $q.dialog({
    title: 'Eliminar BHA',
    message: '¿Seguro que deseas eliminar este BHA?',
    cancel: true,
    persistent: true,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
  }).onOk(async () => {
    await deleteBha(project.value?._id, bha._id);
    await fetchProject();
  });
};
</script>

<style scoped>
.bg-gradient-primary {
  background: linear-gradient(135deg, var(--q-primary) 0%, #1976d2 100%);
}

.hover-shadow {
  transition: box-shadow 0.3s ease;
}

.hover-shadow:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}
</style>

<style scoped>
.bg-gradient-primary {
  background: linear-gradient(135deg, var(--q-primary) 0%, #1976d2 100%);
}

.hover-shadow {
  transition: box-shadow 0.3s ease;
}

.hover-shadow:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}
</style>
