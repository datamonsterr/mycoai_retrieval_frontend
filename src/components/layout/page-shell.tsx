export function PageShell({ title, description }: { title: string; description: string }) {
  return (
    <section className="border-border/70 bg-card rounded-3xl border p-6 shadow-sm">
      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Route module</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
    </section>
  )
}
