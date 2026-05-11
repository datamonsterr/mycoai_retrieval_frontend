import { useState } from 'react'
import { ArrowRight, CheckCircle, FlaskConical, Layers3, MessageSquare, Search } from 'lucide-react'

import type { Page } from '@/types/feedback'
import { Button } from '@/components/ui/button'
import FeedbackForm from '@/pages/FeedbackForm'
import MyFeedback from '@/pages/MyFeedback'
import FeedbackInbox from '@/pages/FeedbackInbox'

const PAGES: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: 'submit', label: 'Submit Feedback', icon: <MessageSquare className="size-4" /> },
  { id: 'my-feedback', label: 'My Feedback', icon: <CheckCircle className="size-4" /> },
  { id: 'inbox', label: 'Feedback Inbox', icon: <Layers3 className="size-4" /> },
]

function App() {
  const [page, setPage] = useState<Page>('home')

  if (page === 'submit') return <FeedbackForm setPage={setPage} />
  if (page === 'my-feedback') return <MyFeedback setPage={setPage} />
  if (page === 'inbox') return <FeedbackInbox setPage={setPage} />

  return (
    <main className="from-background via-background to-muted/30 text-foreground min-h-screen bg-gradient-to-b">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-12 px-6 py-16 md:px-10">
        <div className="max-w-3xl space-y-6">
          <div className="border-border/70 bg-background/80 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-[0.2em] uppercase backdrop-blur">
            <Layers3 className="size-3.5" />
            MycoAI Retrieval Platform
          </div>

          <div className="space-y-4">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
              Scientist-facing search and indexing for fungal retrieval
              workflows.
            </h1>
            <p className="text-muted-foreground max-w-2xl text-base leading-7 md:text-lg">
              This frontend is the operator console for dataset management,
              index status, and retrieval queries backed by the MycoAI platform.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="gap-2" onClick={() => setPage('submit')}>
              Report Incorrect Prediction
              <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2" onClick={() => setPage('inbox')}>
              Feedback Inbox
              <MessageSquare className="size-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2" onClick={() => setPage('my-feedback')}>
              My Feedback
              <CheckCircle className="size-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="border-border/70 bg-card rounded-3xl border p-6 shadow-sm">
            <div className="bg-primary/10 text-primary mb-4 inline-flex rounded-2xl p-3">
              <Search className="size-5" />
            </div>
            <h2 className="mb-2 text-lg font-semibold">Query Console</h2>
            <p className="text-muted-foreground text-sm leading-6">
              Run species retrieval queries against the shared vector index with
              a scientist-friendly workflow.
            </p>
          </div>

          <div className="border-border/70 bg-card rounded-3xl border p-6 shadow-sm">
            <div className="bg-primary/10 text-primary mb-4 inline-flex rounded-2xl p-3">
              <FlaskConical className="size-5" />
            </div>
            <h2 className="mb-2 text-lg font-semibold">Dataset Operations</h2>
            <p className="text-muted-foreground text-sm leading-6">
              Manage uploads, curation steps, and experiment-facing metadata for
              the fungal retrieval stack.
            </p>
          </div>

          <div className="border-border/70 bg-card rounded-3xl border p-6 shadow-sm">
            <div className="bg-primary/10 text-primary mb-4 inline-flex rounded-2xl p-3">
              <Layers3 className="size-5" />
            </div>
            <h2 className="mb-2 text-lg font-semibold">Index Visibility</h2>
            <p className="text-muted-foreground text-sm leading-6">
              Surface collection health, model versions, and retrieval artifacts
              from the shared monorepo workflows.
            </p>
          </div>
        </div>

        <div className="border-border/70 bg-card rounded-3xl border p-8 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Feedback Pipeline</h2>
          <p className="text-muted-foreground mb-6 text-sm leading-6">
            Users can report incorrect species predictions. Data owners review,
            accept, or reject feedback. Accepted feedback feeds into model improvement.
          </p>
          <div className="flex flex-wrap gap-3">
            {PAGES.map((p) => (
              <Button
                key={p.id}
                variant="outline"
                className="gap-2"
                onClick={() => setPage(p.id)}
              >
                {p.icon}
                {p.label}
              </Button>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
