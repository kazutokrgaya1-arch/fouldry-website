"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "done" : "error");
      if (res.ok) setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="text-sm text-market-accent font-medium">
        You&rsquo;re on the list. Watch your inbox.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-sm">
      <input
        type="email"
        required
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-md bg-white border border-market-border px-4 py-2.5 text-sm text-market-text placeholder:text-market-muted focus:outline-none focus:ring-2 focus:ring-market-accent"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-md bg-market-accent hover:bg-market-accent-dark text-white text-sm font-semibold px-4 py-2.5 transition disabled:opacity-60 whitespace-nowrap"
      >
        {status === "loading" ? "Joining…" : "Get updates"}
      </button>
    </form>
  );
}
