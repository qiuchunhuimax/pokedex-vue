<template>
  <div v-if="totalPages > 1" class="pagination">
    <!-- 总数 -->
    <span class="pg-total">{{ totalLabel }}</span>

    <div class="pg-controls">
      <!-- 第一页 -->
      <button class="pg-btn" @click="setPage(1)" :disabled="page === 1" :title="firstLabel">«</button>

      <!-- 上一页 -->
      <button class="pg-btn" @click="setPage(page - 1)" :disabled="page === 1">‹ {{ prevLabel }}</button>

      <!-- 页码区 -->
      <div class="pg-nums">
        <button
          v-for="n in pageNums"
          :key="n"
          class="pg-num"
          :class="{ active: n === page, ellipsis: n === -1 }"
          :disabled="n === -1 || n === page"
          @click="n !== -1 && setPage(n)"
        >{{ n === -1 ? '…' : n }}</button>
      </div>

      <!-- 下一页 -->
      <button class="pg-btn" @click="setPage(page + 1)" :disabled="page === totalPages">{{ nextLabel }} ›</button>

      <!-- 最后一页 -->
      <button class="pg-btn" @click="setPage(totalPages)" :disabled="page === totalPages" :title="lastLabel">»</button>
    </div>
  </div>

  <!-- 只有一页时也显示总数 -->
  <div v-else class="pagination single">
    <span class="pg-total">{{ totalLabel }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { LANG_KEY, PAGE_KEY, TOTAL_PAGES_KEY, TOTAL_COUNT_KEY, SET_PAGE_KEY } from '../types'

const lang       = inject(LANG_KEY)!
const page       = inject(PAGE_KEY)!
const totalPages = inject(TOTAL_PAGES_KEY)!
const totalCount = inject(TOTAL_COUNT_KEY)!
const setPage    = inject(SET_PAGE_KEY)!

const prevLabel  = computed(() => lang.value === 'zh' ? '上一页' : lang.value === 'ja' ? '前へ' : 'Prev')
const nextLabel  = computed(() => lang.value === 'zh' ? '下一页' : lang.value === 'ja' ? '次へ' : 'Next')
const firstLabel = computed(() => lang.value === 'zh' ? '第一页' : lang.value === 'ja' ? '最初' : 'First')
const lastLabel  = computed(() => lang.value === 'zh' ? '最后一页' : lang.value === 'ja' ? '最後' : 'Last')

const totalLabel = computed(() => {
  const total = totalCount.value
  const p = page.value
  const tp = totalPages.value
  if (lang.value === 'zh') return `共 ${total} 只  ·  第 ${p} / ${tp} 页`
  if (lang.value === 'ja') return `全 ${total} 匹  ·  ${p} / ${tp} ページ`
  return `${total} Pokémon  ·  Page ${p} of ${tp}`
})

// build page number list with ellipsis, e.g. 1 … 4 5 6 … 22
const pageNums = computed(() => {
  const cur = page.value
  const max = totalPages.value
  if (max <= 7) return Array.from({ length: max }, (_, i) => i + 1)

  const nums: number[] = []
  const addRange = (from: number, to: number) => {
    for (let i = from; i <= to; i++) nums.push(i)
  }

  nums.push(1)
  if (cur > 3) nums.push(-1)          // left ellipsis
  addRange(Math.max(2, cur - 1), Math.min(max - 1, cur + 1))
  if (cur < max - 2) nums.push(-1)    // right ellipsis
  nums.push(max)

  // deduplicate
  return nums.filter((v, i, a) => a.indexOf(v) === i)
})
</script>

<style scoped>
.pagination {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 24px 0 8px;
}
.pagination.single { padding: 16px 0 4px; }

.pg-total {
  font-size: var(--fs-control);
  color: var(--txt2);
}

.pg-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
}

.pg-btn {
  padding: 8px 16px;
  font-size: var(--fs-control);
  font-weight: 600;
  background: var(--bg3);
  border: 1.5px solid var(--border-strong);
  border-radius: 10px;
  color: var(--txt);
  cursor: pointer;
  transition: background 0.12s, border-color 0.12s, color 0.12s;
  white-space: nowrap;
}
.pg-btn:hover:not(:disabled) {
  background: var(--accent-soft);
  border-color: var(--accent);
  color: var(--accent);
}
.pg-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.pg-nums {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: center;
}

.pg-num {
  min-width: 40px;
  height: 40px;
  font-size: var(--fs-control);
  font-weight: 600;
  background: var(--bg3);
  border: 1.5px solid var(--border-strong);
  border-radius: 8px;
  color: var(--txt2);
  cursor: pointer;
  transition: background 0.12s, border-color 0.12s, color 0.12s;
}
.pg-num:hover:not(:disabled):not(.ellipsis) {
  background: var(--accent-soft);
  border-color: var(--accent);
  color: var(--accent);
}
.pg-num.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  cursor: default;
}
.pg-num.ellipsis {
  cursor: default;
  border-color: transparent;
  background: none;
  color: var(--txt3);
}
</style>
