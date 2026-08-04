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
    <main className="min-h-screen bg-market-surface px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-bold text-2xl text-market-text mb-1">
          My purchases
        </h1>
        <p className="text-market-muted mb-8">{user.email}</p>

        {!purchases || purchases.length === 0 ? (
          <div className="bg-white border border-market-border rounded-lg p-8 text-center">
            <p className="text-market-text mb-2 font-medium">
              Nothing here yet.
            </p>
            <p className="text-market-muted text-sm">
              Once you buy a template, it will show up here instantly,
              ready to download.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {purchases.map((purchase: any) => (
              <div
                key={purchase.id}
                className="flex items-center justify-between bg-white border border-market-border rounded-lg p-5"
              >
                <div>
                  <h2 className="font-semibold text-market-text">
                    {purchase.products?.name}
                  </h2>
                  <p className="text-market-muted text-sm mt-1">
                    {purchase.products?.description}
                  </p>
                  <p className="text-xs text-market-muted mt-2">
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
