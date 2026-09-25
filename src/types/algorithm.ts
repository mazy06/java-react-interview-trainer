export type AlgoCategory =
  | 'arrays'
  | 'sorting'
  | 'linkedlist'
  | 'trees'
  | 'dp'
  | 'advanced'
  | 'perf'

export interface AlgoApproach {
  label: string
  time: string
  space: string
  tier: 1 | 2 | 3 | 4
  caution?: boolean
}

export interface AlgoKata {
  id: string
  category: AlgoCategory
  title: string
  problem: string
  approaches: AlgoApproach[]
  lang: 'java' | 'javascript'
  code: string
  verdict: string
}

export interface AlgoCategoryMeta {
  key: AlgoCategory
  label: string
}
