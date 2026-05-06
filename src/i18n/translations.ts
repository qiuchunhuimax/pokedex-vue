import type { Language } from '../types'

export interface UiStrings {
  title: string
  subtitle: string
  searchPlaceholder: string
  all: string
  types: string
  clickPrompt: string
  number: string
  primaryType: string
  secondaryType: string
  generation: string
  names: string
  themeLight: string
  themeDark: string
  fontSize: string
  gen: string
  favorites: string
  total: string
  compare: string
  compareHint: string
}

export const TRANSLATIONS: Record<Language, UiStrings> = {
  en: {
    title:             'Pokémon Pokédex',
    subtitle:          '1025 Pokémon · Generations I–IX · Click any card for details',
    searchPlaceholder: 'Search by name or number…',
    all:               'All',
    types:             'Types',
    clickPrompt:       'Click any Pokémon to view details',
    number:            'No.',
    primaryType:       'Type 1',
    secondaryType:     'Type 2',
    generation:        'Generation',
    names:             'Names',
    themeLight:        'Light',
    themeDark:         'Dark',
    fontSize:          'Font Size',
    gen:               'Gen',
    favorites:         'Favorites',
    total:             'Total',
    compare:           'Compare',
    compareHint:       'Click ⚖ on cards, then open here',
  },
  zh: {
    title:             '宝可梦图鉴',
    subtitle:          '1025只宝可梦 · 第一至九世代 · 点击任意卡片查看详情',
    searchPlaceholder: '按名称或编号搜索…',
    all:               '全部',
    types:             '属性',
    clickPrompt:       '点击任意宝可梦查看详情',
    number:            '编号',
    primaryType:       '主属性',
    secondaryType:     '副属性',
    generation:        '世代',
    names:             '名称',
    themeLight:        '亮色',
    themeDark:         '暗色',
    fontSize:          '字体大小',
    gen:               '世代',
    favorites:         '收藏夹',
    total:             '种族值',
    compare:           '对比',
    compareHint:       '点击卡片 ⚖ 选择，再点这里查看对比',
  },
  ja: {
    title:             'ポケモン図鑑',
    subtitle:          '1025匹のポケモン · 第一〜九世代 · カードをクリックして詳細を表示',
    searchPlaceholder: '名前または番号で検索…',
    all:               'すべて',
    types:             'タイプ',
    clickPrompt:       'ポケモンをクリックして詳細を表示',
    number:            'No.',
    primaryType:       'タイプ1',
    secondaryType:     'タイプ2',
    generation:        '世代',
    names:             '名前',
    themeLight:        'ライト',
    themeDark:         'ダーク',
    fontSize:          '文字サイズ',
    gen:               '世代',
    favorites:         'お気に入り',
    total:             '種族値',
    compare:           '比較',
    compareHint:       'カードの ⚖ を選んでここをクリック',
  },
}
