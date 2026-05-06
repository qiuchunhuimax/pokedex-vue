import type { PokemonType } from '../types'

export const TYPE_COLORS: Record<PokemonType, string> = {
  Normal:   '#A8A878',
  Fire:     '#F08030',
  Water:    '#6890F0',
  Grass:    '#78C850',
  Electric: '#F8D030',
  Ice:      '#98D8D8',
  Fighting: '#C03028',
  Poison:   '#A040A0',
  Ground:   '#E0C068',
  Flying:   '#A890F0',
  Psychic:  '#F85888',
  Bug:      '#A8B820',
  Rock:     '#B8A038',
  Ghost:    '#705898',
  Dragon:   '#7038F8',
  Dark:     '#705848',
  Steel:    '#B8B8D0',
  Fairy:    '#EE99AC',
}

export const TYPE_LABELS: Record<PokemonType, { en: string; zh: string; ja: string }> = {
  Normal:   { en: 'Normal',   zh: '一般',   ja: 'ノーマル'   },
  Fire:     { en: 'Fire',     zh: '火',     ja: 'ほのお'     },
  Water:    { en: 'Water',    zh: '水',     ja: 'みず'       },
  Grass:    { en: 'Grass',    zh: '草',     ja: 'くさ'       },
  Electric: { en: 'Electric', zh: '电',     ja: 'でんき'     },
  Ice:      { en: 'Ice',      zh: '冰',     ja: 'こおり'     },
  Fighting: { en: 'Fighting', zh: '格斗',   ja: 'かくとう'   },
  Poison:   { en: 'Poison',   zh: '毒',     ja: 'どく'       },
  Ground:   { en: 'Ground',   zh: '地面',   ja: 'じめん'     },
  Flying:   { en: 'Flying',   zh: '飞行',   ja: 'ひこう'     },
  Psychic:  { en: 'Psychic',  zh: '超能',   ja: 'エスパー'   },
  Bug:      { en: 'Bug',      zh: '虫',     ja: 'むし'       },
  Rock:     { en: 'Rock',     zh: '岩石',   ja: 'いわ'       },
  Ghost:    { en: 'Ghost',    zh: '幽灵',   ja: 'ゴースト'   },
  Dragon:   { en: 'Dragon',   zh: '龙',     ja: 'ドラゴン'   },
  Dark:     { en: 'Dark',     zh: '恶',     ja: 'あく'       },
  Steel:    { en: 'Steel',    zh: '钢',     ja: 'はがね'     },
  Fairy:    { en: 'Fairy',    zh: '妖精',   ja: 'フェアリー' },
}

export const TYPE_KEYS = Object.keys(TYPE_COLORS) as PokemonType[]
