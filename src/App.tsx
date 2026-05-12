import {
  CheckCircle2,
  Inbox,
  MessageSquareWarning,
  XCircle,
} from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

type FeedbackStatus = 'pending' | 'accepted' | 'rejected' | 'deferred'
type FeedbackSource = 'query_result' | 'database_review'

type FeedbackItem = {
  id: string
  submitter: string
  source: FeedbackSource
  queryStrain: string
  predictedSpecies: string
  suggestedSpecies: string
  description: string
  status: FeedbackStatus
  submittedAt: string
  reviewNote?: string
}

const initialFeedback: FeedbackItem[] = [
  {
    id: 'FDB-1024',
    submitter: 'Dr. Nguyen',
    source: 'query_result',
    queryStrain: 'MYCO-447',
    predictedSpecies: 'Agaricus bisporus',
    suggestedSpecies: 'Agaricus campestris',
    description: 'Pileus texture and spore print disagree with top retrieval.',
    status: 'pending',
    submittedAt: '2026-05-11T09:12:00Z',
  },
  {
    id: 'FDB-1023',
    submitter: 'Lab Curator',
    source: 'database_review',
    queryStrain: 'IMG-8841',
    predictedSpecies: 'Ganoderma lucidum',
    suggestedSpecies: 'Ganoderma applanatum',
    description: 'Database image label looks inverted after migration.',
    status: 'pending',
    submittedAt: '2026-05-11T08:40:00Z',
  },
]

function App() {
  const [feedback, setFeedback] = useState(initialFeedback)
  const [toast, setToast] = useState('')

  const pending = feedback.filter((item) => item.status === 'pending')
  const reviewed = feedback.filter((item) => item.status !== 'pending')
  const acceptedCount = feedback.filter(
    (item) => item.status === 'accepted',
  ).length
  const acceptanceRate =
    reviewed.length === 0 ? 0 : acceptedCount / reviewed.length

  function review(id: string, status: Exclude<FeedbackStatus, 'pending'>) {
    setFeedback((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              reviewNote:
                status === 'accepted'
                  ? 'Accepted. Strain queued for re-indexing.'
                  : 'Rejected. Evidence insufficient for database update.',
            }
          : item,
      ),
    )
    setToast(`Feedback ${status}`)
  }

  function submitDemoFeedback() {
    const item: FeedbackItem = {
      id: `FDB-${1025 + feedback.length}`,
      submitter: 'Current user',
      source: 'query_result',
      queryStrain: 'MYCO-512',
      predictedSpecies: 'Pleurotus ostreatus',
      suggestedSpecies: 'Pleurotus pulmonarius',
      description: 'Report incorrect result from retrieval page.',
      status: 'pending',
      submittedAt: new Date().toISOString(),
    }
    setFeedback((items) => [item, ...items])
    setToast('Feedback submitted')
  }

  return (
    <main className="from-background via-background to-muted/30 text-foreground min-h-screen bg-gradient-to-b">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 md:px-10">
        <div className="bg-card flex flex-col gap-6 rounded-[2rem] border p-8 shadow-sm md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <div className="text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-[0.2em] uppercase">
              <MessageSquareWarning className="size-3.5" />
              Feedback pipeline
            </div>
            <div className="space-y-2">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
                Submit, review, and apply fungal retrieval corrections.
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                Users report incorrect predictions. Data owners accept, reject,
                defer, and queue accepted strains for re-indexing.
              </p>
            </div>
          </div>
          <Button size="lg" onClick={submitDemoFeedback}>
            Report incorrect
          </Button>
        </div>

        {toast ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            {toast}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-3">
          <Metric label="Pending review" value={pending.length.toString()} />
          <Metric
            label="Acceptance rate"
            value={`${Math.round(acceptanceRate * 100)}%`}
          />
          <Metric
            label="Unread notifications"
            value={reviewed.length.toString()}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section className="bg-card rounded-[2rem] border p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Inbox className="size-5" />
              <h2 className="text-xl font-semibold">Data owner inbox</h2>
            </div>
            <div className="space-y-4">
              {feedback.map((item) => (
                <article key={item.id} className="rounded-3xl border p-5">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{item.queryStrain}</p>
                      <p className="text-muted-foreground text-sm">
                        {item.submitter} · {item.source.replace('_', ' ')}
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  <dl className="grid gap-3 text-sm md:grid-cols-2">
                    <div>
                      <dt className="text-muted-foreground">Predicted</dt>
                      <dd>{item.predictedSpecies}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Suggested</dt>
                      <dd>{item.suggestedSpecies}</dd>
                    </div>
                  </dl>
                  <p className="text-muted-foreground mt-4 text-sm">
                    {item.description}
                  </p>
                  {item.reviewNote ? (
                    <p className="bg-muted mt-3 rounded-2xl px-3 py-2 text-sm">
                      {item.reviewNote}
                    </p>
                  ) : null}
                  {item.status === 'pending' ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => review(item.id, 'accepted')}
                      >
                        <CheckCircle2 className="size-4" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => review(item.id, 'rejected')}
                      >
                        <XCircle className="size-4" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => review(item.id, 'deferred')}
                      >
                        Defer
                      </Button>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="bg-card rounded-[2rem] border p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">My feedback</h2>
              <div className="space-y-3">
                {feedback.map((item) => (
                  <div
                    key={`mine-${item.id}`}
                    className="bg-muted/70 rounded-2xl p-4 text-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">
                        {item.suggestedSpecies}
                      </span>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="text-muted-foreground mt-2">
                      {item.reviewNote ?? item.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-card rounded-[2rem] border p-6 shadow-sm">
              <h2 className="mb-3 text-xl font-semibold">Accept workflow</h2>
              <ol className="text-muted-foreground space-y-3 text-sm">
                <li>1. Update strain species when known.</li>
                <li>2. Flag Qdrant points inactive.</li>
                <li>3. Queue re-extract and re-upsert task.</li>
                <li>4. Notify submitter and write audit log.</li>
              </ol>
            </section>
          </aside>
        </div>
      </section>
    </main>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card rounded-3xl border p-6 shadow-sm">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: FeedbackStatus }) {
  return (
    <span className="text-muted-foreground rounded-full border px-3 py-1 text-xs font-medium capitalize">
      {status}
    </span>
  )
}

export default App
