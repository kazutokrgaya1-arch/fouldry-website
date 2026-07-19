"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setStatus(error ? "error" : "sent");
  }

  return (
    <main className="min-h-screen bg-ink bg-blueprint bg-grid flex items-center justify-center px-6">
      <div className="w-full max-w-sm border border-line bg-ink-2/60 backdrop-blur p-8 rounded-lg">
        <p className="font-mono text-xs tracking-[0.2em] text-blueprint mb-2">
          03 / ACCESS
        </p>
        <h1 className="font-display text-2xl text-paper mb-1">
          Log in to your dashboard
        </h1>
        <p className="text-slate text-sm mb-6">
          No password needed. We&rsquo;ll email you a one-time link.
        </p>

        {status === "sent" ? (
          <div className="border border-blueprint/30 bg-blueprint/5 rounded-md p-4 text-sm text-paper">
            Check <span className="text-blueprint">{email}</span> for your
            sign-in link. It expires in 1 hour.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md bg-ink border border-line px-4 py-3 text-paper placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-blueprint"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-md bg-brass text-ink font-semibold py-3 hover:bg-brass/90 transition disabled:opacity-60"
            >
              {status === "sending" ? "Sending link…" : "Send magic link"}
            </button>
            {status === "error" && (
              <p className="text-sm text-red-400">
                Something went wrong. Try again in a moment.
              </p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
