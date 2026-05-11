import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

import { cn } from '@/lib/utils'

type Props = {
  className?: string
  onFilesAccepted: (files: File[]) => void
  maxFiles?: number
  accept?: Record<string, string[]>
}

export function FileDropzone({
  className,
  onFilesAccepted,
  maxFiles = 10,
  accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
}: Props) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length > 0) {
        onFilesAccepted(accepted)
      }
    },
    [onFilesAccepted],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    accept,
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-border bg-muted hover:bg-muted/80 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors',
        isDragActive && 'border-primary bg-primary/10',
        className,
      )}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-muted-foreground text-sm">Drop images here</p>
      ) : (
        <p className="text-muted-foreground text-sm">
          Drag and drop images here, or click to select files
        </p>
      )}
    </div>
  )
}
