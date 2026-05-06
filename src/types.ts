import type { InjectionKey, Ref, ComputedRef } from 'vue'

export type Language = 'en' | 'zh' | 'ja'
export type ThemeMode = 'light' | 'dark'
export type PokemonType =
  | 'Normal' | 'Fire' | 'Water' | 'Grass' | 'Electric' | 'Ice'
  | 'Fighting' | 'Poison' | 'Ground' | 'Flying' | 'Psychic' | 'Bug'
  | 'Rock' | 'Ghost' | 'Dragon' | 'Dark' | 'Steel' | 'Fairy'

export interface Pokemon {
  id: number
  nameEn: string
  nameZh: string
  nameJa: string
  types: [PokemonType] | [PokemonType, PokemonType]
  row: number
  col: number
  generation: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
}

// ── Injection Keys ────────────────────────────────────────────────────────
export const LANG_KEY:           InjectionKey<Ref<Language>>                      = Symbol('lang')
export const THEME_KEY:          InjectionKey<Ref<ThemeMode>>                     = Symbol('theme')
export const FONTSIZE_KEY:       InjectionKey<Ref<number>>                        = Symbol('fontSize')
export const SEARCH_KEY:         InjectionKey<Ref<string>>                        = Symbol('search')
export const ACTIVE_TYPE_KEY:    InjectionKey<Ref<PokemonType | null>>            = Symbol('activeType')
export const SELECTED_KEY:       InjectionKey<Ref<Pokemon | null>>                = Symbol('selected')
export const VISIBLE_IDS_KEY:    InjectionKey<ComputedRef<Set<number>>>           = Symbol('visibleIds')
export const TOGGLE_THEME_KEY:   InjectionKey<() => void>                        = Symbol('toggleTheme')
export const CYCLE_LANG_KEY:     InjectionKey<() => void>                        = Symbol('cycleLang')
export const SET_ACTIVE_TYPE_KEY:InjectionKey<(t: PokemonType | null) => void>   = Symbol('setActiveType')
export const SET_SELECTED_KEY:   InjectionKey<(p: Pokemon | null) => void>       = Symbol('setSelected')
export const SET_SEARCH_KEY:     InjectionKey<(s: string) => void>               = Symbol('setSearch')
export const SET_FONTSIZE_KEY:   InjectionKey<(n: number) => void>               = Symbol('setFontSize')

// ── Favorites ─────────────────────────────────────────────────────────────
export const FAVORITES_KEY:      InjectionKey<Ref<Set<number>>>                   = Symbol('favorites')
export const TOGGLE_FAV_KEY:     InjectionKey<(id: number) => void>              = Symbol('toggleFav')
export const SHOW_FAVS_KEY:      InjectionKey<Ref<boolean>>                      = Symbol('showFavs')
export const SET_SHOW_FAVS_KEY:  InjectionKey<(v: boolean) => void>              = Symbol('setShowFavs')

// ── Compare ───────────────────────────────────────────────────────────────
export const COMPARE_LIST_KEY:    InjectionKey<Ref<Pokemon[]>>                   = Symbol('compareList')
export const TOGGLE_COMPARE_KEY:  InjectionKey<(p: Pokemon) => void>             = Symbol('toggleCompare')
export const CLEAR_COMPARE_KEY:   InjectionKey<() => void>                       = Symbol('clearCompare')
export const SHOW_COMPARE_KEY:    InjectionKey<Ref<boolean>>                     = Symbol('showCompare')
export const SET_SHOW_COMPARE_KEY:InjectionKey<(v: boolean) => void>             = Symbol('setShowCompare')

// ── Pagination ────────────────────────────────────────────────────────────
export const PAGE_KEY:          InjectionKey<Ref<number>>                        = Symbol('page')
export const TOTAL_PAGES_KEY:   InjectionKey<ComputedRef<number>>                = Symbol('totalPages')
export const TOTAL_COUNT_KEY:   InjectionKey<ComputedRef<number>>                = Symbol('totalCount')
export const PAGED_POKEMON_KEY: InjectionKey<ComputedRef<Pokemon[]>>             = Symbol('pagedPokemon')
export const SET_PAGE_KEY:      InjectionKey<(n: number) => void>                = Symbol('setPage')

// ── Modal ─────────────────────────────────────────────────────────────────
export const MODAL_KEY:          InjectionKey<Ref<Pokemon | null>>               = Symbol('modal')
export const OPEN_MODAL_KEY:     InjectionKey<(p: Pokemon) => void>             = Symbol('openModal')
export const CLOSE_MODAL_KEY:    InjectionKey<() => void>                       = Symbol('closeModal')
