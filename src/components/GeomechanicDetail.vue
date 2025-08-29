<template>
  <q-dialog
    v-model="dialogValue"
    persistent
    maximized
    transition-show="fade"
    transition-hide="fade"
  >
    <q-card class="geome-detail-card">
      <q-bar class="bg-primary text-white">
        <div class="text-subtitle1 text-weight-bold">
          Detalle Geomecánico - Sección {{ item?.section || '8 1/2"' }}
        </div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup />
      </q-bar>

      <q-card-section class="q-pa-none scroll">
        <div class="detail-wrapper">
          <!-- Imagen principal con regla -->
          <div class="image-section">
            <div class="image-wrapper" v-if="item?.image_url">
              <q-img :src="publicUrl(item.image_url)" class="core-image" />
            </div>
            <div v-else class="image-wrapper placeholder flex flex-center column">
              <q-icon name="image" size="64px" color="grey-5" />
              <div class="text-grey-6">Sin imagen</div>
            </div>
            <!-- Regla simulada -->
            <!-- <div class="ruler">
              <div class="ruler-numbers">
                <span v-for="n in 16" :key="n" class="ruler-mark">{{ n - 1 }}</span>
              </div>
            </div> -->
          </div>

          <!-- Nueva distribución en 5 cuadros -->
          <div class="info-panels">
            <!-- Panel 1: Geomecánica -->
            <div class="panel panel-geomec">
              <div class="panel-header geomec">
                GEOMECÁNICA - SECCIÓN {{ item?.section || '8 1/2"' }}
              </div>
              <div class="panel-body small-grid">
                <div class="row-item">
                  <span class="row-label">Hora:</span
                  ><span class="row-value">{{ item?.hour_24h || '24h' }}</span>
                </div>
                <div class="row-item">
                  <span class="row-label">Prof. LAG (pies):</span
                  ><span class="row-value">{{ item?.lag_depth_ft || '10604' }}'</span>
                </div>
                <div class="row-item">
                  <span class="row-label">Evento:</span
                  ><span class="row-value">{{ item?.event || 'MONITOREO' }}</span>
                </div>
              </div>
            </div>

            <!-- Panel 2: Morfología -->
            <div class="panel panel-morph">
              <div class="panel-header morph">MORFOLOGÍA</div>
              <div class="panel-body">
                <div class="derrumbes">
                  <div class="derrumbes-title">DERRUMBES</div>
                  <div class="derrumbes-options">
                    <div class="derrumbes-option" :class="{ active: item?.derrumbes }">
                      <span>SI</span>
                      <div class="checkbox" :class="{ checked: item?.derrumbes }">
                        <span v-if="item?.derrumbes">X</span>
                      </div>
                    </div>
                    <div class="derrumbes-option" :class="{ active: !item?.derrumbes }">
                      <span>NO</span>
                      <div class="checkbox" :class="{ checked: !item?.derrumbes }">
                        <span v-if="!item?.derrumbes">X</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="morph-stats">
                  <div class="morph-row">
                    <span class="morph-label">Normal</span
                    ><span class="morph-value">{{ item?.morphology_normal_pct ?? '-' }}%</span>
                  </div>
                  <div class="morph-row">
                    <span class="morph-label">Retrab.</span
                    ><span class="morph-value">{{ item?.morphology_retrab_pct ?? '-' }}%</span>
                  </div>
                  <div class="morph-row">
                    <span class="morph-label">Angular</span
                    ><span class="morph-value">{{ item?.morphology_angular_pct ?? '-' }}%</span>
                  </div>
                  <div class="morph-row">
                    <span class="morph-label">Tabular</span
                    ><span class="morph-value">{{ item?.morphology_tabular_pct ?? '-' }}%</span>
                  </div>
                  <div class="morph-row">
                    <span class="morph-label">Astilloso</span
                    ><span class="morph-value">{{ item?.morphology_astilloso_pct ?? '-' }}%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Panel 3: Litología -->
            <div class="panel panel-lith">
              <div class="panel-header lith">LITOLOGÍA</div>
              <div class="panel-body lith-body">
                <div v-for="l in presentLithologies" :key="l.key" class="lith-item">
                  <div class="color-box" :class="l.color"></div>
                  <span class="lith-name present">{{ l.label }}</span>
                  <span class="present-x">X</span>
                </div>
                <div v-for="l in absentLithologies" :key="l.key + '-abs'" class="lith-item">
                  <div class="color-box" :class="l.color"></div>
                  <span class="lith-name">{{ l.label }}</span>
                </div>
              </div>
            </div>

            <!-- Panel 4: Tamaños -->
            <div class="panel panel-sizes">
              <div class="panel-header sizes">TAMAÑOS</div>
              <div class="panel-body sizes-body">
                <div class="size-row">
                  <span class="size-label">Mínimo</span
                  ><span class="size-value">{{ item?.min_mm ?? '-' }} mm</span>
                </div>
                <div class="size-row">
                  <span class="size-label">Máximo</span
                  ><span class="size-value">{{ item?.max_mm ?? '-' }} mm</span>
                </div>
                <div class="size-row">
                  <span class="size-label">Promedio</span
                  ><span class="size-value">{{ item?.avg_mm ?? '-' }} mm</span>
                </div>
                <div class="size-row">
                  <span class="size-label">Tasa promedio de cortes</span
                  ><span class="size-value">{{ item?.cuttings_rate_bph ?? '-' }} bph</span>
                </div>
                <div class="size-row">
                  <span class="size-label">Exceso/deficit</span
                  ><span class="size-value">{{ item?.excess_deficit_bbl ?? '-' }} bbl</span>
                </div>
                <div class="size-row">
                  <span class="size-label">Inc. Zarandas</span
                  ><span class="size-value">{{ item?.inc_zarandas ?? '-' }} %</span>
                </div>
                <div class="size-row">
                  <span class="size-label">MW</span
                  ><span class="size-value">{{ item?.mw_lpg || '-' }} lpg</span>
                </div>
                <div class="size-row">
                  <span class="size-label">ECD</span
                  ><span class="size-value">{{ item?.ecd_lpg || '-' }} lpg</span>
                </div>
              </div>
            </div>

            <!-- Panel 5: Remarks -->
            <div class="panel panel-remarks">
              <div class="panel-header remarks">REMARKS</div>
              <div class="panel-body remarks-body">
                {{
                  item?.remarks ||
                  'Se determina una tasa promedio de retorno 0.15 bph. Se observa en los retornos poco material retrabajado de lutita con tamaños entre 2 mm a 3 mm y arcillolita de tamaño máximo 2 mm. Sin evidencia de cavings.'
                }}
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />
      <q-card-actions align="right" class="bg-grey-1">
        <q-btn color="primary" unelevated icon="close" label="Cerrar" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { publicUrl } from 'src/utils/images';

const props = defineProps<{ modelValue: boolean; item?: any }>();
const emit = defineEmits(['update:modelValue']);
const dialogValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (v) => (dialogValue.value = v),
);
watch(dialogValue, (v) => emit('update:modelValue', v));

// listado de litologías a mostrar
const lithologies = [
  { key: 'claystone', label: 'Claystone', color: 'claystone' },
  { key: 'volcanic_tuff', label: 'Volcanic Tuff', color: 'volcanic-tuff' },
  { key: 'gray_shale', label: 'Gray Shale', color: 'gray-shale' },
  { key: 'green_shale', label: 'Green Shale', color: 'green-shale' },
  { key: 'siltstone', label: 'Siltstone', color: 'siltstone' },
  { key: 'limestone', label: 'Limestone', color: 'limestone' },
  { key: 'sandstone', label: 'Sandstone', color: 'sandstone' },
  { key: 'coal', label: 'Coal', color: 'coal' },
];

function hasLithology(label: string) {
  return (
    props.item?.lithologies?.some(
      (l: any) => l.name?.toLowerCase() === label.toLowerCase() && l.present,
    ) || false
  );
}

const presentLithologies = computed(() => lithologies.filter((l) => hasLithology(l.label)));
const absentLithologies = computed(() => lithologies.filter((l) => !hasLithology(l.label)));

defineOptions({ name: 'GeomechanicDetail' });
</script>

<style scoped>
.geome-detail-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.detail-wrapper {
  padding: 0;
  background: white;
}

.image-section {
  position: relative;
  background: #f5f5f5;
}

.image-wrapper {
  width: 100%;
  height: 300px;
  background: #e0e0e0;
}

.core-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ruler {
  background: white;
  height: 30px;
  border-top: 2px solid #333;
  position: relative;
}

.ruler-numbers {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  height: 100%;
  align-items: center;
}

.ruler-mark {
  font-size: 12px;
  font-weight: bold;
  color: #333;
}

.logos-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: white;
  border-bottom: 2px solid #333;
}

.logo-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.wayra-logo {
  background: #ff9800;
  color: white;
  padding: 4px 8px;
  font-weight: bold;
  font-size: 14px;
}

.energy-text {
  color: #ff9800;
  font-weight: bold;
  font-size: 14px;
}

.sinopec-logo {
  color: #d32f2f;
  font-weight: bold;
  font-size: 16px;
  border: 2px solid #d32f2f;
  padding: 4px 8px;
  border-radius: 50%;
}

/* Nueva maquetación */
.info-panels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 8px;
  padding: 8px;
  border: 2px solid #333;
  background: #fff;
}

.panel {
  border: 1px solid #333;
  display: flex;
  flex-direction: column;
  position: relative;
  background: #fafafa;
}

.panel-header {
  font-weight: bold;
  font-size: 12px;
  text-align: center;
  padding: 4px 6px;
  border-bottom: 1px solid #333;
}

.panel-header.geomec {
  background: #4caf50;
  color: #fff;
}
.panel-header.morph {
  background: #c8e6c9;
  color: #2e7d32;
}
.panel-header.lith {
  background: #e0e0e0;
}
.panel-header.sizes {
  background: #e0f7fa;
}
.panel-header.remarks {
  background: #ffe0b2;
}

.panel-body {
  padding: 6px;
  font-size: 11px;
  word-break: break-word;
  overflow-wrap: anywhere;
}
.small-grid .row-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}
.row-label {
  font-weight: bold;
  margin-right: 4px;
}

/* Derrumbes / Morfología */
.derrumbes {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.derrumbes-title {
  font-weight: bold;
  font-size: 11px;
}
.derrumbes-options {
  display: flex;
  gap: 12px;
}
.derrumbes-option {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
}
.checkbox {
  width: 16px;
  height: 16px;
  border: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
}
.checkbox.checked {
  background: #4caf50;
  color: #fff;
}
.morph-stats .morph-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2px;
}
.morph-label {
  font-weight: bold;
}

/* Litologías */
.lith-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.lith-item {
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  padding: 2px 4px;
  border: 1px solid #ddd;
}
.lith-item .present-x {
  position: absolute;
  right: 4px;
  font-weight: bold;
  color: #2e7d32;
}
.color-box {
  width: 14px;
  height: 14px;
  border: 1px solid #333;
}
.claystone {
  background: #d7b899;
}
.volcanic-tuff {
  background: #ff6b6b;
}
.gray-shale {
  background: #666;
}
.green-shale {
  background: #4caf50;
}
.siltstone {
  background: #f44336;
}
.limestone {
  background: #81d4fa;
}
.sandstone {
  background: #ffeb3b;
}
.coal {
  background: #212121;
}
.lith-name.present {
  font-weight: bold;
}

/* Tamaños */
.sizes-body .size-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3px;
}
.size-label {
  font-weight: bold;
}

/* Remarks */
.remarks-body {
  font-size: 11px;
  line-height: 1.3;
  white-space: pre-line; /* respeta saltos pero permite wrap */
  word-break: break-word;
  overflow-wrap: anywhere;
  max-width: 100%;
  overflow-x: hidden;
}

/* Evitar que el contenido fuerce scroll horizontal general */
.geome-detail-card,
.detail-wrapper {
  overflow-x: hidden;
}

/* Asegurar que los paneles no crezcan más allá del contenedor por palabras largas */
.panel {
  min-width: 0;
}

@media (max-width: 1024px) {
  .info-panels {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 1024px) {
  .lithology-table {
    grid-template-columns: 100px repeat(8, 1fr);
    font-size: 10px;
  }

  .report-table {
    font-size: 10px;
  }
}
</style>
