import type { RankedSpeciesResult } from '@/types/retrieval'

function csvCell(value: string | number): string {
  const text = String(value)
  if (!/[",\n]/.test(text)) return text
  return `"${text.replaceAll('"', '""')}"`
}

export function rankingsToCsv(rankings: RankedSpeciesResult[]): string {
  const rows = rankings.map((result) => [
    result.rank,
    result.species,
    result.score.toFixed(4),
  ])
  return [['rank', 'species', 'score'], ...rows]
    .map((row) => row.map(csvCell).join(','))
    .join('\n')
}

export function exportRankingsCsv(rankings: RankedSpeciesResult[]): void {
  const blob = new Blob([rankingsToCsv(rankings)], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'retrieval-results.csv'
  link.click()
  URL.revokeObjectURL(url)
}
