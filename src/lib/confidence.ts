export function confidenceClass(score: number): string {
  if (score >= 0.8) return 'bg-emerald-500/80'
  if (score >= 0.6) return 'bg-amber-500/70'
  if (score >= 0.4) return 'bg-orange-500/60'
  return 'bg-red-500/50'
}

export function confidenceTextClass(score: number): string {
  if (score >= 0.8) return 'text-emerald-400'
  if (score >= 0.6) return 'text-amber-400'
  if (score >= 0.4) return 'text-orange-300'
  return 'text-red-300'
}
