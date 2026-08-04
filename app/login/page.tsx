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
    <main className="min-h-screen bg-market-surface flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white border border-market-border p-8 rounded-lg">
        <h1 className="font-bold text-2xl text-market-text mb-1">
          Log in to your account
        </h1>
        <p className="text-market-muted text-sm mb-6">
          No password needed. We&rsquo;ll email you a one-time link.
        </p>

        {status === "sent" ? (
          <div className="border border-market-accent/30 bg-market-accent/5 rounded-md p-4 text-sm text-market-text">
            Check <span className="text-market-accent font-medium">{email}</span>{" "}
            for your sign-in link. It expires in 1 hour.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md bg-white border border-market-border px-4 py-3 text-market-text placeholder:text-market-muted focus:outline-none focus:ring-2 focus:ring-market-accent"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-md bg-market-accent hover:bg-market-accent-dark text-white font-semibold py-3 transition disabled:opacity-60"
            >
              {status === "sending" ? "Sending link…" : "Send magic link"}
            </button>
            {status === "error" && (
              <p className="text-sm text-red-500">
                Something went wrong. Try again in a moment.
              </p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
