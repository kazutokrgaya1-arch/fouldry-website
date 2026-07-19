const stats = [
  { value: "2,400+", label: "templates shipped" },
  { value: "4.9/5", label: "avg. buyer rating" },
  { value: "37", label: "countries reached" },
];

export default function SocialProof() {
  return (
    <section className="border-b border-line bg-ink-2/40">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <p className="font-mono text-xs tracking-[0.2em] text-blueprint mb-8">
          02 / FIELD NOTES
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="border-l border-line pl-5">
              <p className="font-display text-3xl text-paper">{stat.value}</p>
              <p className="text-slate text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
        <p className="text-slate text-sm mt-8 italic">
          Replace this strip with real reviews, logos, or a Wall-of-Love
          embed once you have your first customers.
        </p>
      </div>
    </section>
  );
}
