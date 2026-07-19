import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DownloadButton from "@/components/DownloadButton";

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: purchases } = await supabase
    .from("purchases")
    .select("id, created_at, status, products(name, slug, file_path, description)")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-ink bg-blueprint bg-grid px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs tracking-[0.2em] text-blueprint mb-2">
          04 / DASHBOARD
        </p>
        <h1 className="font-display text-3xl text-paper mb-1">
          Welcome back
        </h1>
        <p className="text-slate mb-10">{user.email}</p>

        {!purchases || purchases.length === 0 ? (
          <div className="border border-line rounded-lg p-8 text-center">
            <p className="text-paper mb-2">Nothing here yet.</p>
            <p className="text-slate text-sm">
              Once you buy a template, it will show up here instantly,
              ready to download.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase: any) => (
              <div
                key={purchase.id}
                className="flex items-center justify-between border border-line rounded-lg p-6 bg-ink-2/40"
              >
                <div>
                  <h2 className="font-display text-lg text-paper">
                    {purchase.products?.name}
                  </h2>
                  <p className="text-slate text-sm mt-1">
                    {purchase.products?.description}
                  </p>
                  <p className="font-mono text-xs text-slate mt-2">
                    Purchased{" "}
                    {new Date(purchase.created_at).toLocaleDateString()}
                  </p>
                </div>
                <DownloadButton filePath={purchase.products?.file_path} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
