import {
  ArrowRight,
  CheckCircle2,
  FolderInput,
  FlaskConical,
  ImageIcon,
  Layers3,
  LoaderCircle,
  Search,
  Upload,
  XCircle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const mediaOptions = [
  'MEA',
  'CYA',
  'YES',
  'DG18',
  'OA',
  'CREA',
  'PDA',
  'CMA',
  'SAB',
  'M40Y',
]
const templateColumns = ['strain', 'media', 'max_colonies']
const batchRows = [
  {
    strain: 'strain_001',
    images: ['image_01.jpg', 'image_02.jpg'],
    removed: ['image_02.jpg'],
    status: 'Review ready',
  },
  {
    strain: 'strain_002',
    images: ['image_01.jpg'],
    removed: [],
    status: 'Queued',
  },
]

function App() {
  return (
    <main className="from-background via-background to-muted/30 text-foreground min-h-screen bg-gradient-to-b">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-6 py-10 md:px-10 lg:py-14">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-5">
            <div className="border-border/70 bg-background/80 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-[0.2em] uppercase backdrop-blur">
              <Layers3 className="size-3.5" />
              MycoAI Image Input
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
                Image upload, batch review, and colony controls for fungal
                species classification.
              </h1>
              <p className="text-muted-foreground max-w-2xl text-base leading-7 md:text-lg">
                Upload single plates or batch folders, set strain + media
                metadata, preview images before processing, and tune colony
                limits from default threshold to top-N control.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="gap-2">
              Start single upload
              <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              Reformat batch folder
              <FolderInput className="size-4" />
            </Button>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <article className="border-border/70 bg-card rounded-3xl border p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
                  Single image upload
                </p>
                <h2 className="mt-1 text-2xl font-semibold">
                  Strain + media + colony limit
                </h2>
              </div>
              <div className="bg-primary/10 text-primary inline-flex rounded-2xl p-3">
                <Upload className="size-5" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <Field
                    label="Strain identifier"
                    value="strain_001"
                    helper="Free text"
                  />
                  <Field
                    label="Growth medium"
                    value="MEA"
                    helper="Predefined list"
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <Field
                    label="Max colonies"
                    value="Default (model threshold)"
                    helper="1-10 override"
                  />
                  <Field
                    label="Image format"
                    value="TIFF"
                    helper="JPEG, PNG, TIFF"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {mediaOptions.map((media) => (
                    <span
                      key={media}
                      className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium"
                    >
                      {media}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-border/70 bg-muted/30 rounded-2xl border p-4">
                <div className="border-border/60 bg-background flex min-h-52 items-center justify-center rounded-xl border border-dashed p-4 text-center">
                  <div className="space-y-3">
                    <ImageIcon className="text-primary mx-auto size-10" />
                    <div>
                      <p className="font-medium">
                        Preview ready before processing
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Minimum image size: 256x256
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <CheckCircle2 className="text-primary size-4" />
                  Single-image workflow pinned to preview + metadata checks
                </div>
              </div>
            </div>
          </article>

          <article className="border-border/70 bg-card rounded-3xl border p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
                  Batch tooling
                </p>
                <h2 className="mt-1 text-2xl font-semibold">
                  Template folder + column mapping
                </h2>
              </div>
              <div className="bg-primary/10 text-primary inline-flex rounded-2xl p-3">
                <FlaskConical className="size-5" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-muted/40 rounded-2xl p-4">
                <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
                  template.json
                </p>
                <div className="mt-3 grid gap-2 text-sm">
                  <CodeRow label="batch_name" value="batch_upload" />
                  <CodeRow
                    label="column_mapping"
                    value="strain / media / max_colonies"
                  />
                  <CodeRow label="defaults" value="MEA, null" />
                  <CodeRow label="output_format" value="csv" />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {templateColumns.map((column) => (
                  <div
                    key={column}
                    className="border-border/70 rounded-2xl border p-4"
                  >
                    <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
                      Column
                    </p>
                    <p className="mt-2 text-sm font-medium">{column}</p>
                  </div>
                ))}
              </div>

              <div className="border-border/70 rounded-2xl border p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Search className="size-4" />
                  AI-assisted reformat commands
                </div>
                <p className="text-muted-foreground mt-2 text-sm leading-6">
                  Detect strain/media columns from arbitrary CSVs, map optional
                  max_colonies, and emit template-ready folder structure.
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="border-border/70 bg-card rounded-3xl border p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
                  Batch review
                </p>
                <h2 className="mt-1 text-2xl font-semibold">
                  Remove bad images before processing
                </h2>
              </div>
              <Button size="sm" variant="outline" className="gap-2">
                <LoaderCircle className="size-4" />
                24% progress
              </Button>
            </div>

            <div className="space-y-3">
              {batchRows.map((row) => (
                <div
                  key={row.strain}
                  className="border-border/70 bg-muted/20 rounded-2xl border p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{row.strain}</p>
                      <p className="text-muted-foreground text-sm">
                        {row.images.length} images · {row.status}
                      </p>
                    </div>
                    <span className="bg-background text-muted-foreground rounded-full px-3 py-1 text-xs font-medium">
                      {row.images.length} total
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {row.images.map((image) => {
                      const removed = row.removed.includes(image)
                      return (
                        <button
                          key={image}
                          className={cn(
                            'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-colors',
                            removed
                              ? 'bg-destructive/10 text-destructive line-through'
                              : 'bg-background text-foreground border-border border',
                          )}
                          type="button"
                        >
                          {removed ? (
                            <XCircle className="size-3.5" />
                          ) : (
                            <CheckCircle2 className="size-3.5" />
                          )}
                          {image}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="border-border/70 bg-card rounded-3xl border p-6 shadow-sm">
            <div className="mb-5">
              <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
                Results delivery
              </p>
              <h2 className="mt-1 text-2xl font-semibold">
                Progress + downloadable CSV
              </h2>
            </div>

            <div className="space-y-4">
              <div className="bg-primary/10 text-primary rounded-2xl p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="size-4" />
                  Processing pipeline
                </div>
                <div className="bg-primary/20 mt-3 h-2 rounded-full">
                  <div className="bg-primary h-2 w-[68%] rounded-full" />
                </div>
                <p className="mt-2 text-sm">
                  Batch review, segmentation, classification, export.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <ResultCard
                  title="Preview count"
                  value="2 strains"
                  detail="Removed images stay skipped"
                />
                <ResultCard
                  title="Output"
                  value="results.csv"
                  detail="Download after completion"
                />
              </div>

              <div className="border-border/70 rounded-2xl border p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Search className="size-4" />
                  Acceptance coverage
                </div>
                <ul className="text-muted-foreground mt-3 space-y-2 text-sm leading-6">
                  <li>Single image upload with strain + media selection</li>
                  <li>Max colonies default or 1-10 override</li>
                  <li>Batch folder template parsing and preview</li>
                  <li>Progress indicator and CSV export</li>
                </ul>
              </div>
            </div>
          </article>
        </section>
      </section>
    </main>
  )
}

function Field({
  label,
  value,
  helper,
}: {
  label: string
  value: string
  helper: string
}) {
  return (
    <label className="space-y-2">
      <span className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
        {label}
      </span>
      <div className="border-border/70 bg-background rounded-2xl border px-4 py-3 text-sm font-medium">
        {value}
      </div>
      <span className="text-muted-foreground text-xs">{helper}</span>
    </label>
  )
}

function CodeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background flex items-center justify-between gap-4 rounded-xl px-3 py-2">
      <span className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
        {label}
      </span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

function ResultCard({
  title,
  value,
  detail,
}: {
  title: string
  value: string
  detail: string
}) {
  return (
    <div className="border-border/70 rounded-2xl border p-4">
      <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
        {title}
      </p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
      <p className="text-muted-foreground mt-1 text-sm">{detail}</p>
    </div>
  )
}

export default App
