<template>
  <q-dialog v-model="dialogValue" persistent>
    <q-card style="min-width: 700px; max-width: 900px">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">
          {{ editItem ? 'Editar Geomecánica' : 'Nuevo Registro Geomecánico' }}
        </div>
      </q-card-section>
      <q-card-section>
        <q-form ref="formRef" @submit.prevent="submit">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-input v-model="local.section" label="Sección" dense outlined />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="local.hour_24h" type="time" label="Hora (24h)" dense outlined />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model.number="local.lag_depth_ft"
                type="number"
                label="Prof. LAG (ft)"
                dense
                outlined
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="local.event" label="Evento" dense outlined />
            </div>
            <div class="col-12 col-md-4 flex items-center q-mt-md">
              <q-toggle v-model="local.derrumbes" label="Derrumbes" color="primary" />
            </div>
          </div>
          <q-separator class="q-my-md" />
          <div class="text-subtitle2 q-mb-sm">Parámetros Generales</div>
          <div class="row q-col-gutter-sm">
            <div class="col-6 col-md-2">
              <q-input
                v-model.number="local.min_mm"
                type="number"
                label="Min (mm)"
                dense
                outlined
              />
            </div>
            <div class="col-6 col-md-2">
              <q-input
                v-model.number="local.max_mm"
                type="number"
                label="Max (mm)"
                dense
                outlined
              />
            </div>
            <div class="col-6 col-md-2">
              <q-input
                v-model.number="local.avg_mm"
                type="number"
                label="Prom (mm)"
                dense
                outlined
              />
            </div>
            <div class="col-6 col-md-2">
              <q-input
                v-model.number="local.cuttings_rate_bph"
                type="number"
                label="Cortes (bph)"
                dense
                outlined
              />
            </div>
            <div class="col-6 col-md-2">
              <q-input
                v-model.number="local.excess_deficit_bbl"
                type="number"
                label="Exceso/Def (bbl)"
                dense
                outlined
              />
            </div>
            <div class="col-6 col-md-2">
              <q-input v-model="local.inc_zarandas" label="Inc. Zarandas" dense outlined />
            </div>
            <div class="col-6 col-md-2">
              <q-input
                v-model.number="local.mw_lpg"
                type="number"
                label="MW (lpg)"
                dense
                outlined
              />
            </div>
            <div class="col-6 col-md-2">
              <q-input
                v-model.number="local.ecd_lpg"
                type="number"
                label="ECD (lpg)"
                dense
                outlined
              />
            </div>
          </div>
          <q-separator class="q-my-md" />
          <div class="text-subtitle2 q-mb-sm">Morfología (%)</div>
          <div class="row q-col-gutter-sm">
            <div class="col-6 col-md-3">
              <q-input
                v-model.number="local.morphology_normal_pct"
                type="number"
                label="Normal"
                dense
                outlined
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model.number="local.morphology_retrab_pct"
                type="number"
                label="Retrab."
                dense
                outlined
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model.number="local.morphology_angular_pct"
                type="number"
                label="Angular"
                dense
                outlined
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model.number="local.morphology_tabular_pct"
                type="number"
                label="Tabular"
                dense
                outlined
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model.number="local.morphology_astilloso_pct"
                type="number"
                label="Astilloso"
                dense
                outlined
              />
            </div>
          </div>
          <q-separator class="q-my-md" />
          <div class="row items-center q-mb-sm">
            <div class="col"><div class="text-subtitle2">Litologías</div></div>
            <div class="col-auto"><q-btn dense flat icon="add" @click="addLithology" /></div>
          </div>
          <q-table
            :rows="local.lithologies"
            :columns="columns"
            row-key="name"
            flat
            dense
            hide-bottom
          >
            <template #body-cell-present="props">
              <q-td :props="props"><q-checkbox v-model="props.row.present" /></q-td>
            </template>
            <template #body-cell-actions="props">
              <q-td :props="props"
                ><q-btn
                  dense
                  size="xs"
                  color="negative"
                  icon="delete"
                  flat
                  @click="removeLithology(props.rowIndex)"
              /></q-td>
            </template>
          </q-table>
          <q-separator class="q-my-md" />
          <q-input
            v-model="local.remarks"
            type="textarea"
            label="Observaciones"
            outlined
            autogrow
          />
          <div class="q-mt-md">
            <q-file
              v-model="local.image"
              label="Imagen"
              accept="image/*"
              outlined
              dense
              use-chips
            />
            <div v-if="editItem?.image_url" class="q-mt-sm">
              <q-img
                :src="publicUrl(editItem.image_url)"
                style="max-height: 160px"
                :ratio="16 / 9"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn flat label="Cancelar" v-close-popup />
        <q-btn color="primary" :label="editItem ? 'Guardar' : 'Crear'" @click="submit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useGeomechanics } from 'src/composables/useGeomechanics';
import { publicUrl } from 'src/utils/images';

const props = defineProps<{ modelValue: boolean; editItem?: any; projectId?: string }>();
const emit = defineEmits(['update:modelValue', 'saved']);
const dialogValue = ref(props.modelValue);
const { createItem, updateItem } = useGeomechanics();
const formRef = ref();

const local = ref<any>({
  section: '8 1/2"',
  hour_24h: '08:00',
  lag_depth_ft: 0,
  derrumbes: false,
  lithologies: [],
});

watch(
  () => props.modelValue,
  (v) => {
    dialogValue.value = v;
    if (v) init();
  },
);
watch(dialogValue, (v) => emit('update:modelValue', v));

function init() {
  if (props.editItem) {
    // Tomar sólo campos editables, evitando _id, timestamps, etc.
    const src = props.editItem;
    local.value = {
      section: src.section,
      hour_24h: src.hour_24h,
      lag_depth_ft: src.lag_depth_ft,
      event: src.event,
      derrumbes: src.derrumbes,
  morphology_normal_pct: src.morphology_normal_pct,
      morphology_retrab_pct: src.morphology_retrab_pct,
      morphology_angular_pct: src.morphology_angular_pct,
      morphology_tabular_pct: src.morphology_tabular_pct,
      morphology_astilloso_pct: src.morphology_astilloso_pct,
      lithologies: (src.lithologies || []).map((l: any) => ({
        name: l.name,
        present: !!l.present,
      })),
      min_mm: src.min_mm,
      max_mm: src.max_mm,
      avg_mm: src.avg_mm,
      cuttings_rate_bph: src.cuttings_rate_bph,
      excess_deficit_bbl: src.excess_deficit_bbl,
      inc_zarandas: src.inc_zarandas,
      mw_lpg: src.mw_lpg,
      ecd_lpg: src.ecd_lpg,
      remarks: src.remarks,
      project: src.project, // mantener referencia de filtrado
      image: null,
    };
  } else {
    local.value = {
      section: '8 1/2"',
      hour_24h: '08:00',
      lag_depth_ft: 0,
      derrumbes: false,
      lithologies: sampleLithologies(),
  morphology_normal_pct: 0,
      image: null,
      project: props.projectId,
    };
  }
}

function sampleLithologies() {
  return [
    'Claystone',
    'Volcanic Tuff',
    'Gray Shale',
    'Green Shale',
    'Siltstone',
    'Limestone',
    'Sandstone',
    'Coal',
  ].map((n) => ({ name: n, present: false }));
}

const columns = [
  { name: 'name', label: 'Litología', field: 'name' },
  { name: 'present', label: 'X', field: 'present' },
  { name: 'actions', label: '', field: 'actions' },
];

function addLithology() {
  local.value.lithologies.push({ name: 'Nueva', present: false });
}
function removeLithology(idx: number) {
  local.value.lithologies.splice(idx, 1);
}

async function submit() {
  // Sanitizar payload para evitar campos no permitidos por el DTO (whitelist)
  const allowed = [
    'section',
    'hour_24h',
    'lag_depth_ft',
    'event',
    'derrumbes',
  'morphology_normal_pct',
    'morphology_retrab_pct',
    'morphology_angular_pct',
    'morphology_tabular_pct',
    'morphology_astilloso_pct',
    'lithologies',
    'min_mm',
    'max_mm',
    'avg_mm',
    'cuttings_rate_bph',
    'excess_deficit_bbl',
    'inc_zarandas',
    'mw_lpg',
    'ecd_lpg',
    'remarks',
    'project',
    'image',
  ];
  const payload: any = {};
  allowed.forEach((k) => {
    if (local.value[k] !== undefined) payload[k] = local.value[k];
  });
  //payload.lithologies = payload.lithologies;
  if (props.editItem?._id) {
    await updateItem(props.editItem._id, payload);
  } else {
    await createItem(payload);
  }
  emit('saved');
  dialogValue.value = false;
}
defineOptions({ name: 'GeomechanicForm' });
</script>
<script lang="ts">
export default { name: 'GeomechanicFormWrapper' };
</script>
