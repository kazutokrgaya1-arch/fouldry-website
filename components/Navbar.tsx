import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-market-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        <Link href="/" className="text-market-text font-bold text-xl shrink-0">
          Foundry
        </Link>

        <div className="flex-1 max-w-2xl">
          <div className="flex items-center bg-market-surface border border-market-border rounded-md overflow-hidden">
            <input
              type="text"
              placeholder="Search templates: coffee shop, portfolio, gym..."
              className="flex-1 px-4 py-2 text-sm bg-transparent text-market-text placeholder:text-market-muted focus:outline-none"
            />
            <button
              aria-label="Search"
              className="bg-market-accent hover:bg-market-accent-dark transition px-4 py-2.5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>
        </div>

        <Link
          href="/login"
          className="shrink-0 text-market-text text-sm font-medium border border-market-border rounded-md px-4 py-2 hover:bg-market-surface transition"
        >
          Log in
        </Link>
      </div>

      {/* category chip row */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 overflow-x-auto border-t border-market-border">
        {["All templates", "Coffee Shop", "Portfolio", "SaaS", "Restaurant", "Gym"].map(
          (cat, i) => (
            <a
              key={cat}
              href="#pricing"
              className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full transition ${
                i === 0
                  ? "bg-market-accent text-white"
                  : "text-market-muted hover:bg-market-surface"
              }`}
            >
              {cat}
            </a>
          )
        )}
      </div>
    </nav>
  );
}
