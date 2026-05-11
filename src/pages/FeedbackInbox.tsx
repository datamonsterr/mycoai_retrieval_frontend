import { useCallback, useEffect, useState } from 'react'

import type { FeedbackItem, FeedbackStatus, Page } from '@/types/feedback'
import { listFeedback, reviewFeedbackBulk } from '@/api/feedback'
import { Button } from '@/components/ui/button'

const STATUS_COLORS: Record<FeedbackStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

type Props = { setPage: (p: Page) => void }

export default function FeedbackInbox({ setPage }: Props) {
  const [items, setItems] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [ownerId] = useState('owner-1')
  const [filterStatus, setFilterStatus] = useState<FeedbackStatus | ''>('pending')
  const [rejectNote, setRejectNote] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    listFeedback(filterStatus ? { status: filterStatus } : {})
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [filterStatus])

  useEffect(() => {
    queueMicrotask(load)
  }, [load])

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    const pending = items.filter((i) => i.status === 'pending')
    if (selected.size === pending.length && pending.length > 0) {
      setSelected(new Set())
    } else {
      setSelected(new Set(pending.map((i) => i.feedback_id)))
    }
  }

  const doAction = (action: 'accept' | 'reject') => {
    const ids = [...selected]
    if (ids.length === 0) return
    reviewFeedbackBulk({
      action,
      reviewed_by: ownerId,
      review_note: action === 'reject' ? rejectNote || undefined : undefined,
      feedback_ids: ids,
    })
      .then(() => {
        setSelected(new Set())
        setRejectNote('')
        return load()
      })
      .catch(() => {
        /* ignore */
      })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-12">
      <button
        className="text-muted-foreground hover:text-foreground text-sm"
        onClick={() => setPage('home')}
        type="button"
      >
        &larr; Home
      </button>
      <h1 className="text-2xl font-semibold">Feedback Inbox</h1>
      <div className="flex items-center gap-3">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as FeedbackStatus | '')}
          className="border-border bg-background rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
        <Button size="sm" variant="outline" onClick={() => void load()} disabled={loading}>
          Refresh
        </Button>
        {selected.size > 0 && (
          <span className="text-muted-foreground text-sm">
            {selected.size} selected
          </span>
        )}
      </div>
      {selected.size > 0 && (
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => doAction('accept')}>
            Accept selected
          </Button>
          <div className="flex items-center gap-2">
            <input
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              className="border-border bg-background w-40 rounded-lg border px-2 py-1.5 text-xs"
              placeholder="Rejection reason"
            />
            <Button size="sm" variant="destructive" onClick={() => doAction('reject')}>
              Reject selected
            </Button>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={toggleAll}
        className="text-primary text-xs hover:underline"
      >
        Toggle all pending
      </button>
      {items.length === 0 && !loading && (
        <p className="text-muted-foreground text-sm">No feedback items.</p>
      )}
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.feedback_id}
            className={`border-border rounded-xl border p-4 text-sm space-y-1 ${selected.has(item.feedback_id) ? 'bg-accent' : 'bg-card'}`}
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected.has(item.feedback_id)}
                onChange={() => toggleSelect(item.feedback_id)}
                disabled={item.status !== 'pending'}
              />
              <span className="text-muted-foreground text-xs">
                {new Date(item.created_at).toLocaleString()}
              </span>
              <span className="text-xs font-medium">by {item.submitter_id}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[item.status]}`}
              >
                {item.status}
              </span>
              <span className="text-muted-foreground ml-auto text-xs">{item.source}</span>
            </div>
            <p>
              <span className="font-medium">Strain:</span> {item.query_strain}
              &nbsp;&rarr;&nbsp;
              <span className="line-through">{item.predicted_species}</span>
              &nbsp;&rarr;&nbsp;
              <span className="text-primary font-medium">
                {item.suggested_species}
              </span>
            </p>
            <p className="text-muted-foreground">{item.description}</p>
            {item.reviewed_at && (
              <p className="text-muted-foreground text-xs">
                Reviewed by {item.reviewed_by} at{' '}
                {new Date(item.reviewed_at).toLocaleString()}
              </p>
            )}
            {item.review_note && (
              <p className="text-muted-foreground border-t border-border pt-2 text-xs">
                Note: {item.review_note}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
