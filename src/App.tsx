import { type ReactNode, useMemo, useState } from 'react'
import {
  Archive,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  Database,
  Leaf,
  Plus,
  Search,
  ShieldAlert,
  Undo2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type DataSource = 'curated_primary' | 'incoming_low_quality' | 'user_upload'
type MediaType = 'PDA' | 'MEA' | 'CZA' | 'SDA'

type Species = {
  id: string
  name: string
  description: string
  archived: boolean
  strains: number
  images: number
}

type Strain = {
  id: string
  name: string
  speciesId: string
  source: DataSource
  archived: boolean
  addedAt: string
  learned: boolean
}

type ImageItem = {
  id: string
  strainId: string
  media: MediaType
  filePath: string
  addedAt: string
  archived: boolean
  indexed: boolean
}

type AuditEntry = {
  id: string
  action: string
  entity: string
  detail: string
}

type SummaryCardProps = {
  label: string
  value: string
  icon: ReactNode
}

const initialSpecies: Species[] = [
  {
    id: 'sp-1',
    name: 'Amanita muscaria',
    description: 'Fly agaric',
    archived: false,
    strains: 3,
    images: 12,
  },
  {
    id: 'sp-2',
    name: 'Boletus edulis',
    description: 'Porcini',
    archived: false,
    strains: 2,
    images: 8,
  },
  {
    id: 'sp-3',
    name: 'Pleurotus ostreatus',
    description: 'Oyster mushroom',
    archived: true,
    strains: 1,
    images: 4,
  },
]

const initialStrains: Strain[] = [
  {
    id: 'st-1',
    name: 'AM-01',
    speciesId: 'sp-1',
    source: 'curated_primary',
    archived: false,
    addedAt: '2026-05-01',
    learned: true,
  },
  {
    id: 'st-2',
    name: 'AM-02',
    speciesId: 'sp-1',
    source: 'user_upload',
    archived: false,
    addedAt: '2026-05-05',
    learned: false,
  },
  {
    id: 'st-3',
    name: 'BE-01',
    speciesId: 'sp-2',
    source: 'incoming_low_quality',
    archived: false,
    addedAt: '2026-05-06',
    learned: true,
  },
  {
    id: 'st-4',
    name: 'PO-01',
    speciesId: 'sp-3',
    source: 'user_upload',
    archived: true,
    addedAt: '2026-05-08',
    learned: false,
  },
]

const initialImages: ImageItem[] = [
  {
    id: 'im-1',
    strainId: 'st-1',
    media: 'PDA',
    filePath: '/data/amanita/01.jpg',
    addedAt: '2026-05-01',
    archived: false,
    indexed: true,
  },
  {
    id: 'im-2',
    strainId: 'st-1',
    media: 'MEA',
    filePath: '/data/amanita/02.jpg',
    addedAt: '2026-05-02',
    archived: false,
    indexed: true,
  },
  {
    id: 'im-3',
    strainId: 'st-2',
    media: 'PDA',
    filePath: '/data/amanita/03.jpg',
    addedAt: '2026-05-05',
    archived: false,
    indexed: false,
  },
  {
    id: 'im-4',
    strainId: 'st-3',
    media: 'CZA',
    filePath: '/data/boletus/01.jpg',
    addedAt: '2026-05-06',
    archived: false,
    indexed: true,
  },
  {
    id: 'im-5',
    strainId: 'st-4',
    media: 'SDA',
    filePath: '/data/pleurotus/01.jpg',
    addedAt: '2026-05-08',
    archived: true,
    indexed: false,
  },
]

const initialAudit: AuditEntry[] = [
  {
    id: 'au-1',
    action: 'create',
    entity: 'species',
    detail: 'Amanita muscaria created',
  },
  {
    id: 'au-2',
    action: 'archive',
    entity: 'species',
    detail: 'Pleurotus ostreatus archived',
  },
]

function SummaryCard({ label, value, icon }: SummaryCardProps) {
  return (
    <div className="border-border/70 bg-card rounded-3xl border p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm">{label}</p>
        {icon}
      </div>
      <p className="text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  )
}

function App() {
  const [species, setSpecies] = useState(initialSpecies)
  const [strains, setStrains] = useState(initialStrains)
  const [images, setImages] = useState(initialImages)
  const [audit, setAudit] = useState(initialAudit)
  const [speciesName, setSpeciesName] = useState('')
  const [speciesSearch, setSpeciesSearch] = useState('')
  const [strainSearch, setStrainSearch] = useState('')
  const [speciesFilter, setSpeciesFilter] = useState('all')
  const [mediaFilter, setMediaFilter] = useState<MediaType[]>([])
  const [showArchived, setShowArchived] = useState(false)
  const [archivedOnly, setArchivedOnly] = useState(false)

  const filteredSpecies = useMemo(
    () =>
      species.filter((item) =>
        item.name.toLowerCase().includes(speciesSearch.toLowerCase()),
      ),
    [species, speciesSearch],
  )

  const filteredStrains = useMemo(() => {
    return strains.filter((strain) => {
      const speciesMatch =
        speciesFilter === 'all' || strain.speciesId === speciesFilter
      const searchMatch = strain.name
        .toLowerCase()
        .includes(strainSearch.toLowerCase())
      const archivedMatch = archivedOnly
        ? strain.archived
        : showArchived || !strain.archived
      return speciesMatch && searchMatch && archivedMatch
    })
  }, [archivedOnly, showArchived, speciesFilter, strains, strainSearch])

  const filteredImages = useMemo(() => {
    return images.filter((image) => {
      const strain = strains.find((item) => item.id === image.strainId)
      const speciesMatch =
        speciesFilter === 'all' || strain?.speciesId === speciesFilter
      const mediaMatch =
        mediaFilter.length === 0 || mediaFilter.includes(image.media)
      const archivedMatch = archivedOnly
        ? image.archived
        : showArchived || !image.archived
      return speciesMatch && mediaMatch && archivedMatch
    })
  }, [archivedOnly, images, mediaFilter, showArchived, speciesFilter, strains])

  const dashboard = useMemo(() => {
    const totalImages = images.length
    const totalStrains = strains.length
    const totalSpecies = species.filter((item) => !item.archived).length
    const totalMediaTypes = new Set(images.map((item) => item.media)).size
    const learnedCount = images.filter(
      (item) => item.indexed && !item.archived,
    ).length
    const pendingCount = totalImages - learnedCount
    const archivedCount =
      images.filter((item) => item.archived).length +
      strains.filter((item) => item.archived).length +
      species.filter((item) => item.archived).length
    const speciesChart = species
      .filter((item) => !item.archived)
      .map((item) => ({ name: item.name, count: item.images }))
      .toSorted((a, b) => b.count - a.count)
    const mediumCounts = images.reduce<Record<string, number>>((acc, image) => {
      acc[image.media] = (acc[image.media] ?? 0) + 1
      return acc
    }, {})
    const mediumChart = Object.entries(mediumCounts)
      .map(([name, count]) => ({ name, count }))
      .toSorted((a, b) => b.count - a.count)
    return {
      totalImages,
      totalStrains,
      totalSpecies,
      totalMediaTypes,
      learnedCount,
      pendingCount,
      archivedCount,
      speciesChart,
      mediumChart,
    }
  }, [images, species, strains])

  const growthMediums = ['PDA', 'MEA', 'CZA', 'SDA'] as const

  const addSpecies = () => {
    const name = speciesName.trim()
    if (!name) return
    const exists = species.some(
      (item) => item.name.toLowerCase() === name.toLowerCase(),
    )
    if (exists) return
    const next: Species = {
      id: `sp-${Date.now()}`,
      name,
      description: 'Newly curated species',
      archived: false,
      strains: 0,
      images: 0,
    }
    setSpecies((current) => [next, ...current])
    setAudit((current) => [
      {
        id: `au-${Date.now()}`,
        action: 'create',
        entity: 'species',
        detail: `${name} created`,
      },
      ...current,
    ])
    setSpeciesName('')
  }

  const archiveSpecies = (id: string) => {
    const target = species.find((item) => item.id === id)
    if (!target) return
    setSpecies((current) =>
      current.map((item) =>
        item.id === id ? { ...item, archived: true } : item,
      ),
    )
    setStrains((current) =>
      current.map((item) =>
        item.speciesId === id ? { ...item, archived: true } : item,
      ),
    )
    setImages((current) =>
      current.map((item) => {
        const strain = strains.find((entry) => entry.id === item.strainId)
        return strain?.speciesId === id ? { ...item, archived: true } : item
      }),
    )
    setAudit((current) => [
      {
        id: `au-${Date.now()}`,
        action: 'archive',
        entity: 'species',
        detail: `${target.name} archived`,
      },
      ...current,
    ])
  }

  const restoreSpecies = (id: string) => {
    setSpecies((current) =>
      current.map((item) =>
        item.id === id ? { ...item, archived: false } : item,
      ),
    )
    setStrains((current) =>
      current.map((item) =>
        item.speciesId === id ? { ...item, archived: false } : item,
      ),
    )
    setImages((current) =>
      current.map((item) => {
        const strain = strains.find((entry) => entry.id === item.strainId)
        return strain?.speciesId === id ? { ...item, archived: false } : item
      }),
    )
  }

  return (
    <main className="from-background via-background to-muted/30 text-foreground min-h-screen bg-gradient-to-b">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 md:px-10">
        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="border-border/70 bg-card rounded-[2rem] border p-8 shadow-sm">
            <div className="text-muted-foreground mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-[0.2em] uppercase">
              <Database className="size-3.5" />
              Data management
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-6xl">
              Species, strains, images, archive.
            </h1>
            <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-7 md:text-lg">
              CRUD console for fungal data owners. Unique species names, direct
              strain links, media filters, trash recovery, and audit trail.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" className="gap-2">
                <Plus className="size-4" />
                New species
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <ShieldAlert className="size-4" />
                Retrain now
              </Button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <SummaryCard
              label="Total images"
              value={String(dashboard.totalImages)}
              icon={<BarChart3 className="text-primary size-5" />}
            />
            <SummaryCard
              label="Learned vs pending"
              value={`${dashboard.learnedCount} / ${dashboard.pendingCount}`}
              icon={<CheckCircle2 className="text-primary size-5" />}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <SummaryCard
            label="Total strains"
            value={String(dashboard.totalStrains)}
            icon={<Leaf className="text-primary size-5" />}
          />
          <SummaryCard
            label="Total species"
            value={String(dashboard.totalSpecies)}
            icon={<Database className="text-primary size-5" />}
          />
          <SummaryCard
            label="Media types"
            value={String(dashboard.totalMediaTypes)}
            icon={<ChevronDown className="text-primary size-5" />}
          />
          <SummaryCard
            label="Archived items"
            value={String(dashboard.archivedCount)}
            icon={<Archive className="text-primary size-5" />}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="grid gap-6">
            <section className="border-border/70 bg-card rounded-[2rem] border p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">Create species</h2>
                  <p className="text-muted-foreground text-sm">
                    Unique name validation, archive aware.
                  </p>
                </div>
                <Leaf className="text-primary size-5" />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  className="border-border bg-background flex-1 rounded-2xl border px-4 py-3 text-sm"
                  value={speciesName}
                  onChange={(event) => setSpeciesName(event.target.value)}
                  placeholder="Species name"
                />
                <Button onClick={addSpecies} className="gap-2">
                  <Plus className="size-4" />
                  Add species
                </Button>
              </div>
            </section>

            <section className="border-border/70 bg-card rounded-[2rem] border p-6 shadow-sm">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Browser filters</h2>
                  <p className="text-muted-foreground text-sm">
                    Strain search, species dropdown, growth medium, date,
                    source.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={showArchived ? 'default' : 'outline'}
                    onClick={() => setShowArchived((current) => !current)}
                  >
                    Trash view
                  </Button>
                  <Button
                    variant={archivedOnly ? 'default' : 'outline'}
                    onClick={() => setArchivedOnly((current) => !current)}
                  >
                    Archived only
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <label className="grid gap-2 text-sm">
                  Species search
                  <div className="border-border bg-background flex items-center gap-2 rounded-2xl border px-3">
                    <Search className="text-muted-foreground size-4" />
                    <input
                      className="w-full py-3 outline-none"
                      value={speciesSearch}
                      onChange={(event) => setSpeciesSearch(event.target.value)}
                      placeholder="Search species"
                    />
                  </div>
                </label>
                <label className="grid gap-2 text-sm">
                  Strain search
                  <input
                    className="border-border bg-background rounded-2xl border px-4 py-3 outline-none"
                    value={strainSearch}
                    onChange={(event) => setStrainSearch(event.target.value)}
                    placeholder="Search strain"
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  Species filter
                  <select
                    className="border-border bg-background rounded-2xl border px-4 py-3 outline-none"
                    value={speciesFilter}
                    onChange={(event) => setSpeciesFilter(event.target.value)}
                  >
                    <option value="all">All species</option>
                    {species.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid gap-2 text-sm">
                  Media filter
                  <div className="flex flex-wrap gap-2">
                    {growthMediums.map((medium) => (
                      <button
                        key={medium}
                        type="button"
                        className={cn(
                          'rounded-full border px-3 py-2 text-xs font-medium',
                          mediaFilter.includes(medium)
                            ? 'bg-primary text-primary-foreground border-transparent'
                            : 'border-border bg-background',
                        )}
                        onClick={() =>
                          setMediaFilter((current) =>
                            current.includes(medium)
                              ? current.filter((item) => item !== medium)
                              : [...current, medium],
                          )
                        }
                      >
                        {medium}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <div className="border-border/70 bg-card rounded-[2rem] border p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Species</h2>
                <div className="space-y-3">
                  {filteredSpecies.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        'border-border/70 rounded-2xl border p-4',
                        item.archived && 'bg-muted/40',
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-muted-foreground text-sm">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {item.archived ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => restoreSpecies(item.id)}
                            >
                              <Undo2 className="size-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => archiveSpecies(item.id)}
                            >
                              <Archive className="size-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            Rename
                          </Button>
                        </div>
                      </div>
                      <div className="text-muted-foreground mt-3 flex gap-4 text-xs">
                        <span>{item.strains} strains</span>
                        <span>{item.images} images</span>
                        <span>{item.archived ? 'archived' : 'active'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-border/70 bg-card rounded-[2rem] border p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Audit log</h2>
                <div className="space-y-3">
                  {audit.map((entry) => (
                    <div
                      key={entry.id}
                      className="border-border/70 rounded-2xl border p-4"
                    >
                      <div className="flex items-center justify-between gap-3 text-sm font-medium">
                        <span>{entry.action}</span>
                        <span className="text-muted-foreground">
                          {entry.entity}
                        </span>
                      </div>
                      <p className="text-muted-foreground mt-2 text-sm">
                        {entry.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <aside className="grid gap-6">
            <section className="border-border/70 bg-card rounded-[2rem] border p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Dashboard charts</h2>
              <div className="space-y-5">
                <div>
                  <p className="mb-2 text-sm font-medium">Images per species</p>
                  <div className="space-y-2">
                    {dashboard.speciesChart.map((item) => (
                      <div key={item.name} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>{item.name}</span>
                          <span>{item.count}</span>
                        </div>
                        <div className="bg-muted h-2 rounded-full">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${Math.max(12, item.count * 8)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">Images per medium</p>
                  <div className="grid grid-cols-2 gap-2">
                    {dashboard.mediumChart.map((item) => (
                      <div
                        key={item.name}
                        className="border-border/70 rounded-2xl border p-3"
                      >
                        <p className="text-muted-foreground text-xs">
                          {item.name}
                        </p>
                        <p className="text-lg font-semibold">{item.count}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">Timeline</p>
                  <div className="space-y-1 text-sm">
                    {images.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between border-b py-1 last:border-b-0"
                      >
                        <span>{item.addedAt}</span>
                        <span>{item.media}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="border-border/70 bg-card rounded-[2rem] border p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Filtered results</h2>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  {filteredStrains.length} strains, {filteredImages.length}{' '}
                  images
                </p>
                {filteredStrains.map((strain) => {
                  const speciesNameText =
                    species.find((item) => item.id === strain.speciesId)
                      ?.name ?? 'Unknown'
                  return (
                    <div
                      key={strain.id}
                      className={cn(
                        'border-border/70 rounded-2xl border p-4',
                        strain.archived && 'bg-muted/40',
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{strain.name}</span>
                        <span className="text-muted-foreground">
                          {speciesNameText}
                        </span>
                      </div>
                      <div className="text-muted-foreground mt-2 flex gap-3 text-xs">
                        <span>{strain.source}</span>
                        <span>{strain.addedAt}</span>
                        <span>{strain.learned ? 'learned' : 'pending'}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default App
