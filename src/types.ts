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
  generation: 1 | 2 | 3
}

export const LANG_KEY: InjectionKey<Ref<Language>> = Symbol('lang')
export const THEME_KEY: InjectionKey<Ref<ThemeMode>> = Symbol('theme')
export const FONTSIZE_KEY: InjectionKey<Ref<number>> = Symbol('fontSize')
export const SEARCH_KEY: InjectionKey<Ref<string>> = Symbol('search')
export const ACTIVE_TYPE_KEY: InjectionKey<Ref<PokemonType | null>> = Symbol('activeType')
export const SELECTED_KEY: InjectionKey<Ref<Pokemon | null>> = Symbol('selected')
export const VISIBLE_IDS_KEY: InjectionKey<ComputedRef<Set<number>>> = Symbol('visibleIds')
export const TOGGLE_THEME_KEY: InjectionKey<() => void> = Symbol('toggleTheme')
export const CYCLE_LANG_KEY: InjectionKey<() => void> = Symbol('cycleLang')
export const SET_ACTIVE_TYPE_KEY: InjectionKey<(t: PokemonType | null) => void> = Symbol('setActiveType')
export const SET_SELECTED_KEY: InjectionKey<(p: Pokemon | null) => void> = Symbol('setSelected')
export const SET_SEARCH_KEY: InjectionKey<(s: string) => void> = Symbol('setSearch')
export const SET_FONTSIZE_KEY: InjectionKey<(n: number) => void> = Symbol('setFontSize')
