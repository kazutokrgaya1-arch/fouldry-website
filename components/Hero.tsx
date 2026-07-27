export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="absolute inset-0 bg-blueprint bg-grid opacity-100" />
      {/* corner registration marks — drafting-table detail */}
      <div className="absolute top-6 left-6 w-4 h-4 border-l border-t border-blueprint/40" />
      <div className="absolute top-6 right-6 w-4 h-4 border-r border-t border-blueprint/40" />

      <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-24">
        <p className="font-mono text-xs tracking-[0.2em] text-blueprint mb-6">
          01 / SPECIFICATION
        </p>
        <h1 className="font-display text-5xl md:text-6xl leading-[1.05] text-paper max-w-3xl">
          Premium website templates, drafted like blueprints —
          <span className="text-blueprint"> built to launch, not to tinker with.</span>
        </h1>
        <p className="mt-6 text-slate text-lg max-w-xl">
          Fully coded HTML/CSS/JS templates for coffee shops, portfolios,
          SaaS products, restaurants, and gyms. Drop them in and ship this
          weekend — no design work, no guesswork.
        </p>

        <div className="mt-10 flex items-center gap-4">
          <a
            href="#pricing"
            className="rounded-md bg-brass text-ink font-semibold px-6 py-3 hover:bg-brass/90 transition"
          >
            Browse templates
          </a>
          <a
            href="#faq"
            className="text-sm text-slate hover:text-paper transition"
          >
            How it works →
          </a>
        </div>

        {/* dimension-line signature: reads like a measurement on a drawing */}
        <div className="mt-16 flex items-center gap-3 font-mono text-xs text-slate max-w-md">
          <span>⊢</span>
          <div className="flex-1 border-t border-slate/40" />
          <span className="text-blueprint">5 templates, 100% HTML/CSS/JS</span>
          <div className="flex-1 border-t border-slate/40" />
          <span>⊣</span>
        </div>
      </div>
    </section>
  );
}
