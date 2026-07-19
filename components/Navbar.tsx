import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-line">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-lg tracking-tight text-paper">
          Foundry<span className="text-blueprint">.</span>
        </Link>
        <div className="flex items-center gap-6">
          <a href="#pricing" className="text-sm text-slate hover:text-paper transition">
            Pricing
          </a>
          <a href="#faq" className="text-sm text-slate hover:text-paper transition">
            FAQ
          </a>
          <Link
            href="/login"
            className="text-sm font-mono border border-line rounded-md px-4 py-2 text-paper hover:border-blueprint transition"
          >
            Log in
          </Link>
        </div>
      </div>
    </nav>
  );
}
