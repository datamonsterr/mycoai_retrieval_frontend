import { confidenceClass, confidenceTextClass } from '@/lib/confidence'
import { cn } from '@/lib/utils'

const BAR_CLASS = 'inline-block h-2 min-w-[4px] rounded-full transition-all duration-300'

export function ConfidenceBar({ score }: { score: number }) {
  const pct = Math.round(score * 100)
  return (
    <div className="flex w-40 items-center gap-2">
      <span className={cn('text-sm tabular-nums', confidenceTextClass(score))}>
        {score.toFixed(2)}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          data-testid="confidence-fill"
          className={cn(BAR_CLASS, confidenceClass(score))}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
