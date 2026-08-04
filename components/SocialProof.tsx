const stats = [
  { value: "2,400+", label: "templates shipped" },
  { value: "4.9/5", label: "avg. buyer rating" },
  { value: "37", label: "countries reached" },
];

export default function SocialProof() {
  return (
    <section className="bg-market-surface border-b border-market-border">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="border-l-2 border-market-accent pl-4">
              <p className="text-market-text font-bold text-2xl">
                {stat.value}
              </p>
              <p className="text-market-muted text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
