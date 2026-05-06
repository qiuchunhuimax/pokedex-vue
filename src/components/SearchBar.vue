<template>
  <div class="search-wrap">
    <svg class="search-icon" viewBox="0 0 16 16" fill="none">
      <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" stroke-width="1.5"/>
      <path d="M10 10l3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
    <input
      class="search-input"
      type="search"
      :placeholder="placeholder"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: string; placeholder: string }>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()
</script>

<style scoped>
.search-wrap {
  position: relative;
  flex: 1;
  min-width: 160px;
}
.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: var(--txt2);
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 7px 10px 7px 32px;
  background: var(--bg3);
  border: 1px solid var(--border-strong);
  border-radius: 8px;
  color: var(--txt);
  font-size: var(--fs-input);
  outline: none;
  transition: border-color 0.15s;
}
.search-input::placeholder { color: var(--txt2); }
.search-input:focus { border-color: var(--accent); }
.search-input::-webkit-search-cancel-button { cursor: pointer; }
</style>
