<template>
  <Transition name="slide">
    <div v-if="compareList.length > 0" class="compare-panel">
      <div class="compare-header">
        <span class="compare-title">{{ title }}</span>
        <button class="clear-btn" @click="clearCompare()">✕ {{ clearLabel }}</button>
      </div>

      <div class="compare-body" :class="{ 'two-cols': compareList.length === 2 }">
        <!-- 每个宝可梦 -->
        <div
          v-for="p in compareList"
          :key="p.id"
          class="cmp-card"
          :style="{ '--cmp-color': TYPE_COLORS[p.types[0]] }"
        >
          <button class="remove-btn" @click="toggleCompare(p)">✕</button>
          <img
            class="cmp-img"
            :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`"
            :alt="getName(p)"
          />
          <div class="cmp-name">{{ getName(p) }}</div>
          <div class="cmp-types">
            <span v-for="t in p.types" :key="t" class="type-mini" :style="{ background: TYPE_COLORS[t] }">
              {{ TYPE_LABELS[t][lang] }}
            </span>
          </div>

          <!-- 数值 -->
          <div class="cmp-stats">
            <div v-for="(val, i) in getStats(p.id)" :key="i" class="cmp-stat-row">
              <span class="cmp-stat-label">{{ STAT_NAMES[lang][i] }}</span>
              <span class="cmp-stat-val" :style="{ color: statColor(val) }">{{ val }}</span>
            </div>
          </div>
        </div>

        <!-- 对比柱状图（两只时显示） -->
        <div v-if="compareList.length === 2" class="compare-bars">
          <div class="bars-title">{{ barsTitle }}</div>
          <div v-for="(_, i) in 6" :key="i" class="bar-compare-row">
            <span class="bar-label">{{ STAT_NAMES[lang][i] }}</span>
            <div class="bars-wrap">
              <!-- 左边宝可梦 -->
              <div class="bar-left-wrap">
                <div
                  class="bar-fill left"
                  :style="{
                    width: statPercent(getStats(compareList[0].id)[i]) + '%',
                    background: TYPE_COLORS[compareList[0].types[0]],
                    opacity: getStats(compareList[0].id)[i] >= getStats(compareList[1].id)[i] ? 1 : 0.5,
                  }"
                />
              </div>
              <span class="bar-vs">VS</span>
              <!-- 右边宝可梦 -->
              <div class="bar-right-wrap">
                <div
                  class="bar-fill right"
                  :style="{
                    width: statPercent(getStats(compareList[1].id)[i]) + '%',
                    background: TYPE_COLORS[compareList[1].types[0]],
                    opacity: getStats(compareList[1].id)[i] >= getStats(compareList[0].id)[i] ? 1 : 0.5,
                  }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="compareList.length === 1" class="compare-hint">
        {{ hint }}
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { LANG_KEY, COMPARE_LIST_KEY, TOGGLE_COMPARE_KEY, CLEAR_COMPARE_KEY } from '../types'
import type { Pokemon } from '../types'
import { TYPE_COLORS, TYPE_LABELS } from '../data/pokemonTypes'
import { getStats, statPercent, statColor, STAT_NAMES } from '../data/pokemonStats'

const lang        = inject(LANG_KEY)!
const compareList = inject(COMPARE_LIST_KEY)!
const toggleCompare = inject(TOGGLE_COMPARE_KEY)!
const clearCompare = inject(CLEAR_COMPARE_KEY)!

function getName(p: Pokemon) {
  if (lang.value === 'zh') return p.nameZh
  if (lang.value === 'ja') return p.nameJa
  return p.nameEn
}

const title = computed(() => {
  if (lang.value === 'zh') return '宝可梦对比'
  if (lang.value === 'ja') return 'ポケモン比較'
  return 'Compare'
})

const clearLabel = computed(() => {
  if (lang.value === 'zh') return '清空'
  if (lang.value === 'ja') return 'クリア'
  return 'Clear'
})

const barsTitle = computed(() => {
  if (lang.value === 'zh') return '数值对比'
  if (lang.value === 'ja') return 'ステータス比較'
  return 'Stats Comparison'
})

const hint = computed(() => {
  if (lang.value === 'zh') return '再选一只宝可梦加入对比'
  if (lang.value === 'ja') return 'もう1匹選んで比較しましょう'
  return 'Select one more Pokémon to compare'
})
</script>

<style scoped>
.compare-panel {
  background: var(--bg2);
  border: 1px solid var(--border-strong);
  border-radius: 16px;
  padding: 14px 16px;
  margin-top: 16px;
}

.compare-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.compare-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--txt);
}
.clear-btn {
  font-size: 12px;
  color: var(--txt2);
  cursor: pointer;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--bg3);
  transition: color 0.12s;
}
.clear-btn:hover { color: var(--txt); }

.compare-body {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.compare-body.two-cols {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: start;
}

/* 卡片 */
.cmp-card {
  background: linear-gradient(135deg, var(--cmp-color, #888)44, transparent);
  border: 1px solid var(--cmp-color, var(--border));
  border-radius: 12px;
  padding: 10px;
  position: relative;
  min-width: 0;
}
.remove-btn {
  position: absolute; top: 6px; right: 6px;
  width: 20px; height: 20px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  border: none; color: var(--txt2);
  font-size: 10px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.remove-btn:hover { background: rgba(255,255,255,0.3); color: var(--txt); }

.cmp-img {
  width: 64px; height: 64px;
  object-fit: contain;
  image-rendering: pixelated;
  display: block; margin: 0 auto 6px;
}
.cmp-name {
  text-align: center;
  font-size: 13px; font-weight: 600;
  color: var(--txt); margin-bottom: 5px;
}
.cmp-types {
  display: flex; gap: 4px; justify-content: center; margin-bottom: 8px;
}
.type-mini {
  font-size: 9px; color: #fff;
  padding: 1px 6px; border-radius: 8px; font-weight: 700;
}

.cmp-stats { display: flex; flex-direction: column; gap: 3px; }
.cmp-stat-row {
  display: flex; justify-content: space-between;
  font-size: 11px;
}
.cmp-stat-label { color: var(--txt2); }
.cmp-stat-val   { font-weight: 600; font-family: var(--font-mono); }

/* 对比柱 */
.compare-bars { align-self: center; padding: 0 8px; }
.bars-title {
  font-size: 11px; font-weight: 700;
  color: var(--txt2); text-align: center;
  text-transform: uppercase; letter-spacing: 0.08em;
  margin-bottom: 10px;
}
.bar-compare-row {
  margin-bottom: 7px;
}
.bar-label {
  font-size: 10px; color: var(--txt2);
  display: block; text-align: center; margin-bottom: 3px;
}
.bars-wrap {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 4px;
}
.bar-left-wrap, .bar-right-wrap {
  height: 7px;
  background: var(--bg3);
  border-radius: 4px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}
.bar-fill.left  { margin-left: auto; }
.bar-vs {
  font-size: 8px; color: var(--txt3);
  font-weight: 700; white-space: nowrap;
}

.compare-hint {
  text-align: center;
  font-size: 12px;
  color: var(--txt2);
  margin-top: 8px;
  padding: 8px;
  background: var(--bg3);
  border-radius: 8px;
}

/* 动画 */
.slide-enter-active, .slide-leave-active { transition: opacity 0.2s, transform 0.2s; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(10px); }
</style>
