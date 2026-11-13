import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router';
import { marathax_about } from 'virtual:content';
import MarathaxLayout from '@/components/marathax/MarathaxLayout';

export default function MarathaxAboutPage() {
  return (
    <MarathaxLayout>
      <Helmet>
        <title>About MARATHAX — India's Military-Style Fitness Challenge</title>
        <meta name="description" content="MARATHAX is India's premier military-style fitness challenge. Built on strength, endurance, speed and mental toughness. Discover the story behind the challenge." />
        <link rel="canonical" href="https://marathax.in/about" />
        <meta property="og:title" content="About MARATHAX — India's Military-Style Fitness Challenge" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://marathax.in/about" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main>
        {/* ── HERO ── */}
        <section className="relative pt-40 pb-24 overflow-hidden">
          <img
            src="/airo-assets/images/marathax/about-hero"
            alt="Military fitness training"
            className="absolute inset-0 w-full h-full object-cover"
            fetchPriority="high"
            loading="eager"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-background pointer-events-none" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p
              className="text-primary text-xs font-bold uppercase tracking-widest mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {marathax_about.hero.eyebrow}
            </p>
            <h1
              className="text-white font-black uppercase leading-none mb-6"
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(3rem, 8vw, 6rem)', letterSpacing: '-0.03em' }}
            >
              {marathax_about.hero.title}
            </h1>
            <p className="text-white/80 text-base sm:text-xl max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-sans)' }}>
              {marathax_about.hero.body}
            </p>
          </div>
        </section>

        {/* ── MISSION ── */}
        <section className="bg-background py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p
                  className="text-primary text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  <span className="inline-block w-8 h-px bg-primary" />
                  {marathax_about.mission.eyebrow}
                </p>
                <h2
                  className="text-foreground font-black uppercase leading-tight mb-6"
                  style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}
                >
                  {marathax_about.mission.title}
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
                  {marathax_about.mission.body}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {marathax_about.values.map((val) => (
                  <div
                    key={val.id}
                    className="bg-card border border-border rounded-lg p-5 text-center hover:border-primary/40 transition-colors"
                  >
                    <span
                      className="text-sm font-black text-foreground uppercase tracking-widest"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {val.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FOUR PILLARS ── */}
        <section className="bg-card border-y border-border py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2
                className="text-foreground font-black uppercase leading-tight"
                style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}
              >
                THE FOUR PILLARS
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {marathax_about.pillars.map((pillar, i) => (
                <div key={pillar.id} className="relative bg-background border border-border rounded-lg p-8 overflow-hidden">
                  <div
                    className="absolute top-0 left-0 right-0 h-1 bg-primary"
                    style={{ opacity: 0.3 + i * 0.2 }}
                  />
                  <div
                    className="text-5xl font-black text-primary/10 mb-4 leading-none"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3
                    className="text-foreground font-black uppercase text-lg mb-3"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {pillar.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
                    {pillar.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MILITARY SPIRIT ── */}
        <section className="bg-background py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p
              className="text-primary text-xs font-bold uppercase tracking-widest mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {marathax_about.military.eyebrow}
            </p>
            <h2
              className="text-foreground font-black uppercase leading-tight mb-8"
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              {marathax_about.military.title}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-12 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-sans)' }}>
              {marathax_about.military.body}
            </p>
            <blockquote className="border-l-4 border-primary pl-6 text-left max-w-xl mx-auto">
              <p
                className="text-foreground text-xl sm:text-2xl font-black uppercase italic mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                "{marathax_about.military.quote}"
              </p>
              <cite className="text-primary text-xs font-bold uppercase tracking-widest not-italic" style={{ fontFamily: 'var(--font-heading)' }}>
                — {marathax_about.military.quoteAuthor}
              </cite>
            </blockquote>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-primary py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2
              className="text-white font-black uppercase leading-tight mb-6"
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              READY TO PROVE YOURSELF?
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-primary font-black text-sm uppercase tracking-widest rounded hover:bg-white/90 transition-colors"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Register Now
              </Link>
              <Link
                to="/event-format"
                className="px-8 py-4 border-2 border-white text-white font-bold text-sm uppercase tracking-widest rounded hover:bg-white/10 transition-colors"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                See the Format
              </Link>
            </div>
          </div>
        </section>
      </main>
    </MarathaxLayout>
  );
}
