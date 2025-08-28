<template>
  <div>
    <div v-for="(item, idx) in modelValue" :key="idx" class="row q-col-gutter-md q-mb-sm">
      <div v-for="field in fields" :key="field" class="col-6 col-md-3">
        <q-input
          v-model.number="item[field]"
          :label="fieldLabels[field]"
          type="number"
          outlined
          dense
        />
      </div>
      <div class="col-auto">
        <q-btn icon="delete" color="negative" flat dense @click="remove(idx)" />
      </div>
    </div>
    <q-btn icon="add" color="primary" flat dense label="Agregar" @click="add" class="q-mt-sm" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: any[]; fields: string[] }>();
const emit = defineEmits(['update:modelValue']);

const fieldLabels: Record<string, string> = {
  depth: 'Profundidad',
  rop: 'ROP',
  time: 'Tiempo',
};

function add() {
  emit('update:modelValue', [
    ...props.modelValue,
    Object.fromEntries(props.fields.map((f) => [f, 0])),
  ]);
}
function remove(idx: number) {
  const arr = [...props.modelValue];
  arr.splice(idx, 1);
  emit('update:modelValue', arr);
}
</script>
