<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="pokemon" class="modal-overlay" @click.self="closeModal()">
        <div class="modal-card">
          <!-- 关闭 -->
          <button class="modal-close" @click="closeModal()">✕</button>

          <!-- 头部：大图 + 名称 -->
          <div class="modal-hero" :style="{ background: heroBg }">
            <img class="modal-img" :src="spriteUrl" :alt="name" @error="onImgError" />
            <div class="modal-hero-info">
              <div class="modal-num">#{{ String(pokemon.id).padStart(3, '0') }}</div>
              <h2 class="modal-name">{{ name }}</h2>
              <div class="modal-types">
                <span
                  v-for="t in pokemon.types" :key="t"
                  class="type-pill"
                  :style="{ background: TYPE_COLORS[t] }"
                >{{ TYPE_LABELS[t][lang] }}</span>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="modal-actions">
            <button class="action-btn fav" :class="{ active: isFav }" @click="toggleFav(pokemon.id)">
              {{ isFav ? '♥ ' : '♡ ' }}{{ isFav ? favLabel.remove : favLabel.add }}
            </button>
            <button class="action-btn cmp" :class="{ active: inCompare }" @click="toggleCompare(pokemon)">
              ⚖ {{ inCompare ? cmpLabel.remove : cmpLabel.add }}
            </button>
          </div>

          <!-- 三语名称 -->
          <div class="modal-section">
            <div class="section-title">{{ ui.names }}</div>
            <div class="names-grid">
              <span class="name-lang">EN</span><span>{{ pokemon.nameEn }}</span>
              <span class="name-lang">中文</span><span>{{ pokemon.nameZh }}</span>
              <span class="name-lang">日本語</span><span>{{ pokemon.nameJa }}</span>
            </div>
          </div>

          <!-- 世代 -->
          <div class="modal-meta">
            <span>{{ ui.generation }}: <strong>{{ genRoman[pokemon.generation] }}</strong></span>
          </div>

          <!-- 基础数值 -->
          <div class="modal-section">
            <div class="section-title">{{ statsTitle }} <span class="total-badge">{{ ui.total }}: {{ totalStat }}</span></div>
            <div class="stats-list">
              <div v-for="(val, i) in stats" :key="i" class="stat-row">
                <span class="stat-label">{{ STAT_NAMES[lang][i] }}</span>
                <span class="stat-val">{{ val }}</span>
                <div class="stat-bar-bg">
                  <div
                    class="stat-bar-fill"
                    :style="{ width: statPercent(val) + '%', background: statColor(val) }"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 导航 -->
          <div class="modal-nav">
            <button class="nav-btn" @click="navTo(pokemon.id - 1)" :disabled="pokemon.id <= 1">‹ {{ prevLabel }}</button>
            <button class="nav-btn" @click="navTo(pokemon.id + 1)" :disabled="pokemon.id >= 1025">{{ nextLabel }} ›</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import {
  LANG_KEY, MODAL_KEY, CLOSE_MODAL_KEY, OPEN_MODAL_KEY,
  FAVORITES_KEY, TOGGLE_FAV_KEY,
  COMPARE_LIST_KEY, TOGGLE_COMPARE_KEY,
} from '../types'
import { TYPE_COLORS, TYPE_LABELS } from '../data/pokemonTypes'
import { POKEMON } from '../data/pokemon'
import { getStats, totalStats, statPercent, statColor, STAT_NAMES } from '../data/pokemonStats'
import { TRANSLATIONS } from '../i18n/translations'

const FALLBACK = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'%3E%3Ccircle cx='80' cy='80' r='72' fill='rgba(255,255,255,0.1)'/%3E%3Cline x1='8' y1='80' x2='152' y2='80' stroke='rgba(255,255,255,0.2)' stroke-width='4'/%3E%3Ccircle cx='80' cy='80' r='20' fill='rgba(255,255,255,0.2)'/%3E%3C/svg%3E`

const pokemon     = inject(MODAL_KEY)!
const closeModal  = inject(CLOSE_MODAL_KEY)!
const openModal   = inject(OPEN_MODAL_KEY)!
const lang        = inject(LANG_KEY)!
const favorites   = inject(FAVORITES_KEY)!
const toggleFav   = inject(TOGGLE_FAV_KEY)!
const compareList = inject(COMPARE_LIST_KEY)!
const toggleCompare = inject(TOGGLE_COMPARE_KEY)!

const ui = computed(() => TRANSLATIONS[lang.value])
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
  pokemon.value ? `linear-gradient(135deg, ${TYPE_COLORS[pokemon.value.types[0]]}cc, ${TYPE_COLORS[pokemon.value.types[pokemon.value.types.length - 1] as typeof pokemon.value.types[0]]}88)` : 'var(--bg3)'
)

const stats = computed(() => pokemon.value ? getStats(pokemon.value.id) : [0,0,0,0,0,0])
const totalStat = computed(() => totalStats(stats.value as [number,number,number,number,number,number]))

const isFav    = computed(() => !!pokemon.value && favorites.value.has(pokemon.value.id))
const inCompare = computed(() => !!pokemon.value && compareList.value.some(p => p.id === pokemon.value!.id))

const statsTitle = computed(() => {
  if (lang.value === 'zh') return '基础数值'
  if (lang.value === 'ja') return '基本ステータス'
  return 'Base Stats'
})

const favLabel = computed(() => ({
  add:    lang.value === 'zh' ? '收藏' : lang.value === 'ja' ? 'お気に入り' : 'Favorite',
  remove: lang.value === 'zh' ? '已收藏' : lang.value === 'ja' ? 'お気に入り済' : 'Favorited',
}))
const cmpLabel = computed(() => ({
  add:    lang.value === 'zh' ? '加入对比' : lang.value === 'ja' ? '比較に追加' : 'Compare',
  remove: lang.value === 'zh' ? '取消对比' : lang.value === 'ja' ? '比較解除' : 'In Compare',
}))

function onImgError(e: Event) {
  (e.target as HTMLImageElement).src = FALLBACK
}

const prevLabel = computed(() => {
  if (lang.value === 'zh') return '上一只'
  if (lang.value === 'ja') return '前へ'
  return 'Prev'
})
const nextLabel = computed(() => {
  if (lang.value === 'zh') return '下一只'
  if (lang.value === 'ja') return '次へ'
  return 'Next'
})

function navTo(id: number) {
  const p = POKEMON.find(x => x.id === id)
  if (p) openModal(p)
}
</script>

<style scoped>
/* Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

/* Card */
.modal-card {
  background: var(--bg2);
  border: 1px solid var(--border-strong);
  border-radius: 20px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 24px 64px rgba(0,0,0,0.4);
}

.modal-close {
  position: absolute;
  top: 12px; right: 12px;
  width: 28px; height: 28px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  color: #fff;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  z-index: 2;
  transition: background 0.15s;
}
.modal-close:hover { background: rgba(255,255,255,0.3); }

/* Hero */
.modal-hero {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 20px 20px;
  border-radius: 20px 20px 0 0;
}
.modal-img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  image-rendering: pixelated;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
  flex-shrink: 0;
}
.modal-hero-info { flex: 1; }
.modal-num {
  font-size: 12px;
  font-family: var(--font-mono);
  color: rgba(255,255,255,0.7);
  margin-bottom: 4px;
}
.modal-name {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 10px;
  text-shadow: 0 2px 6px rgba(0,0,0,0.3);
}
.modal-types { display: flex; gap: 8px; flex-wrap: wrap; }
.type-pill {
  font-size: 12px;
  color: #fff;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
}

/* Actions */
.modal-actions {
  display: flex;
  gap: 8px;
  padding: 12px 20px;
  border-bottom: 1px solid var(--border);
}
.action-btn {
  flex: 1;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: 1.5px solid var(--border-strong);
  background: var(--bg3);
  color: var(--txt);
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}
.action-btn.fav.active  { background: #fbbf2422; border-color: #fbbf24; color: #fbbf24; }
.action-btn.cmp.active  { background: #60a5fa22; border-color: #60a5fa; color: #60a5fa; }
.action-btn:hover:not(.active) { background: var(--accent-soft); border-color: var(--accent); }

/* Section */
.modal-section { padding: 14px 20px; border-bottom: 1px solid var(--border); }
.section-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--txt2);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.total-badge {
  font-size: 11px;
  background: var(--accent-soft);
  color: var(--accent);
  padding: 1px 7px;
  border-radius: 10px;
  text-transform: none;
  letter-spacing: 0;
}

/* 名称 */
.names-grid {
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 5px 0;
  font-size: 14px;
}
.name-lang { color: var(--txt2); font-size: 11px; font-weight: 600; align-self: center; }

/* 世代 */
.modal-meta {
  padding: 10px 20px;
  font-size: 13px;
  color: var(--txt2);
  border-bottom: 1px solid var(--border);
}
.modal-meta strong { color: var(--txt); }

/* 数值 */
.stats-list { display: flex; flex-direction: column; gap: 7px; }
.stat-row { display: grid; grid-template-columns: 54px 32px 1fr; align-items: center; gap: 8px; }
.stat-label { font-size: 12px; color: var(--txt2); }
.stat-val   { font-size: 13px; font-weight: 600; color: var(--txt); font-family: var(--font-mono); text-align: right; }
.stat-bar-bg {
  height: 8px;
  background: var(--bg3);
  border-radius: 4px;
  overflow: hidden;
}
.stat-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s cubic-bezier(.4,0,.2,1);
}

/* 导航 */
.modal-nav {
  display: flex;
  justify-content: space-between;
  padding: 12px 20px;
}
.nav-btn {
  padding: 7px 16px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  background: var(--bg3);
  border: 1px solid var(--border-strong);
  color: var(--txt);
  transition: background 0.12s;
}
.nav-btn:hover:not(:disabled) { background: var(--accent-soft); color: var(--accent); }
.nav-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* 动画 */
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s, transform 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-card, .modal-leave-to .modal-card { transform: scale(0.96) translateY(10px); }

/* ── Mobile：底部抽屉 ──────────────────────────────────────────────────── */
@media (max-width: 600px) {
  .modal-overlay {
    padding: 0;
    align-items: flex-end;
  }
  .modal-card {
    border-radius: 20px 20px 0 0;
    max-height: 92vh;
    max-width: 100%;
  }
  .modal-hero { padding: 20px 16px 14px; gap: 12px; }
  .modal-img  { width: 90px; height: 90px; }
  .modal-name { font-size: 20px; }
  .modal-actions { padding: 10px 16px; gap: 6px; }
  .modal-section { padding: 12px 16px; }
  .modal-meta    { padding: 8px 16px; }
  .modal-nav     { padding: 10px 16px; }
  .nav-btn       { padding: 8px 14px; font-size: 13px; }

  /* 动画改为从底部滑入 */
  .modal-enter-from .modal-card,
  .modal-leave-to   .modal-card { transform: translateY(100%); }
}
</style>
