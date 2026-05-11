import { Search } from 'lucide-react'

import { Button } from '@/components/ui/button'

type Strategy = 'E1' | 'E2' | 'E3' | 'E4'
type Aggregation = 'weighted' | 'uni'

type FormState = {
  strain: string
  media: string
  cropPath: string
  k: number
  aggregation: Aggregation
  environmentStrategy: Strategy
  e3Medium: string
  e4ExcludeMedium: string
}

const defaultForm: FormState = {
  strain: 'DTO-001-A1',
  media: 'MEA',
  cropPath: '/data/segments/dto-001-a1-mea-0.jpg',
  k: 5,
  aggregation: 'weighted',
  environmentStrategy: 'E1',
  e3Medium: 'CYA',
  e4ExcludeMedium: 'YES',
}

function buildPayload(form: FormState) {
  return {
    strain: form.strain,
    images: [
      {
        image_id: `${form.strain}-${form.media}`,
        media: form.media,
        segments: [{ segment_index: 0, crop_path: form.cropPath }],
      },
    ],
    k: form.k,
    aggregation: form.aggregation,
    environment_strategy: form.environmentStrategy,
    ...(form.environmentStrategy === 'E3' ? { e3_medium: form.e3Medium } : {}),
    ...(form.environmentStrategy === 'E4'
      ? { e4_exclude_medium: form.e4ExcludeMedium }
      : {}),
  }
}

export function RetrievalQuery() {
  const payload = buildPayload(defaultForm)

  return (
    <section className="border-border/70 bg-card rounded-3xl border p-6 shadow-sm md:p-8">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-muted-foreground mb-2 text-xs font-medium tracking-[0.2em] uppercase">
            Retrieval query
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Segment-to-species request contract
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6">
            Submit segmented colony crops, choose KNN and environment strategy,
            then aggregate neighbours into top species rankings.
          </p>
        </div>
        <Button className="gap-2 md:self-start">
          Run query
          <Search className="size-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="KNN k" value={defaultForm.k.toString()} />
        <Metric label="Aggregation" value={defaultForm.aggregation} />
        <Metric label="Environment" value={defaultForm.environmentStrategy} />
        <Metric label="Top species" value="5" />
      </div>

      <pre className="bg-muted/60 text-muted-foreground mt-6 overflow-x-auto rounded-2xl p-4 text-xs leading-5">
        {JSON.stringify(payload, null, 2)}
      </pre>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border/60 bg-background rounded-2xl border p-4">
      <div className="text-muted-foreground text-xs font-medium uppercase">
        {label}
      </div>
      <div className="mt-2 text-xl font-semibold">{value}</div>
    </div>
  )
}
