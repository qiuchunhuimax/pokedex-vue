<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="showCompare" class="cmp-overlay" @click.self="closePanel()">
        <div class="cmp-modal">

          <!-- 标题栏 -->
          <div class="cmp-header">
            <span class="cmp-title">{{ title }}</span>
            <button class="cmp-close" @click="closePanel()">✕</button>
          </div>

          <!-- 卡片区域：始终两列，空位用占位卡 -->
          <div class="cmp-cards">
            <template v-for="slot in 2" :key="slot">
              <div v-if="compareList[slot - 1]" class="cmp-card" :style="{ '--cc': TYPE_COLORS[compareList[slot - 1].types[0]] }">
                <button class="remove-btn" @click="toggleCompare(compareList[slot - 1])">✕</button>
                <img
                  class="cmp-img"
                  :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${compareList[slot - 1].id}.png`"
                  :alt="getName(compareList[slot - 1])"
                />
                <div class="cmp-num">#{{ String(compareList[slot - 1].id).padStart(3, '0') }}</div>
                <div class="cmp-name">{{ getName(compareList[slot - 1]) }}</div>
                <div class="cmp-types">
                  <span
                    v-for="t in compareList[slot - 1].types"
                    :key="t"
                    class="type-pill"
                    :style="{ background: TYPE_COLORS[t] }"
                  >{{ TYPE_LABELS[t][lang] }}</span>
                </div>
                <div class="cmp-stats">
                  <div v-for="(val, i) in getStats(compareList[slot - 1].id)" :key="i" class="stat-row">
                    <span class="stat-label">{{ STAT_NAMES[lang][i] }}</span>
                    <span class="stat-val" :style="{ color: statColor(val) }">{{ val }}</span>
                    <div class="stat-bar-bg">
                      <div class="stat-bar-fill" :style="{ width: statPercent(val) + '%', background: statColor(val) }" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- 空槽位 -->
              <div v-else class="cmp-slot-empty">
                <div class="slot-icon">＋</div>
                <div class="slot-hint">{{ slotHint }}</div>
              </div>
            </template>
          </div>

          <!-- 双宝可梦时：数值对比条 -->
          <div v-if="compareList.length === 2" class="cmp-bars-section">
            <div class="bars-title">{{ barsTitle }}</div>
            <div v-for="(_, i) in 6" :key="i" class="bar-row">
              <span class="bar-label">{{ STAT_NAMES[lang][i] }}</span>
              <div class="bars-track">
                <!-- 左 -->
                <div class="bar-left-wrap">
                  <div
                    class="bar-fill"
                    :style="{
                      width: statPercent(getStats(compareList[0].id)[i]) + '%',
                      background: TYPE_COLORS[compareList[0].types[0]],
                      opacity: getStats(compareList[0].id)[i] >= getStats(compareList[1].id)[i] ? 1 : 0.45,
                    }"
                  />
                </div>
                <div class="bar-vals">
                  <span :style="{ color: statColor(getStats(compareList[0].id)[i]) }">{{ getStats(compareList[0].id)[i] }}</span>
                  <span class="bar-vs">VS</span>
                  <span :style="{ color: statColor(getStats(compareList[1].id)[i]) }">{{ getStats(compareList[1].id)[i] }}</span>
                </div>
                <!-- 右 -->
                <div class="bar-right-wrap">
                  <div
                    class="bar-fill"
                    :style="{
                      width: statPercent(getStats(compareList[1].id)[i]) + '%',
                      background: TYPE_COLORS[compareList[1].types[0]],
                      opacity: getStats(compareList[1].id)[i] >= getStats(compareList[0].id)[i] ? 1 : 0.45,
                    }"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import {
  LANG_KEY, COMPARE_LIST_KEY, TOGGLE_COMPARE_KEY,
  SHOW_COMPARE_KEY, SET_SHOW_COMPARE_KEY,
} from '../types'
import type { Pokemon } from '../types'
import { TYPE_COLORS, TYPE_LABELS } from '../data/pokemonTypes'
import { getStats, statPercent, statColor, STAT_NAMES } from '../data/pokemonStats'

const lang           = inject(LANG_KEY)!
const compareList    = inject(COMPARE_LIST_KEY)!
const toggleCompare  = inject(TOGGLE_COMPARE_KEY)!
const showCompare    = inject(SHOW_COMPARE_KEY)!
const setShowCompare = inject(SET_SHOW_COMPARE_KEY)!

function closePanel() {
  setShowCompare(false)
}

function getName(p: Pokemon) {
  if (lang.value === 'zh') return p.nameZh
  if (lang.value === 'ja') return p.nameJa
  return p.nameEn
}

const title = computed(() => {
  if (lang.value === 'zh') return '宝可梦对比'
  if (lang.value === 'ja') return 'ポケモン比較'
  return 'Compare Pokémon'
})

const barsTitle = computed(() => {
  if (lang.value === 'zh') return '数值对比'
  if (lang.value === 'ja') return 'ステータス比較'
  return 'Stats Comparison'
})

const slotHint = computed(() => {
  if (lang.value === 'zh') return '点击卡片上的 ⚖ 添加'
  if (lang.value === 'ja') return '⚖ をクリックして追加'
  return 'Click ⚖ on a card to add'
})
</script>

<style scoped>
/* Overlay */
.cmp-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 90;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* Modal box */
.cmp-modal {
  background: var(--bg2);
  border: 1px solid var(--border-strong);
  border-radius: 20px;
  width: 100%;
  max-width: 760px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 24px 64px rgba(0,0,0,0.45);
}

/* Header */
.cmp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px 14px;
  border-bottom: 1px solid var(--border);
}
.cmp-title {
  font-size: var(--fs-detail-label);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--txt2);
}
.cmp-close {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: var(--bg3);
  border: 1px solid var(--border-strong);
  color: var(--txt2);
  font-size: 13px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
}
.cmp-close:hover { background: var(--accent-soft); color: var(--accent); }

/* Two-column card grid — ALWAYS equal 50/50 */
.cmp-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 18px 22px;
}

/* Filled card */
.cmp-card {
  background: linear-gradient(135deg, color-mix(in srgb, var(--cc) 30%, transparent), transparent);
  border: 1.5px solid color-mix(in srgb, var(--cc) 60%, transparent);
  border-radius: 14px;
  padding: 16px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.remove-btn {
  position: absolute; top: 8px; right: 8px;
  width: 24px; height: 24px;
  border-radius: 50%;
  background: rgba(255,255,255,0.12);
  border: none; color: var(--txt2);
  font-size: 11px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.12s, color 0.12s;
}
.remove-btn:hover { background: rgba(255,255,255,0.25); color: var(--txt); }

.cmp-img {
  width: 96px; height: 96px;
  object-fit: contain;
  image-rendering: pixelated;
  filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3));
}
.cmp-num {
  font-size: var(--fs-detail-label);
  font-family: var(--font-mono);
  color: var(--txt2);
}
.cmp-name {
  font-size: var(--fs-detail-body);
  font-weight: 700;
  color: var(--txt);
  text-align: center;
}
.cmp-types {
  display: flex; gap: 6px; flex-wrap: wrap; justify-content: center;
}
.type-pill {
  font-size: var(--fs-type-badge);
  color: #fff;
  padding: 3px 10px;
  border-radius: 12px;
  font-weight: 700;
}

/* Stat rows inside each card */
.cmp-stats {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 4px;
}
.stat-row {
  display: grid;
  grid-template-columns: 44px 32px 1fr;
  align-items: center;
  gap: 6px;
}
.stat-label { font-size: var(--fs-detail-label); color: var(--txt2); }
.stat-val   { font-size: var(--fs-detail-label); font-weight: 700; font-family: var(--font-mono); text-align: right; }
.stat-bar-bg {
  height: 7px;
  background: var(--bg3);
  border-radius: 4px;
  overflow: hidden;
}
.stat-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

/* Empty slot */
.cmp-slot-empty {
  border: 2px dashed var(--border-strong);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 220px;
  color: var(--txt2);
}
.slot-icon { font-size: 32px; opacity: 0.4; }
.slot-hint { font-size: var(--fs-detail-label); text-align: center; padding: 0 12px; }

/* Comparison bars section */
.cmp-bars-section {
  padding: 6px 22px 22px;
  border-top: 1px solid var(--border);
}
.bars-title {
  font-size: var(--fs-detail-label);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--txt2);
  text-align: center;
  padding: 14px 0 12px;
}
.bar-row { margin-bottom: 10px; }
.bar-label {
  font-size: var(--fs-detail-label);
  color: var(--txt2);
  display: block;
  text-align: center;
  margin-bottom: 4px;
}
.bars-track {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 8px;
}
.bar-left-wrap, .bar-right-wrap {
  height: 10px;
  background: var(--bg3);
  border-radius: 5px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.5s ease;
}
.bar-left-wrap .bar-fill { margin-left: auto; }
.bar-vals {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  font-size: var(--fs-detail-label);
  font-weight: 700;
  font-family: var(--font-mono);
  min-width: 52px;
  text-align: center;
}
.bar-vs {
  font-size: 10px;
  color: var(--txt3);
  font-weight: 700;
}

/* Animations */
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s, transform 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .cmp-modal, .modal-leave-to .cmp-modal { transform: scale(0.95) translateY(12px); }

/* ── Mobile ─────────────────────────────────────────────────────────────── */
@media (max-width: 600px) {
  .cmp-overlay { padding: 0; align-items: flex-end; }
  .cmp-modal {
    border-radius: 20px 20px 0 0;
    max-height: 92vh;
    /* 底部弹出式抽屉 */
  }
  .cmp-header { padding: 14px 16px 12px; }

  /* 两列改单列 */
  .cmp-cards {
    grid-template-columns: 1fr;
    padding: 12px 16px;
    gap: 12px;
  }
  .cmp-slot-empty { min-height: 100px; }
  .cmp-img { width: 72px; height: 72px; }

  /* 数值对比区 */
  .cmp-bars-section { padding: 6px 16px 16px; }
  .bars-track { gap: 6px; }
  .bar-vals { min-width: 44px; font-size: 12px; }
}
</style>
