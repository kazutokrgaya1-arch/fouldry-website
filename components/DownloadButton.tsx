"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Generates a short-lived signed URL for the private "products" storage
// bucket on click, so files are never publicly listable — only someone
// who owns a matching `purchases` row (verified server-side by RLS via
// the storage policy) can ever get a working link.
export default function DownloadButton({ filePath }: { filePath?: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    if (!filePath) return;
    setLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase.storage
      .from("products")
      .createSignedUrl(filePath, 60); // link valid for 60 seconds

    setLoading(false);

    if (error || !data) {
      alert("Couldn't generate your download link. Please try again.");
      return;
    }

    window.location.href = data.signedUrl;
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="shrink-0 rounded-md bg-brass text-ink font-semibold text-sm px-5 py-2.5 hover:bg-brass/90 transition disabled:opacity-60"
    >
      {loading ? "Preparing…" : "Download"}
    </button>
  );
}
