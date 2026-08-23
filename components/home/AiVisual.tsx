const nodes = [
  "Strategy",
  "Data",
  "Workflow",
  "AI",
  "Customer",
  "Scale",
];

export function AiVisual() {
  return (
    <div className="group relative min-h-[360px] overflow-hidden rounded-lg border border-white/10 bg-secondary p-6 shadow-2xl shadow-primary/15 transition duration-300 hover:border-accent/30 hover:shadow-primary/25">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.22),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(37,99,235,0.18),transparent_30%)] transition duration-500 group-hover:scale-105 group-hover:opacity-90" />
      <div className="pointer-events-none absolute inset-6 rounded-lg border border-accent/10 opacity-0 transition duration-500 group-hover:opacity-100" />

      <div className="relative grid h-full min-h-[308px] grid-cols-2 gap-4 sm:grid-cols-3">
        {nodes.map((node, index) => (
          <div
            key={node}
            className="animate-card-float rounded-md border border-white/10 bg-white/[0.06] p-4 text-white shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:border-accent/45 hover:bg-white/[0.1] hover:shadow-lg hover:shadow-accent/10 motion-reduce:transform-none"
            style={{ animationDelay: `${index * 110}ms` }}
          >
            <div className="mb-4 h-2 w-10 rounded-full bg-accent transition duration-300 hover:w-12" />
            <p className="text-sm font-semibold">{node}</p>
            <div className="mt-5 space-y-2">
              <span className="block h-1.5 rounded-full bg-white/25 transition duration-300 group-hover:bg-white/35" />
              <span className="block h-1.5 w-2/3 rounded-full bg-white/15 transition duration-300 group-hover:bg-accent/25" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
