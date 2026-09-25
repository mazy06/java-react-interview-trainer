export type PatternCategory = 'creational' | 'structural' | 'behavioral' | 'architecture'

export interface DesignPattern {
  id: string
  category: PatternCategory
  title: string
  definition: string
  whenToUse: string
  lang: 'java'
  code: string
  pitfall: string
}

export interface PatternCategoryMeta {
  key: PatternCategory
  label: string
}
