<template>
  <div class="type-filter">
    <button
      class="type-chip"
      :class="{ active: modelValue === null }"
      @click="emit('update:modelValue', null)"
    >{{ allLabel }}</button>
    <button
      v-for="t in TYPE_KEYS"
      :key="t"
      class="type-chip"
      :class="{ active: modelValue === t }"
      :style="chipStyle(t)"
      @click="emit('update:modelValue', modelValue === t ? null : t)"
    >{{ TYPE_LABELS[t][lang] }}</button>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import type { PokemonType } from '../types'
import { LANG_KEY } from '../types'
import { TYPE_COLORS, TYPE_LABELS, TYPE_KEYS } from '../data/pokemonTypes'

defineProps<{ modelValue: PokemonType | null; allLabel: string }>()
const emit = defineEmits<{ 'update:modelValue': [PokemonType | null] }>()

const lang = inject(LANG_KEY)!

function chipStyle(t: PokemonType) {
  const color = TYPE_COLORS[t]
  return {
    '--chip-color': color,
  }
}
</script>

<style scoped>
.type-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 10px 0 6px;
}
.type-chip {
  font-size: var(--fs-control);
  padding: 6px 14px;
  border-radius: 20px;
  color: var(--txt2);
  background: var(--bg3);
  border: 1px solid var(--border);
  transition: background 0.12s, color 0.12s, border-color 0.12s;
  font-weight: 500;
  white-space: nowrap;
}
.type-chip:hover {
  border-color: var(--chip-color, var(--accent));
  color: var(--txt);
}
.type-chip.active {
  background: var(--chip-color, var(--accent));
  border-color: var(--chip-color, var(--accent));
  color: #fff;
  font-weight: 600;
}

@media (max-width: 600px) {
  .type-filter { gap: 5px; padding: 8px 0 4px; }
  .type-chip   { padding: 5px 10px; font-size: 13px; }
}
</style>
