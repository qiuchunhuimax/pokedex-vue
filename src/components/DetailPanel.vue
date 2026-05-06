<template>
  <aside class="detail-panel" :class="{ empty: !pokemon }">
    <template v-if="pokemon">
      <div class="detail-hero" :style="{ background: heroBg }">
        <img
          class="detail-img"
          :src="spriteUrl"
          :alt="name"
          @error="onImgError"
        />
        <div class="detail-id">{{ ui.number }} {{ String(pokemon.id).padStart(3, '0') }}</div>
      </div>

      <div class="detail-body">
        <h2 class="detail-name">{{ name }}</h2>

        <div class="detail-types">
          <span
            v-for="t in pokemon.types"
            :key="t"
            class="type-pill"
            :style="{ background: TYPE_COLORS[t] }"
          >{{ TYPE_LABELS[t][lang] }}</span>
        </div>

        <div class="detail-props">
          <div class="prop-row">
            <span class="prop-label">{{ ui.generation }}</span>
            <span class="prop-value">{{ genRoman[pokemon.generation] }}</span>
          </div>
          <div class="prop-row">
            <span class="prop-label">{{ ui.primaryType }}</span>
            <span class="prop-value">{{ TYPE_LABELS[pokemon.types[0]][lang] }}</span>
          </div>
          <div v-if="pokemon.types[1]" class="prop-row">
            <span class="prop-label">{{ ui.secondaryType }}</span>
            <span class="prop-value">{{ TYPE_LABELS[pokemon.types[1]][lang] }}</span>
          </div>
        </div>

        <div class="detail-names">
          <div class="names-title">{{ ui.names }}</div>
          <div class="name-row"><span class="name-lang">EN</span><span>{{ pokemon.nameEn }}</span></div>
          <div class="name-row"><span class="name-lang">中文</span><span>{{ pokemon.nameZh }}</span></div>
          <div class="name-row"><span class="name-lang">日本語</span><span>{{ pokemon.nameJa }}</span></div>
        </div>
      </div>
    </template>

    <div v-else class="detail-empty">
      <div class="pokeball-icon">⬤</div>
      <p>{{ ui.clickPrompt }}</p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { SELECTED_KEY, LANG_KEY } from '../types'
import { TYPE_COLORS, TYPE_LABELS } from '../data/pokemonTypes'
import { TRANSLATIONS } from '../i18n/translations'

const FALLBACK = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Ccircle cx='40' cy='40' r='36' fill='rgba(255,255,255,0.15)'/%3E%3Cline x1='4' y1='40' x2='76' y2='40' stroke='rgba(255,255,255,0.3)' stroke-width='3'/%3E%3Ccircle cx='40' cy='40' r='10' fill='rgba(255,255,255,0.4)'/%3E%3C/svg%3E`

const pokemon   = inject(SELECTED_KEY)!
const lang      = inject(LANG_KEY)!
const ui        = computed(() => TRANSLATIONS[lang.value])

const genRoman: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX' }

const name = computed(() => {
  if (!pokemon.value) return ''
  const l = lang.value
  if (l === 'zh') return pokemon.value.nameZh
  if (l === 'ja') return pokemon.value.nameJa
  return pokemon.value.nameEn
})

const spriteUrl = computed(() =>
  pokemon.value
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.value.id}.png`
    : FALLBACK
)

const heroBg = computed(() =>
  pokemon.value ? TYPE_COLORS[pokemon.value.types[0]] + '99' : 'var(--bg3)'
)

function onImgError(e: Event) {
  (e.target as HTMLImageElement).src = FALLBACK
}
</script>

<style scoped>
.detail-panel {
  width: 220px;
  flex-shrink: 0;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  position: sticky;
  top: 16px;
  align-self: flex-start;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
}
.detail-panel.empty {
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 16px 12px;
  gap: 6px;
  transition: background 0.2s;
}
.detail-img {
  width: 96px;
  height: 96px;
  object-fit: contain;
  image-rendering: pixelated;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
}
.detail-id {
  font-size: var(--fs-detail-label);
  font-family: var(--font-mono);
  color: var(--cell-muted);
}

.detail-body { padding: 14px 16px 20px; }
.detail-name {
  font-size: var(--fs-detail-title);
  font-weight: 600;
  color: var(--txt);
  margin-bottom: 10px;
  line-height: 1.2;
  word-break: break-word;
}
.detail-types { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
.type-pill {
  font-size: var(--fs-detail-label);
  color: #fff;
  padding: 3px 10px;
  border-radius: 20px;
  font-weight: 600;
}

.detail-props { margin-bottom: 16px; }
.prop-row {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px solid var(--border);
  font-size: var(--fs-detail-body);
}
.prop-label { color: var(--txt2); }
.prop-value { color: var(--txt); font-weight: 500; }

.detail-names {}
.names-title {
  font-size: var(--fs-detail-label);
  font-weight: 600;
  color: var(--txt2);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
}
.name-row {
  display: flex;
  gap: 10px;
  padding: 4px 0;
  font-size: var(--fs-detail-body);
  align-items: baseline;
}
.name-lang {
  font-size: var(--fs-detail-label);
  color: var(--txt2);
  min-width: 44px;
  font-weight: 600;
}

.detail-empty {
  padding: 40px 20px;
  text-align: center;
  color: var(--txt2);
  font-size: var(--fs-detail-body);
}
.pokeball-icon {
  font-size: 36px;
  opacity: 0.15;
  margin-bottom: 12px;
}
</style>
