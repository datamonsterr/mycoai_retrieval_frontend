import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

export function Lightbox({
  src,
  alt,
  caption,
  onClose,
}: {
  src: string
  alt: string
  caption: string
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={caption}
      onClick={onClose}
    >
      <div
        className="relative max-h-full max-w-4xl overflow-hidden rounded-2xl bg-background shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={cn(
            'absolute right-3 top-3 rounded-full bg-background/90 p-2 text-foreground shadow',
            'transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50'
          )}
          onClick={onClose}
          aria-label="Close image preview"
        >
          <X className="size-4" />
        </button>
        <img src={src} alt={alt} className="max-h-[80vh] w-full object-contain" />
        <p className="border-t border-border/70 px-4 py-3 text-sm text-muted-foreground">
          {caption}
        </p>
      </div>
    </div>
  )
}
