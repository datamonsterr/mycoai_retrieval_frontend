import { useCallback, useEffect, useState } from 'react'

import type { FeedbackItem, FeedbackStatus, Page } from '@/types/feedback'
import { listFeedback } from '@/api/feedback'
import { Button } from '@/components/ui/button'

const STATUS_COLORS: Record<FeedbackStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

type Props = { setPage: (p: Page) => void }

export default function MyFeedback({ setPage }: Props) {
  const [items, setItems] = useState<FeedbackItem[]>([])
  const [submitterId, setSubmitterId] = useState('user-1')
  const [loading, setLoading] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    listFeedback({ submitter_id: submitterId })
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [submitterId])

  useEffect(() => {
    queueMicrotask(load)
  }, [load])

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-12">
      <button
        className="text-muted-foreground hover:text-foreground text-sm"
        onClick={() => setPage('home')}
        type="button"
      >
        &larr; Home
      </button>
      <h1 className="text-2xl font-semibold">My Feedback</h1>
      <div className="flex items-center gap-2">
        <input
          value={submitterId}
          onChange={(e) => setSubmitterId(e.target.value)}
          className="border-border bg-background w-48 rounded-lg border px-3 py-2 text-sm"
          placeholder="Submitter ID"
        />
        <Button size="sm" variant="outline" onClick={() => void load()} disabled={loading}>
          Refresh
        </Button>
      </div>
      {items.length === 0 && !loading && (
        <p className="text-muted-foreground text-sm">No feedback submitted yet.</p>
      )}
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.feedback_id}
            className="border-border bg-card rounded-xl border p-4 text-sm space-y-1"
          >
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[item.status]}`}
              >
                {item.status}
              </span>
              <span className="text-muted-foreground text-xs">
                {new Date(item.created_at).toLocaleString()}
              </span>
            </div>
            <p>
              <span className="font-medium">Strain:</span> {item.query_strain}
              &nbsp;&rarr;&nbsp;
              <span className="line-through">{item.predicted_species}</span>
              &nbsp;&rarr;&nbsp;
              <span className="text-primary font-medium">{item.suggested_species}</span>
            </p>
            <p className="text-muted-foreground">{item.description}</p>
            {item.review_note && (
              <p className="text-muted-foreground border-t border-border pt-2 text-xs">
                Reviewer note: {item.review_note}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
