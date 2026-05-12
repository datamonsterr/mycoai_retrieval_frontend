import type { QueryMediaNeighbors } from '@/types/retrieval'

import { useState } from 'react'
import { FlaskConical, Hash } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Lightbox } from '@/components/Lightbox'

function NeighborThumb({
  thumb,
}: {
  thumb: {
    image_id: string
    thumbnail_url: string
    species: string
    strain: string
    similarity: number
    growth_medium: string
  }
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className={cn(
          'border-border/60 bg-background hover:border-primary/40 focus-visible:ring-ring/50',
          'flex w-44 shrink-0 flex-col overflow-hidden rounded-xl border',
          'cursor-pointer text-left shadow-sm transition-all hover:shadow-md',
          'focus-visible:ring-2 focus-visible:outline-none',
          'active:scale-[0.98]'
        )}
        onClick={() => setOpen(true)}
        aria-label={`Open ${thumb.species} ${thumb.strain} full image`}
      >
        <img
          src={thumb.thumbnail_url}
          alt={`${thumb.species} thumbnail`}
          className="bg-muted/30 aspect-square w-full object-cover"
          loading="lazy"
        />
        <div className="space-y-0.5 px-2.5 py-2">
          <p className="text-foreground text-xs font-medium leading-tight truncate">
            {thumb.species}
          </p>
          <p className="text-muted-foreground flex items-center gap-1 text-[11px]">
            <FlaskConical className="size-3 shrink-0" />
            {thumb.strain}
          </p>
          <p className="text-muted-foreground flex items-center gap-1 text-[11px]">
            <Hash className="size-3 shrink-0" />
            {thumb.growth_medium}
          </p>
          <p className="text-primary mt-0.5 text-xs font-semibold tabular-nums">
            {(thumb.similarity * 100).toFixed(0)}% match
          </p>
        </div>
      </button>
      {open && (
        <Lightbox
          src={thumb.thumbnail_url}
          alt={`${thumb.species} ${thumb.strain}`}
          caption={`${thumb.species} · ${thumb.strain} · ${thumb.growth_medium}`}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

export function KNNNeighborDetail({
  mediaDetails,
}: {
  mediaDetails: QueryMediaNeighbors[]
}) {
  return (
    <div className="space-y-4">
      {mediaDetails.map((md) => (
        <div key={md.media}>
          <h4 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
            {md.media} &middot; {md.query_image_id}
          </h4>
          <div
            className="flex gap-3 overflow-x-auto pb-1"
            role="list"
            aria-label={`Neighbors for ${md.media}`}
          >
            {md.neighbors.map((n) => (
              <NeighborThumb
                key={`${n.image_id}-${n.strain}`}
                thumb={n}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
