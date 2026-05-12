import type { RankedSpeciesResult } from '@/types/retrieval'

import { Fragment, useState } from 'react'
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, Download } from 'lucide-react'

import { exportRankingsCsv } from '@/lib/csv'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ConfidenceBar } from '@/components/ConfidenceBar'
import { KNNNeighborDetail } from '@/components/KNNNeighborDetail'

type SortKey = 'rank' | 'species' | 'score'
type SortDir = 'asc' | 'desc'

function sortRankings(
  rankings: RankedSpeciesResult[],
  key: SortKey,
  dir: SortDir
): RankedSpeciesResult[] {
  const sign = dir === 'asc' ? 1 : -1
  return rankings.toSorted((a, b) => {
    if (key === 'rank') return sign * (a.rank - b.rank)
    if (key === 'score') return sign * (a.score - b.score)
    return sign * a.species.localeCompare(b.species)
  })
}

const TH: React.FC<{
  label: string
  sortKey: SortKey
  activeKey: SortKey
  activeDir: SortDir
  onSort: (key: SortKey) => void
}> = ({ label, sortKey, activeKey, activeDir, onSort }) => {
  const active = activeKey === sortKey
  return (
    <th
      className="cursor-pointer px-4 py-3 text-left text-xs font-medium tracking-wider text-muted-foreground uppercase select-none"
      onClick={() => onSort(sortKey)}
      role="columnheader"
      aria-sort={active ? (activeDir === 'asc' ? 'ascending' : 'descending') : 'none'}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onSort(sortKey)
      }}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active ? (
          activeDir === 'asc' ? (
            <ArrowUp className="size-3" />
          ) : (
            <ArrowDown className="size-3" />
          )
        ) : null}
      </span>
    </th>
  )
}

export function ResultsTable({ rankings }: { rankings: RankedSpeciesResult[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('rank')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  const sorted = sortRankings(rankings, sortKey, sortDir)

  const toggleExpand = (rank: number) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(rank)) next.delete(rank)
      else next.add(rank)
      return next
    })
  }

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((direction) => (direction === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'rank' ? 'asc' : 'desc')
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => exportRankingsCsv(sorted)}
        >
          <Download className="size-4" />
          Export CSV
        </Button>
      </div>
      <div className="w-full overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/70 bg-muted/40">
              <TH label="Rank" sortKey="rank" activeKey={sortKey} activeDir={sortDir} onSort={handleSort} />
              <TH label="Species" sortKey="species" activeKey={sortKey} activeDir={sortDir} onSort={handleSort} />
              <TH label="Confidence" sortKey="score" activeKey={sortKey} activeDir={sortDir} onSort={handleSort} />
              <th className="px-4 py-3 text-right" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((result, index) => {
              const open = expanded.has(result.rank)
              return (
                <Fragment key={result.rank}>
                  <tr
                    className={cn(
                      'cursor-pointer border-b border-border/40 transition-colors hover:bg-muted/30',
                      index % 2 === 0 ? 'bg-background' : 'bg-muted/10'
                    )}
                    onClick={() => toggleExpand(result.rank)}
                    role="row"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') toggleExpand(result.rank)
                    }}
                  >
                    <td className="px-4 py-3.5 text-sm text-muted-foreground tabular-nums">
                      {result.rank}
                    </td>
                    <td className="px-4 py-3.5 text-sm font-medium text-foreground">
                      {result.species}
                    </td>
                    <td className="px-4 py-3.5">
                      <ConfidenceBar score={result.score} />
                    </td>
                    <td className="px-4 py-3.5 text-right text-muted-foreground">
                      {open ? <ChevronDown className="ml-auto size-4" /> : <ChevronRight className="ml-auto size-4" />}
                    </td>
                  </tr>
                  {open ? (
                    <tr className="bg-muted/20">
                      <td colSpan={4} className="px-4 py-3">
                        <KNNNeighborDetail mediaDetails={result.media_details} />
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
