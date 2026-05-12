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
        className="bg-background relative max-h-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={cn(
            'bg-background/90 text-foreground absolute top-3 right-3 rounded-full p-2 shadow',
            'hover:bg-muted focus-visible:ring-ring/50 transition-colors focus-visible:ring-2 focus-visible:outline-none',
          )}
          onClick={onClose}
          aria-label="Close image preview"
        >
          <X className="size-4" />
        </button>
        <img
          src={src}
          alt={alt}
          className="max-h-[80vh] w-full object-contain"
        />
        <p className="border-border/70 text-muted-foreground border-t px-4 py-3 text-sm">
          {caption}
        </p>
      </div>
    </div>
  )
}
