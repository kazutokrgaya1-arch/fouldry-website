export default function Hero() {
  return (
    <section className="bg-market-bg border-b border-market-border">
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-market-accent text-sm font-semibold mb-2">
            Website Templates Sale
          </p>
          <h1 className="text-market-text font-bold text-3xl md:text-4xl leading-tight">
            Every template,{" "}
            <span className="text-market-accent">₱499</span> — build your
            site this weekend
          </h1>
          <p className="text-market-muted text-sm mt-2 max-w-md">
            Fully coded HTML/CSS/JS. No design work, no waiting — download
            instantly after checkout.
          </p>
        </div>
        <a
          href="#pricing"
          className="shrink-0 bg-market-accent hover:bg-market-accent-dark text-white font-bold px-8 py-3 rounded-md transition"
        >
          Shop templates
        </a>
      </div>
    </section>
  );
}
