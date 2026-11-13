import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router';
import { marathax_categories } from 'virtual:content';
import MarathaxLayout from '@/components/marathax/MarathaxLayout';

const hFont = { fontFamily: 'var(--font-heading)' } as const;
const bFont = { fontFamily: 'var(--font-sans)' } as const;

// Rank styling — gold / silver / bronze / plain
const rankStyle: Record<number, { label: string; labelColor: string; amountColor: string; border: string; bg: string }> = {
  1: { label: '🥇 1st Place', labelColor: 'text-yellow-400',       amountColor: 'text-yellow-400', border: 'border-yellow-400/40', bg: 'bg-yellow-400/5' },
  2: { label: '🥈 2nd Place', labelColor: 'text-slate-300',        amountColor: 'text-slate-300',  border: 'border-slate-400/30',  bg: 'bg-slate-400/5'  },
  3: { label: '🥉 3rd Place', labelColor: 'text-amber-500',        amountColor: 'text-amber-500',  border: 'border-amber-500/30',  bg: 'bg-amber-500/5'  },
  4: { label: '4th Place',    labelColor: 'text-muted-foreground',  amountColor: 'text-foreground', border: 'border-border',        bg: 'bg-card'         },
  5: { label: '5th Place',    labelColor: 'text-muted-foreground',  amountColor: 'text-foreground', border: 'border-border',        bg: 'bg-card'         },
};

export default function MarathaxCategoriesPage() {
  return (
    <MarathaxLayout>
      <Helmet>
        <title>Categories & Prizes — MARATHAX | ₹3 Lakh+ Prize Pool</title>
        <meta name="description" content="MARATHAX categories and prizes. Male/Female Open (3 age groups), Doubles, Rising Star. Total prize pool ₹3 Lakh+. Athlete of the Tournament: Elite Running Shoes ₹20,000+." />
        <link rel="canonical" href="https://marathax.in/categories-prizes" />
        <meta property="og:title" content="Categories & Prizes — MARATHAX | ₹3 Lakh+ Prize Pool" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://marathax.in/categories-prizes" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main>
        {/* ── HERO ── */}
        <section className="bg-background pt-40 pb-20 border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-4" style={hFont}>
              {marathax_categories.hero.eyebrow}
            </p>
            <h1
              className="text-foreground font-black uppercase leading-none mb-6"
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(3rem, 8vw, 6rem)', letterSpacing: '-0.03em' }}
            >
              {marathax_categories.hero.title}
            </h1>
            <p className="text-muted-foreground text-base sm:text-xl max-w-2xl mx-auto" style={bFont}>
              {marathax_categories.hero.body}
            </p>
          </div>
        </section>

        {/* ── TOTAL PRIZE POOL BANNER ── */}
        <section className="bg-primary py-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 text-center">
            <div>
              <p className="text-white/70 text-xs uppercase tracking-widest font-bold mb-1" style={hFont}>Total Prize Pool</p>
              <p className="text-white font-black" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                {marathax_categories.totalPool}
              </p>
            </div>
            <div className="w-px h-12 bg-white/20 hidden sm:block" />
            <div>
              <p className="text-white/70 text-xs uppercase tracking-widest font-bold mb-1" style={hFont}>Event Date</p>
              <p className="text-white font-black text-2xl sm:text-3xl" style={hFont}>{marathax_categories.eventDate}</p>
            </div>
          </div>
        </section>

        {/* ── ALL PRIZE SECTIONS ── */}
        <section className="bg-background py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

            {/* ── OPEN CATEGORIES ── */}
            <div>
              <div className="flex items-center gap-4 mb-7">
                <div className="h-px flex-1 bg-border" />
                <h2 className="text-primary font-black uppercase tracking-widest text-sm px-2" style={hFont}>
                  {marathax_categories.openSection.title}
                </h2>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="space-y-5">
                {marathax_categories.openSection.rows.map((row) => (
                  <div key={row.id} className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-background">
                      <span className="text-foreground font-black uppercase text-base" style={hFont}>{row.category}</span>
                      <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-wider" style={hFont}>{row.ageGroup}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-4">
                      {([
                        { rank: 1, amount: row.p1 },
                        { rank: 2, amount: row.p2 },
                        { rank: 3, amount: row.p3 },
                        { rank: 4, amount: row.p4 },
                        { rank: 5, amount: row.p5 },
                      ] as { rank: number; amount: string }[]).map(({ rank, amount }) => {
                        const s = rankStyle[rank];
                        return (
                          <div key={rank} className={`rounded-lg border ${s.border} ${s.bg} p-3 text-center`}>
                            <div className={`text-xs font-bold mb-2 ${s.labelColor}`} style={hFont}>{s.label}</div>
                            <div className={`font-black text-sm sm:text-base leading-tight ${s.amountColor}`} style={hFont}>{amount}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── DOUBLES ── */}
            <div>
              <div className="flex items-center gap-4 mb-7">
                <div className="h-px flex-1 bg-border" />
                <h2 className="text-primary font-black uppercase tracking-widest text-sm px-2" style={hFont}>
                  {marathax_categories.doublesSection.title}
                </h2>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="space-y-5">
                {marathax_categories.doublesSection.rows.map((row) => (
                  <div key={row.id} className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-background">
                      <span className="text-foreground font-black uppercase text-base" style={hFont}>{row.category}</span>
                      <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-wider" style={hFont}>{row.ageGroup}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-4">
                      {([
                        { rank: 1, amount: row.p1 },
                        { rank: 2, amount: row.p2 },
                        { rank: 3, amount: row.p3 },
                        { rank: 4, amount: row.p4 },
                        { rank: 5, amount: row.p5 },
                      ] as { rank: number; amount: string }[]).map(({ rank, amount }) => {
                        const s = rankStyle[rank];
                        return (
                          <div key={rank} className={`rounded-lg border ${s.border} ${s.bg} p-3 text-center`}>
                            <div className={`text-xs font-bold mb-2 ${s.labelColor}`} style={hFont}>{s.label}</div>
                            <div className={`font-black text-sm sm:text-base leading-tight ${s.amountColor}`} style={hFont}>{amount}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RISING STAR — kid-themed ── */}
            <div>
              <div className="flex items-center gap-4 mb-7">
                <div className="h-px flex-1 bg-border" />
                <h2 className="text-primary font-black uppercase tracking-widest text-sm px-2" style={hFont}>
                  {marathax_categories.risingStarSection.title}
                </h2>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Kid hero banner */}
              <div className="relative rounded-2xl overflow-hidden mb-6 border border-primary/30 shadow-xl">
                <img
                  src="/airo-assets/images/marathax/rising-star-kids"
                  alt="Kids competing at MARATHAX Rising Star"
                  className="w-full h-56 sm:h-72 object-cover object-center"
                  loading="lazy"
                  style={{ filter: 'contrast(1.1) brightness(1.05) saturate(1.1)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent pointer-events-none" />
                <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12">
                  <span className="inline-block bg-primary text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4 w-fit" style={hFont}>
                    Ages 8–15
                  </span>
                  <h3
                    className="text-white font-black uppercase leading-tight mb-3"
                    style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
                  >
                    Rising Star
                  </h3>
                  <p className="text-white/80 text-sm max-w-sm leading-relaxed" style={bFont}>
                    Built for the next generation of champions. Kids aged 8–15 compete in a scaled format designed for young athletes.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {marathax_categories.risingStarSection.rows.map((row) => (
                  <div key={row.id} className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-background">
                      <span className="text-foreground font-black uppercase text-base" style={hFont}>{row.category}</span>
                      <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-wider" style={hFont}>{row.ageGroup}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-4">
                      {([
                        { rank: 1, amount: row.p1 },
                        { rank: 2, amount: row.p2 },
                        { rank: 3, amount: row.p3 },
                        { rank: 4, amount: row.p4 },
                        { rank: 5, amount: row.p5 },
                      ] as { rank: number; amount: string }[]).map(({ rank, amount }) => {
                        const s = rankStyle[rank];
                        return (
                          <div key={rank} className={`rounded-lg border ${s.border} ${s.bg} p-3 text-center`}>
                            <div className={`text-xs font-bold mb-2 ${s.labelColor}`} style={hFont}>{s.label}</div>
                            <div className={`font-black text-sm sm:text-base leading-tight ${s.amountColor}`} style={hFont}>{amount}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="bg-card border border-border rounded-lg p-5 text-center">
              <p className="text-sm text-muted-foreground" style={bFont}>{marathax_categories.note}</p>
            </div>
          </div>
        </section>

        {/* ── ATHLETE OF THE TOURNAMENT ── */}
        <section className="bg-card border-y border-border py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-4" style={hFont}>
              {marathax_categories.aot.eyebrow}
            </p>
            <h2
              className="text-foreground font-black uppercase leading-tight mb-6"
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              {marathax_categories.aot.title}
            </h2>
            <p className="text-muted-foreground text-base mb-10 max-w-xl mx-auto" style={bFont}>
              {marathax_categories.aot.body}
            </p>
            <div className="relative bg-background border-2 border-primary rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
              {/* Shoe image */}
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-0">
                <div className="w-full md:w-1/2 bg-black flex items-center justify-center p-6 md:p-10">
                  <img
                    src="/airo-assets/images/marathax/prize-shoes"
                    alt="Elite Running Shoes — Athlete of the Tournament Prize"
                    className="w-full max-w-xs md:max-w-sm h-auto object-contain drop-shadow-2xl"
                    loading="lazy"
                  />
                </div>
                <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-10 text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3" style={hFont}>Elite Running Shoes</p>
                  <div className="text-4xl sm:text-5xl font-black text-primary mb-2" style={hFont}>
                    {marathax_categories.aot.prize}
                  </div>
                  <p className="text-sm text-muted-foreground mt-3" style={bFont}>Awarded to the overall Athlete of the Tournament</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-primary py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2
              className="text-white font-black uppercase leading-tight mb-6"
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              FIND YOUR CATEGORY. REGISTER TODAY.
            </h2>
            <Link
              to="/register"
              className="inline-block px-10 py-4 bg-white text-primary font-black text-sm uppercase tracking-widest rounded hover:bg-white/90 transition-colors"
              style={hFont}
            >
              Register Now
            </Link>
          </div>
        </section>
      </main>
    </MarathaxLayout>
  );
}
