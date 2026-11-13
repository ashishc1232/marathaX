interface Partner {
  id: string;
  name: string;
}

interface PartnersMarqueeProps {
  label: string;
  logos: Partner[];
}

export default function PartnersMarquee({ label, logos }: PartnersMarqueeProps) {
  const doubled = [...logos, ...logos];

  return (
    <section className="bg-background py-10 overflow-hidden border-y border-border">
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground text-center">{label}</p>
      </div>
      <div className="relative">
        <div className="flex gap-10 mb-5" style={{ animation: 'marquee 30s linear infinite' }}>
          {doubled.map((p, i) => (
            <div
              key={i}
              className="flex-shrink-0 px-6 py-3 border border-border rounded-lg min-w-[140px] flex items-center justify-center"
            >
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                {p.name}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-10" style={{ animation: 'marquee 25s linear infinite reverse' }}>
          {doubled.map((p, i) => (
            <div
              key={i}
              className="flex-shrink-0 px-6 py-3 border border-border rounded-lg min-w-[140px] flex items-center justify-center"
            >
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
