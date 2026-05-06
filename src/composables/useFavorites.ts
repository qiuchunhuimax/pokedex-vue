import { ref } from 'vue'

const STORAGE_KEY = 'pokedex-favorites'

export function useFavorites() {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as number[]
  const favorites = ref<Set<number>>(new Set(stored))

  function toggleFav(id: number) {
    const next = new Set(favorites.value)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    favorites.value = next
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
  }

  return { favorites, toggleFav }
}
