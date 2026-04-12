import { ArrowRight, FlaskConical, Layers3, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'

function App() {
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
            <Button size="lg" className="gap-2">
              Open dashboard
              <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              View API contract
              <Search className="size-4" />
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
      </section>
    </main>
  )
}

export default App
