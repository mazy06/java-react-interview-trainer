export type ArchitectureCategory = 'monolithic' | 'distributed' | 'domain-centric' | 'event-driven'

export interface ArchitectureStyle {
  id: string
  category: ArchitectureCategory
  title: string
  definition: string
  whenToUse: string
  tradeoff: string
  lang: 'java'
  code: string
}

export interface ArchitectureCategoryMeta {
  key: ArchitectureCategory
  label: string
}
