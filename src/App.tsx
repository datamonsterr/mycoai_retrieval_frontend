import type { RetrievalQueryResponse } from '@/types/retrieval'

import { ArrowRight, FlaskConical, Layers3, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { KNNGraph } from '@/components/KNNGraph'
import { ResultsTable } from '@/components/ResultsTable'

const sampleRetrieval: RetrievalQueryResponse = {
  strain: 'Query-17',
  rankings: [
    {
      rank: 1,
      species: 'Penicillium commune',
      score: 0.91,
      media_details: [
        {
          media: 'MEA',
          query_image_id: 'query-mea-01',
          neighbors: [
            {
              image_id: 'image-01',
              thumbnail_url: 'https://placehold.co/256x256/png?text=PC',
              species: 'Penicillium commune',
              strain: 'PC-104',
              similarity: 0.94,
              growth_medium: 'MEA',
            },
            {
              image_id: 'image-02',
              thumbnail_url: 'https://placehold.co/256x256/png?text=PE',
              species: 'Penicillium expansum',
              strain: 'PE-221',
              similarity: 0.87,
              growth_medium: 'CYA',
            },
          ],
        },
      ],
    },
    {
      rank: 2,
      species: 'Penicillium expansum',
      score: 0.73,
      media_details: [
        {
          media: 'CYA',
          query_image_id: 'query-cya-01',
          neighbors: [
            {
              image_id: 'image-03',
              thumbnail_url: 'https://placehold.co/256x256/png?text=PE',
              species: 'Penicillium expansum',
              strain: 'PE-223',
              similarity: 0.82,
              growth_medium: 'CYA',
            },
          ],
        },
      ],
    },
    {
      rank: 3,
      species: 'Aspergillus niger',
      score: 0.59,
      media_details: [
        {
          media: 'YES',
          query_image_id: 'query-yes-01',
          neighbors: [
            {
              image_id: 'image-04',
              thumbnail_url: 'https://placehold.co/256x256/png?text=AN',
              species: 'Aspergillus niger',
              strain: 'AN-88',
              similarity: 0.78,
              growth_medium: 'YES',
            },
          ],
        },
      ],
    },
  ],
  query_details: {
    k: 5,
    aggregation: 'weighted',
    environment_strategy: 'E1',
    total_neighbors_queried: 15,
  },
}

function App() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 text-foreground">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 md:px-10">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase backdrop-blur">
            <Layers3 className="size-3.5" />
            MycoAI Retrieval Platform
          </div>

          <div className="space-y-4">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
              Scientist-facing retrieval visualization workflows.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Ranked species predictions, per-media KNN evidence, CSV export, and query-centered graph exploration.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="gap-2">
              Open results
              <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              View API contract
              <Search className="size-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
            <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
              <Search className="size-5" />
            </div>
            <h2 className="mb-2 text-lg font-semibold">Ranked Results</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Sort ranked species predictions and inspect confidence bars.
            </p>
          </div>

          <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
            <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
              <FlaskConical className="size-5" />
            </div>
            <h2 className="mb-2 text-lg font-semibold">KNN Evidence</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Expand each species to view per-media neighbors and thumbnails.
            </p>
          </div>

          <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
            <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
              <Layers3 className="size-5" />
            </div>
            <h2 className="mb-2 text-lg font-semibold">Graph Exploration</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Tune k and edge weighting while exploring species clusters.
            </p>
          </div>
        </div>

        <ResultsTable rankings={sampleRetrieval.rankings} />
        <KNNGraph rankings={sampleRetrieval.rankings} />
      </section>
    </main>
  )
}

export default App
