<template>
  <div class="q-mb-lg">
    <div class="text-h5 text-accent q-mb-md">
      <q-icon name="bar_chart" class="q-mr-sm" />
      Datos Estáticos del Proyecto
    </div>
    <q-card class="shadow-2 q-mb-md ultra-compact-card">
      <q-card-section class="q-pa-xs">
        <!-- Organizar datos en grid horizontal compacto -->
        <div class="compact-grid">
          <div v-for="(arr, key) in staticDataArrays" :key="key" class="data-column">
            <div class="column-header">
              {{ staticDataLabels[key] }}
            </div>
            <div class="data-rows">
              <div v-for="(item, index) in arr ?? []" :key="index" class="data-row">
                <template
                  v-if="['rop_efec_kpi', 'rop_avg_kpi', 'trip_rop_kpi', 'conex_kpi'].includes(key)"
                >
                  <span class="data-cell">{{ item.depth }}</span>
                  <span class="data-cell">{{ item.rop }}</span>
                </template>
                <template v-else>
                  <span class="data-cell full-width">{{ item.time }}</span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  projectStaticData: any;
}>();

const staticDataLabels: Record<string, string> = {
  rop_efec_kpi: 'ROP EFEC KPI',
  rop_avg_kpi: 'ROP AVG KPI',
  trip_rop_kpi: 'TRIP ROP KPI',
  conex_kpi: 'CONEX KPI',
  review_kpi: 'REVIEW KPI',
  survey_kpi: 'SURVEY KPI',
  total_rcs: 'TOTAL RCS',
};

const staticDataArrays = computed(() => {
  if (!props.projectStaticData) return {};
  return {
    rop_efec_kpi: props.projectStaticData.rop_efec_kpi || [],
    rop_avg_kpi: props.projectStaticData.rop_avg_kpi || [],
    trip_rop_kpi: props.projectStaticData.trip_rop_kpi || [],
    conex_kpi: props.projectStaticData.conex_kpi || [],
    review_kpi: props.projectStaticData.review_kpi || [],
    survey_kpi: props.projectStaticData.survey_kpi || [],
    total_rcs: props.projectStaticData.total_rcs || [],
  };
});
</script>

<style scoped>
.ultra-compact-card {
  border-radius: 2px;
  border: 1px solid #e0e0e0;
}

.compact-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
}

.data-column {
  flex: 1;
  min-width: 120px;
  max-width: 180px;
  border: 1px solid #1976d2;
  border-radius: 2px;
  overflow: hidden;
}

.column-header {
  background-color: #1976d2;
  color: white;
  padding: 2px 4px;
  font-weight: bold;
  text-align: center;
  line-height: 1.2;
  min-height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.data-rows {
  background-color: #f5f5f5;
}

.data-row {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  min-height: 14px;
}

.data-row:last-child {
  border-bottom: none;
}

.data-cell {
  flex: 1;
  padding: 1px 3px;
  line-height: 1.1;
  border-right: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  background-color: white;
  min-height: 12px;
}

.data-cell:last-child {
  border-right: none;
}

.data-cell.full-width {
  border-right: none;
  justify-content: center;
}

.q-card-section.q-pa-xs {
  padding: 4px !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .compact-grid {
    flex-direction: column;
  }

  .data-column {
    max-width: none;
    min-width: 100%;
  }
}

/* Ensure text doesn't wrap and stays compact */
.data-cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
