import { RouteSummary } from '@/components/layout/route-summary'

export default function UploadPage() {
  return (
    <div className="space-y-6">
      <section className="border-border/70 bg-card rounded-3xl border p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Upload flow</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">Single + batch image intake</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          ImageDropzone, metadata selectors, batch preview, and job polling boundaries are ready for API integration.
        </p>
      </section>
      <RouteSummary />
    </div>
  )
}
