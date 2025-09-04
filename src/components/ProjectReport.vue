<template>
  <div class="project-report">
    <div v-if="loading" class="loading-container">
      <q-spinner-dots color="primary" size="3em" />
      <div class="loading-text">Cargando reportes...</div>
    </div>

    <div v-else class="report-content">
      <!-- Header Section -->
      <div class="report-header">
        <h1 class="report-title">Dashboard de Perforación</h1>
        <div class="report-subtitle">Análisis de Rendimiento y Métricas</div>
      </div>

      <!-- Main Charts Grid -->
      <div class="charts-grid">
        <!-- Primary Metrics Row -->
        <div class="metrics-row">
          <!-- Plan vs Real Section -->
          <div class="chart-card primary-card">
            <div class="card-header">
              <h3 class="chart-title">PIES PERFORADOS PLAN VS REAL</h3>
            </div>
            <div class="chart-container large-chart">
              <Bar
                v-if="planVsRealData.labels.length"
                :data="planVsRealChartData"
                :options="enhancedBarOptions"
              />
            </div>
          </div>

          <!-- ROP Average Section -->
          <div class="chart-card primary-card">
            <div class="card-header">
              <h3 class="chart-title">ROP PROMEDIO PLAN VS REAL</h3>
            </div>
            <div class="chart-container large-chart">
              <Bar
                v-if="ropAverageData.labels.length"
                :data="ropAverageChartData"
                :options="enhancedRopOptions"
              />
            </div>
          </div>
        </div>

        <!-- Day/Night Performance Row -->
        <div class="day-night-row">
          <div class="chart-card secondary-card">
            <div class="card-header day-header">
              <h3 class="chart-title">PIES PERFORADOS DÍA</h3>
            </div>
            <div class="chart-container medium-chart">
              <Bar
                v-if="drilledFeetDayData.labels.length"
                :data="drilledFeetDayChartData"
                :options="compactBarOptions"
              />
            </div>
          </div>

          <div class="chart-card secondary-card">
            <div class="card-header night-header">
              <h3 class="chart-title">PIES PERFORADOS NOCHE</h3>
            </div>
            <div class="chart-container medium-chart">
              <Bar
                v-if="drilledFeetNightData.labels.length"
                :data="drilledFeetNightChartData"
                :options="compactBarOptions"
              />
            </div>
          </div>
        </div>

        <!-- Detailed Metrics Row -->
        <div class="detailed-metrics-row">
          <!-- ROP by Shifts -->
          <div class="chart-card detailed-card">
            <div class="card-header">
              <h3 class="chart-title">ROP ROTADO POR TURNOS</h3>
            </div>
            <div class="chart-container detailed-chart">
              <Chart
                v-if="ropRotatedByShiftData.labels.length"
                type="bar"
                :data="ropRotatedByShiftChartData"
                :options="enhancedMixedOptions"
              />
            </div>
          </div>

          <!-- Review Times -->
          <div class="chart-card detailed-card">
            <div class="card-header">
              <h3 class="chart-title">TIEMPOS DE REPASO POR TURNO</h3>
            </div>
            <div class="chart-container detailed-chart">
              <Chart
                type="bar"
                :data="reviewTimeByShiftChartData"
                :options="enhancedMixedOptions"
              />
            </div>
          </div>

          <!-- Survey Times -->
          <div class="chart-card detailed-card">
            <div class="card-header">
              <h3 class="chart-title">TIEMPOS DE SURVEY POR TURNO</h3>
            </div>
            <div class="chart-container detailed-chart">
              <Chart
                v-if="surveyTimeByShiftData.labels.length"
                type="bar"
                :data="surveyTimeByShiftChartData"
                :options="enhancedMixedOptions"
              />
            </div>
          </div>

          <!-- Connection Times -->
          <div class="chart-card detailed-card">
            <div class="card-header">
              <h3 class="chart-title">TIEMPOS DE CONEXIÓN POR TURNO</h3>
            </div>
            <div class="chart-container detailed-chart">
              <Chart
                v-if="conexionTimeByShiftData.labels.length"
                type="bar"
                :data="conexionTimeByShiftChartData"
                :options="enhancedMixedOptions"
              />
            </div>
          </div>
        </div>

        <!-- Activity Distribution Section -->
        <div class="activity-section">
          <div class="chart-card activity-card">
            <div class="card-header">
              <h3 class="chart-title">DISTRIBUCIÓN DE TIEMPO POR ACTIVIDAD</h3>
            </div>
            <div class="activity-content">
              <div class="pie-chart-container">
                <Pie :data="chartData" :options="enhancedPieOptions" />
              </div>
              <div class="activity-table-container">
                <q-table
                  v-if="pieData.raw?.length"
                  :rows="pieData.raw"
                  :columns="columns"
                  row-key="activity"
                  dense
                  flat
                  hide-bottom
                  :rows-per-page-options="[0]"
                  class="activity-table"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import { Pie, Bar, Chart } from 'vue-chartjs';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js';
import { useProjects } from 'src/composables/useProjects';
import type { ChartOptions } from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
);

const props = defineProps<{ projectId: string }>();

const { getProjectReport, pollProjectChanges, stopProjectPolling, projectReport } = useProjects();
const loading = ref(true);

// Enhanced Chart Options
const enhancedBarOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 20,
        font: {
          size: 14,
          weight: 'bold',
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: { size: 14 },
      bodyFont: { size: 12 },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: { size: 12, weight: 'bold' },
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
      ticks: {
        font: { size: 12 },
      },
    },
  },
};

const enhancedRopOptions: ChartOptions<'bar'> = {
  ...enhancedBarOptions,
  scales: {
    ...enhancedBarOptions.scales,
    y: {
      ...enhancedBarOptions.scales?.y,
      title: {
        display: true,
        text: 'ROP (ft/hr)',
        font: { size: 14, weight: 'bold' },
      },
    },
  },
};

const compactBarOptions: ChartOptions<'bar'> = {
  ...enhancedBarOptions,
  plugins: {
    ...enhancedBarOptions.plugins,
    legend: {
      position: 'bottom',
      labels: {
        padding: 15,
        font: { size: 12 },
      },
    },
  },
};

const enhancedMixedOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 15,
        font: { size: 12, weight: 'bold' },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: { size: 12 },
      bodyFont: { size: 11 },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 11 } },
    },
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(0, 0, 0, 0.1)' },
      ticks: { font: { size: 11 } },
      title: {
        display: true,
        text: 'Tiempo (h)',
        font: { size: 12, weight: 'bold' },
      },
    },
  },
};

const enhancedPieOptions: ChartOptions<'pie'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        padding: 20,
        font: { size: 13, weight: 'bold' },
        generateLabels: (chart) => {
          const data: any = chart.data;
          if (data.labels?.length && data.datasets?.length) {
            return data.labels.map((label: any, i: any) => ({
              text: `${label}`,
              fillStyle: data.datasets[0].backgroundColor?.[i] || '#000',
              strokeStyle: data.datasets[0].backgroundColor?.[i] || '#000',
              lineWidth: 0,
              index: i,
            }));
          }
          return [];
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: { size: 14 },
      bodyFont: { size: 12 },
      callbacks: {
        label: function (context) {
          const percentage = pieData.value.percentages[context.dataIndex];
          return `${context.label}: ${percentage}%`;
        },
      },
    },
  },
};

// Computed properties (keeping the original logic)
const pieData = computed(() => {
  const base = projectReport.value?.charts?.activityPie || {
    labels: [],
    data: [],
    percentages: [],
    raw: [],
  };
  if (!base.labels.length) {
    return {
      labels: ['Sin datos'],
      data: [0],
      percentages: [0],
      raw: [{ activity: 'Sin datos', time: 0, percentage: 0 }],
    };
  }
  return base;
});

const chartData = computed(() => ({
  labels: pieData.value.labels,
  datasets: [
    {
      data: pieData.value.data,
      backgroundColor: [
        '#3B82F6',
        '#EF4444',
        '#F59E0B',
        '#10B981',
        '#8B5CF6',
        '#F97316',
        '#84CC16',
        '#EC4899',
      ],
      borderWidth: 2,
      borderColor: '#ffffff',
    },
  ],
}));

const columns = [
  { name: 'activity', label: 'Actividad', field: 'activity', align: 'left' as const },
  { name: 'time', label: 'Tiempo (h)', field: 'time', align: 'right' as const },
  { name: 'percentage', label: '%', field: 'percentage', align: 'right' as const },
];

// All the computed properties for chart data (keeping original logic)
const planVsRealData = computed(() => {
  const data = projectReport.value?.charts?.drilledFeetPlanVsReal || {
    labels: [],
    planned: [],
    real: [],
  };
  if (!data.labels.length) {
    return { labels: ['-'], planned: [0], real: [0] };
  }
  return data;
});

const planVsRealChartData = computed(() => ({
  labels: planVsRealData.value.labels,
  datasets: [
    {
      label: 'PLANEADOS',
      backgroundColor: '#3B82F6',
      borderColor: '#1D4ED8',
      borderWidth: 2,
      data: planVsRealData.value.planned,
    },
    {
      label: 'REALES',
      backgroundColor: '#10B981',
      borderColor: '#047857',
      borderWidth: 2,
      data: planVsRealData.value.real,
    },
  ],
}));

const drilledFeetDayData = computed(() => {
  const data = projectReport.value?.charts?.drilledFeetDay || {
    labels: [],
    planned: [],
    real: [],
  };
  if (!data.labels.length) {
    return { labels: ['-'], planned: [0], real: [0] };
  }
  return data;
});

const drilledFeetDayChartData = computed(() => ({
  labels: drilledFeetDayData.value.labels,
  datasets: [
    {
      label: 'PLANEADOS',
      backgroundColor: '#3B82F6',
      data: drilledFeetDayData.value.planned,
    },
    {
      label: 'REALES',
      backgroundColor: '#10B981',
      data: drilledFeetDayData.value.real,
    },
  ],
}));

const drilledFeetNightData = computed(() => {
  const data = projectReport.value?.charts?.drilledFeetNight || {
    labels: [],
    planned: [],
    real: [],
  };
  if (!data.labels.length) {
    return { labels: ['-'], planned: [0], real: [0] };
  }
  return data;
});

const drilledFeetNightChartData = computed(() => ({
  labels: drilledFeetNightData.value.labels,
  datasets: [
    {
      label: 'PLANEADOS',
      backgroundColor: '#3B82F6',
      data: drilledFeetNightData.value.planned,
    },
    {
      label: 'REALES',
      backgroundColor: '#10B981',
      data: drilledFeetNightData.value.real,
    },
  ],
}));

const ropAverageData = computed(() => {
  const data = projectReport.value?.charts?.ropAverage || {
    labels: [],
    planned: [],
    real: [],
  };
  if (!data.labels.length) {
    return { labels: ['-'], planned: [0], real: [0] };
  }
  return data;
});

const ropAverageChartData = computed(() => ({
  labels: ropAverageData.value.labels,
  datasets: [
    {
      label: 'ROP PLAN',
      backgroundColor: '#EF4444',
      borderColor: '#DC2626',
      borderWidth: 2,
      data: ropAverageData.value.planned,
    },
    {
      label: 'ROP REAL',
      backgroundColor: '#3B82F6',
      borderColor: '#1D4ED8',
      borderWidth: 2,
      data: ropAverageData.value.real,
    },
  ],
}));

const ropRotatedByShiftData = computed(() => {
  const data = projectReport.value?.charts?.ropRotatedByShift || {
    labels: [],
    ropDay: [],
    ropNight: [],
    ropKpi: [],
  };
  if (!data.labels.length) {
    return { labels: ['-'], ropDay: [0], ropNight: [0], ropKpi: [0] };
  }
  return data;
});

const ropRotatedByShiftChartData = computed(() => ({
  labels: ropRotatedByShiftData.value.labels,
  datasets: [
    {
      type: 'bar' as const,
      label: 'ROP DÍA',
      backgroundColor: '#60A5FA',
      data: ropRotatedByShiftData.value.ropDay,
      yAxisID: 'y',
      order: 1,
    },
    {
      type: 'bar' as const,
      label: 'ROP NOCHE',
      backgroundColor: '#6B7280',
      data: ropRotatedByShiftData.value.ropNight,
      yAxisID: 'y',
      order: 1,
    },
    {
      type: 'line' as const,
      label: 'ROP PROMEDIO KPI',
      borderColor: '#EF4444',
      backgroundColor: '#EF4444',
      data: ropRotatedByShiftData.value.ropKpi,
      fill: false,
      tension: 0.3,
      pointBackgroundColor: '#EF4444',
      pointBorderColor: '#EF4444',
      pointRadius: 6,
      borderWidth: 3,
      yAxisID: 'y',
      order: 2,
    },
  ],
}));

const reviewTimeByShiftData = computed(() => {
  const data = projectReport.value?.charts?.reviewTimeByShift || {
    labels: [],
    time: [],
    day: [],
    night: [],
    kpi: [],
    raw: [],
  };
  if (!data.labels.length) {
    return { labels: [0], time: [0], day: [0], night: [0], kpi: [0], raw: [] };
  }
  return data;
});

const reviewTimeByShiftChartData = computed(() => ({
  labels: reviewTimeByShiftData.value.labels.map((i: number) => `#${i}`),
  datasets: [
    {
      type: 'bar' as const,
      label: 'Repaso Día',
      backgroundColor: '#60A5FA',
      data: reviewTimeByShiftData.value.day,
      yAxisID: 'y',
      order: 1,
    },
    {
      type: 'bar' as const,
      label: 'Repaso Noche',
      backgroundColor: '#6B7280',
      data: reviewTimeByShiftData.value.night,
      yAxisID: 'y',
      order: 1,
    },
    {
      type: 'line' as const,
      label: 'KPI Repaso',
      borderColor: '#EF4444',
      backgroundColor: '#EF4444',
      data: reviewTimeByShiftData.value.kpi,
      fill: false,
      tension: 0.3,
      pointBackgroundColor: '#EF4444',
      pointBorderColor: '#EF4444',
      pointRadius: 6,
      borderWidth: 3,
      yAxisID: 'y',
      order: 2,
    },
  ],
}));

const surveyTimeByShiftData = computed(() => {
  const data = projectReport.value?.charts?.surveyTimeByShift || {
    labels: [],
    time: [],
    day: [],
    night: [],
    kpi: [],
    raw: [],
  };
  if (!data.labels.length) {
    return { labels: [0], time: [0], day: [0], night: [0], kpi: [0], raw: [] };
  }
  return data;
});

const surveyTimeByShiftChartData = computed(() => ({
  labels: surveyTimeByShiftData.value.labels.map((i: number) => `#${i}`),
  datasets: [
    {
      type: 'bar' as const,
      label: 'Survey Día',
      backgroundColor: '#06B6D4',
      data: surveyTimeByShiftData.value.day,
      yAxisID: 'y',
      order: 1,
    },
    {
      type: 'bar' as const,
      label: 'Survey Noche',
      backgroundColor: '#F59E0B',
      data: surveyTimeByShiftData.value.night,
      yAxisID: 'y',
      order: 1,
    },
    {
      type: 'line' as const,
      label: 'KPI Survey',
      borderColor: '#EF4444',
      backgroundColor: '#EF4444',
      data: surveyTimeByShiftData.value.kpi,
      fill: false,
      tension: 0.3,
      pointBackgroundColor: '#EF4444',
      pointBorderColor: '#EF4444',
      pointRadius: 6,
      borderWidth: 3,
      yAxisID: 'y',
      order: 2,
    },
  ],
}));

const conexionTimeByShiftData = computed(() => {
  const data = projectReport.value?.charts?.conexionTimeByShift || {
    labels: [],
    time: [],
    day: [],
    night: [],
    kpi: [],
    raw: [],
  };
  if (!data.labels.length) {
    return { labels: [0], time: [0], day: [0], night: [0], kpi: [0], raw: [] };
  }
  return data;
});

const conexionTimeByShiftChartData = computed(() => ({
  labels: conexionTimeByShiftData.value.labels.map((i: number) => `#${i}`),
  datasets: [
    {
      type: 'bar' as const,
      label: 'Conexión Día',
      backgroundColor: '#84CC16',
      data: conexionTimeByShiftData.value.day,
      yAxisID: 'y',
      order: 1,
    },
    {
      type: 'bar' as const,
      label: 'Conexión Noche',
      backgroundColor: '#EC4899',
      data: conexionTimeByShiftData.value.night,
      yAxisID: 'y',
      order: 1,
    },
    {
      type: 'line' as const,
      label: 'KPI Conexión',
      borderColor: '#EF4444',
      backgroundColor: '#EF4444',
      data: conexionTimeByShiftData.value.kpi,
      fill: false,
      tension: 0.3,
      pointBackgroundColor: '#EF4444',
      pointBorderColor: '#EF4444',
      pointRadius: 6,
      borderWidth: 3,
      yAxisID: 'y',
      order: 2,
    },
  ],
}));

const fetchReport = async () => {
  loading.value = true;
  await getProjectReport(props.projectId);
  loading.value = false;
};

onMounted(async () => {
  await fetchReport();
  await pollProjectChanges(props.projectId, 5000); // cada 5 segundos
});
onUnmounted(() => {
  stopProjectPolling();
});
watch(
  () => props.projectId,
  async (newId) => {
    stopProjectPolling();
    await fetchReport();
    await pollProjectChanges(newId, 5000);
  },
);
</script>

<style lang="scss" scoped>
@import '../css/project.report.scss';
</style>
