import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="bg-ink-2/40">
      <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-blueprint mb-3">
            05 / STAY IN THE LOOP
          </p>
          <h3 className="font-display text-2xl text-paper mb-2">
            One email a month. New templates, no fluff.
          </h3>
          <NewsletterForm />
        </div>

        <div className="text-slate text-sm">
          <p>Foundry © {new Date().getFullYear()}</p>
          <p className="mt-1">Built for founders who ship.</p>
        </div>
      </div>
    </footer>
  );
}
