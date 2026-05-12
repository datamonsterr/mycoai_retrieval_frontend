export function PageShell({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <section className="border-border/70 bg-card rounded-3xl border p-6 shadow-sm">
      <p className="text-muted-foreground text-xs tracking-[0.24em] uppercase">
        Route module
      </p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h2>
      <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-6">
        {description}
      </p>
    </section>
  )
}
