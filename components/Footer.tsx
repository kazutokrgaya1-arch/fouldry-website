import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="bg-market-surface border-t border-market-border">
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h3 className="text-market-text font-bold text-lg mb-2">
            New templates, one email a month.
          </h3>
          <NewsletterForm />
        </div>

        <div className="text-market-muted text-sm">
          <p>Foundry © {new Date().getFullYear()}</p>
          <p className="mt-1">Website templates for founders who ship.</p>
        </div>
      </div>
    </footer>
  );
}
