import { useState } from 'react'
import { ArrowRight, ImageUp, Layers3, PencilRuler, RotateCcw } from 'lucide-react'

import { RouteSummary } from '@/components/layout/route-summary'
import { Button } from '@/components/ui/button'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

type BoundingBox = {
  x: number
  y: number
  w: number
  h: number
}

type Segment = {
  segment_id: string
  segment_index: number
  bbox: BoundingBox
  crop_url: string
  pipeline_url: string
}

type ImageResponse = {
  image_id: string
  source_url: string
  segments: Segment[]
  segmentation_method: string
}

export default function UploadPage() {
  const [image, setImage] = useState<ImageResponse | null>(null)
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  async function uploadImage(formData: FormData) {
    setError('')
    setIsUploading(true)
    try {
      const response = await fetch(`${API_BASE}/api/v1/images`, {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {
        throw new Error(await response.text())
      }
      setImage((await response.json()) as ImageResponse)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  async function nudgeFirstBox() {
    if (!image || image.segments.length === 0) {
      return
    }

    const [firstSegment] = image.segments
    const response = await fetch(
      `${API_BASE}/api/v1/images/${image.image_id}/segments`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          segments: [
            {
              segment_index: firstSegment.segment_index,
              bbox: {
                ...firstSegment.bbox,
                x: firstSegment.bbox.x + 4,
                y: firstSegment.bbox.y + 4,
              },
            },
          ],
          deleted_segments: [],
        }),
      },
    )

    if (response.ok) {
      setImage((await response.json()) as ImageResponse)
    }
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border-border/70 bg-card rounded-3xl border p-6 shadow-sm">
          <div className="text-muted-foreground inline-flex items-center gap-2 text-xs tracking-[0.24em] uppercase">
            <Layers3 className="size-3.5" />
            Upload flow
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Upload plates, inspect boxes, edit before retrieval.
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-6">
            Backend stores each source image, runs segmentation, serves crop
            artifacts, and accepts bounding-box edits for downstream feature
            extraction.
          </p>

          <form
            className="mt-6 flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              void uploadImage(new FormData(event.currentTarget))
            }}
          >
            <label className="text-sm font-medium" htmlFor="image">
              Plate image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              required
              onChange={(event) =>
                setFileName(event.currentTarget.files?.[0]?.name ?? '')
              }
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                className="border-border rounded-xl border px-3 py-2"
                name="strain"
                placeholder="strain"
              />
              <input
                className="border-border rounded-xl border px-3 py-2"
                name="media"
                placeholder="media"
              />
              <select
                className="border-border rounded-xl border px-3 py-2"
                name="method"
                defaultValue="kmeans"
              >
                <option value="kmeans">kmeans</option>
                <option value="contour">contour</option>
              </select>
            </div>
            <Button className="gap-2" disabled={isUploading} type="submit">
              <ImageUp className="size-4" />
              {isUploading ? 'Uploading...' : `Segment ${fileName || 'image'}`}
            </Button>
            {error ? <p className="text-destructive text-sm">{error}</p> : null}
          </form>
        </div>

        <div className="border-border bg-card rounded-3xl border p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Editable bounding boxes</h2>
              <p className="text-muted-foreground text-sm">
                {image
                  ? `${image.segments.length} ${image.segmentation_method} boxes`
                  : 'Upload image to preview overlays'}
              </p>
            </div>
            <Button
              onClick={() => void nudgeFirstBox()}
              disabled={!image}
              variant="outline"
              className="gap-2"
            >
              <PencilRuler className="size-4" />
              Nudge box
            </Button>
          </div>

          <div className="bg-muted relative aspect-square overflow-hidden rounded-2xl">
            {image ? (
              <>
                <img
                  className="size-full object-cover"
                  src={`${API_BASE}${image.source_url}`}
                  alt="Uploaded plate"
                />
                {image.segments.map((segment) => (
                  <div
                    key={segment.segment_id}
                    className="absolute border-2 border-emerald-400 bg-emerald-400/10 text-xs font-semibold text-emerald-950"
                    style={{
                      left: `${(segment.bbox.x / 256) * 100}%`,
                      top: `${(segment.bbox.y / 256) * 100}%`,
                      width: `${(segment.bbox.w / 256) * 100}%`,
                      height: `${(segment.bbox.h / 256) * 100}%`,
                    }}
                  >
                    {segment.segment_index}
                  </div>
                ))}
              </>
            ) : (
              <div className="text-muted-foreground flex size-full flex-col items-center justify-center gap-3 text-sm">
                <RotateCcw className="size-8" />
                Waiting for segmentation
              </div>
            )}
          </div>

          {image ? (
            <div className="mt-4 grid gap-2">
              {image.segments.map((segment) => (
                <a
                  className="border-border flex items-center justify-between rounded-xl border px-3 py-2 text-sm"
                  href={`${API_BASE}${segment.crop_url}`}
                  key={segment.segment_id}
                >
                  segment_{segment.segment_index}.jpg
                  <ArrowRight className="size-4" />
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </section>
      <RouteSummary />
    </div>
  )
}
