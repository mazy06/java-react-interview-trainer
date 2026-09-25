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
  code: string
  explanation: string
}

export interface AlgoKata {
  id: string
  category: AlgoCategory
  title: string
  problem: string
  lang: 'java' | 'javascript'
  approaches: AlgoApproach[]
  verdict: string
}

export interface AlgoCategoryMeta {
  key: AlgoCategory
  label: string
}
