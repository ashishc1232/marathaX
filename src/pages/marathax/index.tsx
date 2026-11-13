import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router';
import { marathax_home } from 'virtual:content';
import MarathaxLayout from '@/components/marathax/MarathaxLayout';
import Countdown from '@/components/marathax/Countdown';

const EVENT_DATE_ISO = '2027-01-10T06:00:00.000Z';

export default function MarathaxHomePage() {
  return (
    <MarathaxLayout>
      <Helmet>
        <title>MARATHAX — India's Fittest Challenge | 10 January 2027</title>
        <meta name="description" content="MARATHAX — India's premier military-style fitness challenge. 6 running sections. 6 workout stations. ₹3,00,000+ prize pool. Register now for 10 January 2027." />
        <link rel="canonical" href="https://marathax.in/" />
        <meta property="og:title" content="MARATHAX — India's Fittest Challenge" />
        <meta property="og:description" content="6 running sections. 6 workout stations. ₹3,00,000+ prize pool. 10 January 2027." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://marathax.in/" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main>
        {/* ── HERO ── */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <img
            src="/airo-assets/images/marathax/hero-athlete"
            alt="MARATHAX athlete competing in military fitness challenge"
            className="absolute inset-0 w-full h-full object-cover"
            fetchPriority="high"
            loading="eager"
            width={1920}
            height={1080}
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-20">
            <div className="max-w-3xl">
              <p
                className="text-primary text-xs sm:text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                <span className="inline-block w-8 h-px bg-primary" />
                {marathax_home.hero.eyebrow}
              </p>
              <h1
                className="text-white font-black uppercase leading-none mb-4"
                style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(4rem, 12vw, 9rem)', letterSpacing: '-0.03em' }}
              >
                {marathax_home.hero.title}
              </h1>
              <p
                className="text-primary text-xl sm:text-2xl font-bold uppercase tracking-wide mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {marathax_home.hero.subtitle}
              </p>
              <p className="text-white/80 text-base sm:text-lg mb-8 max-w-xl" style={{ fontFamily: 'var(--font-sans)' }}>
                {marathax_home.hero.body}
              </p>

              {/* Prize badge */}
              <div className="inline-flex items-center gap-3 border border-primary/40 rounded px-4 py-3 mb-8 bg-black/40">
                <span className="text-xs text-muted-foreground uppercase tracking-widest" style={{ fontFamily: 'var(--font-heading)' }}>
                  {marathax_home.hero.prizeLabel}
                </span>
                <span
                  className="text-2xl font-black text-primary"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {marathax_home.hero.prize}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-primary text-white font-black text-sm uppercase tracking-widest rounded hover:bg-primary/90 transition-colors shadow-lg"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {marathax_home.hero.cta}
                </Link>
                <Link
                  to="/event-format"
                  className="px-8 py-4 border border-white/40 text-white font-bold text-sm uppercase tracking-widest rounded hover:border-white hover:bg-white/10 transition-colors"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {marathax_home.hero.learnMore}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── COUNTDOWN ── */}
        <section className="bg-card border-y border-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                  Event Countdown
                </p>
                <p className="text-lg font-bold text-foreground uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
                  10 January 2027
                </p>
              </div>
              <Countdown targetDateISO={EVENT_DATE_ISO} />
              <Link
                to="/register"
                className="flex-shrink-0 px-6 py-3 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded hover:bg-primary/90 transition-colors"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Secure Your Spot
              </Link>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="bg-background py-16 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {marathax_home.stats.map((stat) => (
                <div key={stat.id} className="text-center">
                  <div
                    className="text-4xl sm:text-5xl font-black text-primary mb-2"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest" style={{ fontFamily: 'var(--font-heading)' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ABOUT SECTION ── */}
        <section className="relative py-28 overflow-hidden">
          <img
            src="/airo-assets/images/marathax/about-hero"
            alt="Military fitness training"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/40 pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl">
              <p
                className="text-primary text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                <span className="inline-block w-8 h-px bg-primary" />
                {marathax_home.about.eyebrow}
              </p>
              <h2
                className="text-white font-black uppercase leading-tight mb-6"
                style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
              >
                {marathax_home.about.title}
              </h2>
              <p className="text-white/80 text-base sm:text-lg mb-8 leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
                {marathax_home.about.body}
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest hover:gap-4 transition-all"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {marathax_home.about.cta} <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── FORMAT OVERVIEW ── */}
        <section className="bg-background py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p
                className="text-primary text-xs font-bold uppercase tracking-widest mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {marathax_home.format.eyebrow}
              </p>
              <h2
                className="text-foreground font-black uppercase leading-tight mb-6"
                style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
              >
                {marathax_home.format.title}
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-sans)' }}>
                {marathax_home.format.body}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {marathax_home.format.items.map((item, i) => (
                <div key={item.id} className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary/40 transition-colors">
                  <div
                    className="text-4xl font-black text-primary/20 mb-3"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <p className="text-sm font-bold text-foreground uppercase tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/event-format"
                className="inline-block px-8 py-4 border border-border text-foreground font-bold text-sm uppercase tracking-widest rounded hover:border-primary hover:text-primary transition-colors"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {marathax_home.format.cta}
              </Link>
            </div>
          </div>
        </section>

        {/* ── PRIZES HIGHLIGHT ── */}
        <section className="bg-card border-y border-border py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p
              className="text-primary text-xs font-bold uppercase tracking-widest mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {marathax_home.prizes.eyebrow}
            </p>
            <h2
              className="text-foreground font-black uppercase leading-tight mb-12"
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            >
              {marathax_home.prizes.title}
            </h2>

            {/* AOT Card */}
            <div className="max-w-lg mx-auto bg-background border-2 border-primary rounded-lg p-8 mb-10 relative overflow-hidden">
              <div
                className="absolute top-0 left-0 right-0 h-1 bg-primary"
              />
              <p
                className="text-primary text-xs font-bold uppercase tracking-widest mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {marathax_home.prizes.aotLabel}
              </p>
              <div
                className="text-4xl sm:text-5xl font-black text-foreground mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {marathax_home.prizes.aotCash}
              </div>
              <div className="text-lg font-bold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
                {marathax_home.prizes.aotExtra}
              </div>
            </div>

            <Link
              to="/categories-prizes"
              className="inline-block px-8 py-4 bg-primary text-white font-bold text-sm uppercase tracking-widest rounded hover:bg-primary/90 transition-colors"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {marathax_home.prizes.cta}
            </Link>
          </div>
        </section>

        {/* SVG sharpening filter — used by ambassador images */}
        <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
          <defs>
            <filter id="sharpen-ambassador" color-interpolation-filters="sRGB">
              <feConvolveMatrix
                order="3"
                kernelMatrix="0 -0.3 0  -0.3 2.2 -0.3  0 -0.3 0"
                preserveAlpha="true"
              />
            </filter>
          </defs>
        </svg>

        {/* ── BRAND AMBASSADORS ── */}
        <section className="bg-card border-y border-border py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div className="text-center mb-16">
              <p
                className="text-primary text-xs font-bold uppercase tracking-widest mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Official Faces of MARATHAX
              </p>
              <h2
                className="text-foreground font-black uppercase leading-tight mb-4"
                style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}
              >
                Brand Ambassadors
              </h2>
              <p
                className="text-muted-foreground text-base max-w-xl mx-auto"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Athletes who embody the MARATHAX spirit — strength, endurance, and relentless drive.
              </p>
            </div>

            {/* Ambassador cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

              {/* Card 1 */}
              <div className="group relative overflow-hidden rounded-2xl border border-border hover:border-primary/50 transition-all duration-500 shadow-xl hover:shadow-primary/10">
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary z-10" />
                <div className="aspect-[3/4] overflow-hidden bg-card">
                  <img
                    src="/airo-assets/images/marathax/ambassador-1"
                    alt="MARATHAX Brand Ambassador"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                    fetchPriority="high"
                    style={{ 
                      filter: 'url(#sharpen-ambassador) contrast(1.12) brightness(1.04) saturate(1.15)',
                      clipPath: 'inset(0 0 12% 0)',
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-px bg-primary" />
                    <span className="text-primary text-xs font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-heading)' }}>Brand Ambassador</span>
                  </div>
                  <div className="text-white font-black uppercase leading-tight mb-1" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.2rem, 2vw, 1.6rem)' }}>MARATHAX</div>
                  <div className="text-white/60 text-xs uppercase tracking-wider" style={{ fontFamily: 'var(--font-sans)' }}>Mumbai Edition · Jan 2027</div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group relative overflow-hidden rounded-2xl border border-border hover:border-primary/50 transition-all duration-500 shadow-xl hover:shadow-primary/10">
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary z-10" />
                <div className="aspect-[3/4] overflow-hidden bg-card">
                  <img
                    src="/airo-assets/images/marathax/ambassador-2"
                    alt="MARATHAX Brand Ambassador"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                    fetchPriority="high"
                    style={{ 
                      filter: 'url(#sharpen-ambassador) contrast(1.12) brightness(1.04) saturate(1.15)',
                      clipPath: 'inset(0 0 12% 0)',
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-px bg-primary" />
                    <span className="text-primary text-xs font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-heading)' }}>Brand Ambassador</span>
                  </div>
                  <div className="text-white font-black uppercase leading-tight mb-1" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.2rem, 2vw, 1.6rem)' }}>MARATHAX</div>
                  <div className="text-white/60 text-xs uppercase tracking-wider" style={{ fontFamily: 'var(--font-sans)' }}>Mumbai Edition · Jan 2027</div>
                </div>
              </div>

              {/* Card 3 — sled push athlete, Yoddha logo removed */}
              <div className="group relative overflow-hidden rounded-2xl border border-border hover:border-primary/50 transition-all duration-500 shadow-xl hover:shadow-primary/10">
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary z-10" />
                <div className="aspect-[3/4] overflow-hidden bg-card">
                  <img
                    src="/airo-assets/images/marathax/ambassador-3"
                    alt="MARATHAX Brand Ambassador"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    style={{ filter: 'contrast(1.1) brightness(1.02) saturate(1.1)' }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-px bg-primary" />
                    <span className="text-primary text-xs font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-heading)' }}>Brand Ambassador</span>
                  </div>
                  <div className="text-white font-black uppercase leading-tight mb-1" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.2rem, 2vw, 1.6rem)' }}>MARATHAX</div>
                  <div className="text-white/60 text-xs uppercase tracking-wider" style={{ fontFamily: 'var(--font-sans)' }}>Mumbai Edition · Jan 2027</div>
                </div>
              </div>

              {/* Card 4 — Hyfit Games winners with medals */}
              <div className="group relative overflow-hidden rounded-2xl border border-border hover:border-primary/50 transition-all duration-500 shadow-xl hover:shadow-primary/10 sm:col-span-1">
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary z-10" />
                <div className="aspect-[3/4] overflow-hidden bg-card">
                  <img
                    src="/airo-assets/images/marathax/ambassador-4"
                    alt="MARATHAX Champions with medals"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    style={{ filter: 'contrast(1.1) brightness(1.02) saturate(1.1)' }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-px bg-primary" />
                    <span className="text-primary text-xs font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-heading)' }}>Champions</span>
                  </div>
                  <div className="text-white font-black uppercase leading-tight mb-1" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.2rem, 2vw, 1.6rem)' }}>MARATHAX</div>
                  <div className="text-white/60 text-xs uppercase tracking-wider" style={{ fontFamily: 'var(--font-sans)' }}>Mumbai Edition · Jan 2027</div>
                </div>
              </div>

              {/* Card 5 — Trophy presentation */}
              <div className="group relative overflow-hidden rounded-2xl border border-border hover:border-primary/50 transition-all duration-500 shadow-xl hover:shadow-primary/10 lg:col-span-2">
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary z-10" />
                <div className="aspect-[16/9] lg:aspect-[2/1] overflow-hidden bg-card">
                  <img
                    src="/airo-assets/images/marathax/ambassador-5"
                    alt="MARATHAX Trophy Presentation"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    style={{ filter: 'contrast(1.1) brightness(1.02) saturate(1.1)' }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-px bg-primary" />
                    <span className="text-primary text-xs font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-heading)' }}>Victory Moment</span>
                  </div>
                  <div className="text-white font-black uppercase leading-tight mb-1" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.2rem, 2vw, 1.6rem)' }}>MARATHAX</div>
                  <div className="text-white/60 text-xs uppercase tracking-wider" style={{ fontFamily: 'var(--font-sans)' }}>Mumbai Edition · Jan 2027</div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── MUMBAI POSTER ── */}
        <section className="bg-background py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p
                className="text-primary text-xs font-bold uppercase tracking-widest mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Coming Soon
              </p>
              <h2
                className="text-foreground font-black uppercase leading-tight"
                style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3rem)' }}
              >
                Mumbai Edition
              </h2>
            </div>
            <div className="max-w-2xl mx-auto rounded-xl overflow-hidden border border-border shadow-xl">
              <img
                src="/airo-assets/images/pages/marathax/mumbai-poster"
                alt="MARATHAX Mumbai — Are You Ready?"
                className="w-full h-auto block"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="relative py-32 overflow-hidden bg-[hsl(var(--color-surface-cta))]">
          {/* Diagonal accent lines */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-20 -left-20 w-96 h-96 border border-primary/10 rounded-full" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 border border-primary/10 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/5 rounded-full" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p
              className="text-primary text-xs font-bold uppercase tracking-widest mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {marathax_home.cta.eyebrow}
            </p>
            <h2
              className="text-white font-black uppercase leading-tight mb-6"
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '-0.02em' }}
            >
              {marathax_home.cta.title}
            </h2>
            <p className="text-white/70 text-base sm:text-lg mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
              {marathax_home.cta.body}
            </p>
            <p className="text-primary font-bold text-sm uppercase tracking-widest mb-10" style={{ fontFamily: 'var(--font-heading)' }}>
              {marathax_home.cta.date}
            </p>
            <Link
              to="/register"
              className="inline-block px-10 py-5 bg-primary text-white font-black text-base uppercase tracking-widest rounded hover:bg-primary/90 transition-colors shadow-xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {marathax_home.cta.cta}
            </Link>
          </div>
        </section>
      </main>
    </MarathaxLayout>
  );
}
