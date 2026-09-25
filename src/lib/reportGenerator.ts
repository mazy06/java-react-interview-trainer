import html2canvas from 'html2canvas'
import { dateFilenameStamp } from './dateUtils'

export function reportFilename(date: Date = new Date()): string {
  return `rapport-java-react-${dateFilenameStamp(date)}.png`
}

export async function renderNodeToPngBlob(node: HTMLElement): Promise<Blob> {
  const canvas = await html2canvas(node, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
  })
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('La génération du PNG a échoué.'))
    }, 'image/png')
  })
}

export async function downloadNodeAsPng(node: HTMLElement, filename: string): Promise<void> {
  const blob = await renderNodeToPngBlob(node)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export type NextReviewRecommendation = 'demain' | '3-jours' | '7-jours'

export function computeNextReviewRecommendation(
  successRatePercent: number,
): NextReviewRecommendation {
  if (successRatePercent < 50) return 'demain'
  if (successRatePercent < 80) return '3-jours'
  return '7-jours'
}

export const NEXT_REVIEW_LABELS: Record<NextReviewRecommendation, string> = {
  demain: 'Revoir demain',
  '3-jours': 'Revoir dans 3 jours',
  '7-jours': 'Revoir dans 7 jours',
}
