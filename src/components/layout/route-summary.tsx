import { appRoutes } from '@/lib/routes'

export function RouteSummary() {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {appRoutes.map((route) => (
        <article key={route.path} className="border-border/70 bg-card rounded-2xl border p-4 shadow-sm">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{route.role}</div>
          <div className="mt-2 text-xs text-muted-foreground">{route.path}</div>
          <h2 className="font-semibold">{route.label}</h2>
          <p className="text-sm text-muted-foreground">{route.description}</p>
        </article>
      ))}
    </section>
  )
}
