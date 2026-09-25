export type Theme =
  | 'Java'
  | 'Spring'
  | 'JPA/Hibernate'
  | 'SQL'
  | 'JavaScript'
  | 'TypeScript'
  | 'React'
  | 'Tests'
  | 'Maven'
  | 'Git/GitLab'
  | 'Docker'
  | 'Architecture'
  | 'Sécurité'
  | 'Angular/RxJS'
  | 'RAG'
  | 'Entretien comportemental'

export type Difficulty = 'junior' | 'intermediate' | 'confirmed' | 'advanced'

export type QuestionType = 'mcq' | 'open' | 'code'

export type ProofType =
  | 'definition'
  | 'example'
  | 'counterexample'
  | 'code'
  | 'diagnosis'
  | 'tradeoff'
  | 'security'
  | 'testing'

export type QuestionSource = 'pdf' | 'added'

export interface QuestionOption {
  id: string
  text: string
}

export interface BaseQuestion {
  id: string
  source: QuestionSource
  sourcePage: number | null
  chapter: string
  theme: Theme
  subtheme: string
  difficulty: Difficulty
  question: string
  code?: string | null
  commonTrap: string
  keyConcept: string
  tags: string[]
  relatedQuestionIds: string[]
  reviewIntervals: number[]
  isOriginalPdfContent: boolean
  sourceTextSummary?: string
  versionWarning?: string
  proofType: ProofType
}

export interface McqQuestion extends BaseQuestion {
  type: 'mcq'
  options: QuestionOption[]
  correctOptionIds: string[]
  explanation: string
}

export interface OpenQuestion extends BaseQuestion {
  type: 'open'
  expectedPoints: string[]
  modelAnswer: string
}

export interface CodeQuestion extends BaseQuestion {
  type: 'code'
  code: string
  expectedAnswer: string
  acceptedConcepts: string[]
  explanation: string
}

export type Question = McqQuestion | OpenQuestion | CodeQuestion

export function isMcq(q: Question): q is McqQuestion {
  return q.type === 'mcq'
}

export function isOpen(q: Question): q is OpenQuestion {
  return q.type === 'open'
}

export function isCode(q: Question): q is CodeQuestion {
  return q.type === 'code'
}
