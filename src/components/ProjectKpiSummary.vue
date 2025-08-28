<template>
  <div class="row q-col-gutter-lg">
    <!-- Rendimiento -->
    <div class="col-12 col-md-4">
      <q-card flat bordered class="kpi-card">
        <q-card-section class="bg-primary text-white text-center">
          <div class="text-h6">Rendimiento</div>
        </q-card-section>
        <q-card-section>
          <q-table
            :rows="performanceRows"
            :columns="performanceColumns"
            dense
            flat
            hide-bottom
            class="kpi-table"
          />
        </q-card-section>
      </q-card>
    </div>

    <!-- Información de Tiempos -->
    <div class="col-12 col-md-4">
      <q-card flat bordered class="kpi-card">
        <q-card-section class="bg-primary text-white text-center">
          <div class="text-h6">Información de Tiempos [hs]</div>
        </q-card-section>
        <q-card-section>
          <q-table
            :rows="timeRows"
            :columns="timeColumns"
            dense
            flat
            hide-bottom
            class="kpi-table"
          />
        </q-card-section>
      </q-card>
    </div>

    <!-- Parámetros -->
    <div class="col-12 col-md-4">
      <q-card flat bordered class="kpi-card">
        <q-card-section class="bg-primary text-white text-center">
          <div class="text-h6">Parámetros</div>
        </q-card-section>
        <q-card-section>
          <q-table
            :rows="parameterRows"
            :columns="parameterColumns"
            dense
            flat
            hide-bottom
            class="kpi-table"
          />
        </q-card-section>
      </q-card>
    </div>
  </div>

  <div class="row q-col-gutter-lg q-mt-md">
    <!-- Survey Time y Viajes -->
    <div class="col-12 col-md-6">
      <q-card flat bordered class="kpi-card">
        <q-card-section class="bg-primary text-white text-center">
          <div class="text-h6">Survey Time [hs] & Viajes [ft/h]</div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-6">
              <div class="text-subtitle2">Survey Time</div>
              <div class="text-h6">{{ kpi.survey_time?.hs ?? 0 }}</div>
            </div>
            <div class="col-6">
              <q-table
                :rows="tripRows"
                :columns="tripColumns"
                dense
                flat
                hide-bottom
                class="kpi-table"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Conexiones -->
    <div class="col-12 col-md-6">
      <q-card flat bordered class="kpi-card">
        <q-card-section class="bg-primary text-white text-center">
          <div class="text-h6">Conexiones [hs]</div>
        </q-card-section>
        <q-card-section>
          <q-table
            :rows="conexRows"
            :columns="conexColumns"
            dense
            flat
            hide-bottom
            class="kpi-table"
          />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ kpi: any }>();

function formatRow(row: any, fields: string[]) {
  if (!row) return row;
  const formatted = { ...row };
  fields.forEach((field) => {
    if (typeof formatted[field] === 'number') {
      formatted[field] = formatted[field].toFixed(2);
    }
  });
  return formatted;
}

// Rendimiento
const performanceColumns = [
  { name: 'title', label: '', field: 'title', align: 'left' as const },
  { name: 'ft', label: 'ft', field: 'ft', align: 'right' as const },
  { name: 'hs', label: 'Hs', field: 'hs', align: 'right' as const },
  { name: 'rop', label: 'ROP', field: 'rop', align: 'right' as const },
  { name: 'percentage', label: '%', field: 'percentage', align: 'right' as const },
];
const performanceRows = computed(() => {
  const perf = props.kpi?.performance ?? {};
  const fields = ['ft', 'hs', 'rop', 'percentage'];
  return [
    perf.rotating,
    perf.sliding,
    perf.perforated,
    perf.by_filter,
    perf.average,
    perf.rotating_day,
    perf.rotating_night,
    perf.sliding_day,
    perf.sliding_night,
  ]
    .filter(Boolean)
    .map((row) => formatRow(row, fields));
});

// Información de Tiempos
const timeColumns = [
  { name: 'title', label: '', field: 'title', align: 'left' as const },
  { name: 'hs', label: 'Hs', field: 'hs', align: 'right' as const },
];
const timeRows = computed(() => {
  const t = props.kpi?.time_information ?? {};
  const fields = ['hs'];
  return [
    t.drilling_time,
    t.rotating_time,
    t.sliding_time,
    t.driving_time,
    t.pumping_time,
    t.conex_others,
  ]
    .filter(Boolean)
    .map((row) => formatRow(row, fields));
});

// Parámetros
const parameterColumns = [
  { name: 'title', label: '', field: 'title', align: 'left' as const },
  { name: 'min', label: 'Min', field: 'min', align: 'right' as const },
  { name: 'max', label: 'Max', field: 'max', align: 'right' as const },
  { name: 'average', label: 'Prom', field: 'average', align: 'right' as const },
];
const parameterRows = computed(() => {
  const p = props.kpi?.parameters ?? {};
  const fields = ['min', 'max', 'average'];
  return [
    p.wob,
    p.caudal,
    p.differential_pressure,
    p.spp_bottom,
    p.spp_out_bottom,
    p.tq_bottom,
    p.tq_out_bottom,
    p.total_rpm,
  ]
    .filter(Boolean)
    .map((row) => formatRow(row, fields));
});

// Survey Time y Viajes
const tripColumns = [
  { name: 'title', label: '', field: 'title', align: 'left' as const },
  { name: 'ft_hs', label: 'ft/hs', field: 'ft_hs', align: 'right' as const },
];
const tripRows = computed(() => {
  const t = props.kpi?.trips ?? {};
  const fields = ['ft_hs'];
  return [t.rih_csg, t.rih_oh, t.pooh_csg, t.pooh_oh]
    .filter(Boolean)
    .map((row) => formatRow(row, fields));
});

// Conexiones
const conexColumns = [
  { name: 'title', label: '', field: 'title', align: 'left' as const },
  { name: 'count', label: 'N', field: 'count', align: 'right' as const },
  { name: 'hs', label: 'Hs', field: 'hs', align: 'right' as const },
];
const conexRows = computed(() => {
  const c = props.kpi?.conex_time ?? {};
  const fields = ['count', 'hs'];
  return [c.day, c.night, c.total].filter(Boolean).map((row) => formatRow(row, fields));
});
</script>

<style scoped>
.kpi-card {
  min-height: 100%;
}
.kpi-table {
  font-size: 0.95em;
}
</style>
