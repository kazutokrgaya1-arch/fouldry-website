"use client";

import Link from "next/link";
import { useState } from "react";

const categories = ["All templates", "Coffee Shop", "Portfolio", "SaaS", "Restaurant", "Gym"];

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-market-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 sm:h-16 flex items-center gap-2 sm:gap-4">
        <Link
          href="/"
          className="text-market-text font-bold text-lg sm:text-xl shrink-0"
        >
          Foundry
        </Link>

        {/* Search bar: full width and always visible on desktop; a
            toggle-able row on mobile to save header space. */}
        <div className="hidden sm:flex flex-1 max-w-2xl">
          <div className="flex items-center w-full bg-market-surface border border-market-border rounded-md overflow-hidden">
            <input
              type="text"
              placeholder="Search templates: coffee shop, portfolio, gym..."
              className="flex-1 px-4 py-2 text-sm bg-transparent text-market-text placeholder:text-market-muted focus:outline-none"
            />
            <button
              aria-label="Search"
              className="bg-market-accent hover:bg-market-accent-dark transition px-4 py-2.5"
            >
              <SearchIcon />
            </button>
          </div>
        </div>

        {/* Mobile-only search toggle button */}
        <button
          aria-label="Toggle search"
          onClick={() => setSearchOpen((v) => !v)}
          className="sm:hidden ml-auto p-2 text-market-text"
        >
          <SearchIcon color="#1A1A1A" />
        </button>

        <Link
          href="/login"
          className="shrink-0 text-market-text text-xs sm:text-sm font-medium border border-market-border rounded-md px-3 py-1.5 sm:px-4 sm:py-2 hover:bg-market-surface transition"
        >
          Log in
        </Link>
      </div>

      {/* Mobile search row — only shown when toggled open */}
      {searchOpen && (
        <div className="sm:hidden px-4 pb-3">
          <div className="flex items-center bg-market-surface border border-market-border rounded-md overflow-hidden">
            <input
              type="text"
              autoFocus
              placeholder="Search templates..."
              className="flex-1 px-3 py-2 text-sm bg-transparent text-market-text placeholder:text-market-muted focus:outline-none"
            />
            <button
              aria-label="Search"
              className="bg-market-accent hover:bg-market-accent-dark transition px-3 py-2"
            >
              <SearchIcon />
            </button>
          </div>
        </div>
      )}

      {/* category chip row — horizontally scrollable on all sizes */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 overflow-x-auto border-t border-market-border scrollbar-none">
        {categories.map((cat, i) => (
          <a
            key={cat}
            href="#pricing"
            className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full transition whitespace-nowrap ${
              i === 0
                ? "bg-market-accent text-white"
                : "text-market-muted hover:bg-market-surface"
            }`}
          >
            {cat}
          </a>
        ))}
      </div>
    </nav>
  );
}

function SearchIcon({ color = "white" }: { color?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
