import { useState, useEffect } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router';
import { home } from 'virtual:content';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(targetDate: string): TimeLeft {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const eventImages: Record<string, string> = {
  DELHI: '/airo-assets/images/pages/home/delhi-venue',
  GUJARAT: '/airo-assets/images/pages/home/gujarat-venue',
  HYDERABAD: '/airo-assets/images/pages/home/hyderabad-venue',
};

export default function HomePage() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(home.announcement.targetDate));
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(home.announcement.targetDate)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <>
      <Helmet>
        <title>Hyfit Games — India's Hybrid Fitness Race</title>
        <meta
          name="description"
          content="Hyfit Games — India's hybrid fitness race. 6 functional stations. 1 cognitive challenge. 200m runs. Open to ages 8 to 84."
        />
        <link rel="canonical" href="https://hyfitgames.com/" />
        <meta property="og:title" content="Hyfit Games — India's Hybrid Fitness Race" />
        <meta property="og:description" content="6 functional stations. 1 cognitive challenge. 200m runs. Open to ages 8 to 84." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hyfitgames.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="apple-touch-icon" href="/assets/other/f5f6c47d59b0db59d7a4e469ff088016.ico" type="image/png" sizes="180x180" />
      </Helmet>

      {/* ── ANNOUNCEMENT BAR ── */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-black h-10 flex items-center justify-center px-4">
        <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-center">
          <span>{home.announcement.text}</span>
          {' '}&bull;{' '}
          <span>
            {pad(timeLeft.days)} d : {pad(timeLeft.hours)} h : {pad(timeLeft.minutes)} m : {pad(timeLeft.seconds)} s
          </span>
          {' '}&bull;{' '}
          <Link to="/find-your-race" className="underline hover:no-underline font-black">
            {home.announcement.cta}
          </Link>
        </p>
      </div>

      {/* ── HEADER ── */}
      <header
        className={`fixed left-0 right-0 z-40 transition-colors duration-300 ${
          scrolled ? 'bg-background/95 backdrop-blur-sm border-b border-border' : 'bg-transparent'
        }`}
        style={{ top: '40px' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="flex-shrink-0">
              <img
                src="/airo-assets/images/logo/horizontal"
                alt="Hyfit Games"
                className="block h-auto max-h-10 md:max-h-12 w-auto max-w-[160px] object-contain"
              />
            </Link>

            <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-6">
              <Link to="/about" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors uppercase tracking-wide">About</Link>
              <Link to="/race-format" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors uppercase tracking-wide">Race Format</Link>
              <Link to="/journal" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors uppercase tracking-wide">Journal</Link>
              <Link to="/become-a-judge" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors uppercase tracking-wide">Become a Judge</Link>
              <Link to="/faq" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors uppercase tracking-wide">FAQ</Link>
            </nav>

            <div className="hidden lg:flex">
              <Link
                to="/find-your-race"
                className="px-5 py-2 rounded-full bg-primary text-black font-bold text-sm uppercase tracking-wide hover:bg-primary/90 transition-colors"
              >
                Find Your Race
              </Link>
            </div>

            <button
              className="lg:hidden text-foreground p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className="block w-6 h-0.5 bg-current mb-1.5" />
              <span className="block w-6 h-0.5 bg-current mb-1.5" />
              <span className="block w-6 h-0.5 bg-current" />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden bg-background/98 border-t border-border px-4 py-4">
            <nav aria-label="Mobile navigation" className="flex flex-col gap-3">
              <Link to="/about" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors uppercase tracking-wide py-2" onClick={() => setMenuOpen(false)}>About</Link>
              <Link to="/race-format" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors uppercase tracking-wide py-2" onClick={() => setMenuOpen(false)}>Race Format</Link>
              <Link to="/journal" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors uppercase tracking-wide py-2" onClick={() => setMenuOpen(false)}>Journal</Link>
              <Link to="/become-a-judge" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors uppercase tracking-wide py-2" onClick={() => setMenuOpen(false)}>Become a Judge</Link>
              <Link to="/faq" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors uppercase tracking-wide py-2" onClick={() => setMenuOpen(false)}>FAQ</Link>
              <Link
                to="/find-your-race"
                className="mt-2 px-5 py-2 rounded-full bg-primary text-black font-bold text-sm uppercase tracking-wide text-center"
                onClick={() => setMenuOpen(false)}
              >
                Find Your Race
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* ── HERO ── */}
        <section className="relative h-screen min-h-[600px] flex items-end overflow-hidden" style={{ paddingBottom: '5rem' }}>
          <video
            src={home.hero.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <p
              className="text-primary text-sm font-bold uppercase tracking-widest mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {home.hero.eyebrow}
            </p>
            <h1
              className="text-white font-black uppercase leading-none mb-4"
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(3rem, 8vw, 6rem)' }}
            >
              {home.hero.title}
            </h1>
            <p className="text-white/90 text-base sm:text-lg mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
              {home.hero.subtitle}
            </p>
            <p className="text-white/90 text-base sm:text-lg mb-8" style={{ fontFamily: 'var(--font-sans)' }}>
              {home.hero.tagline}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/find-your-race"
                className="px-7 py-3 rounded-full bg-primary text-black font-bold text-sm uppercase tracking-wide hover:bg-primary/90 transition-colors"
              >
                {home.hero.primaryCta}
              </Link>
              <Link
                to="/race-format"
                className="text-white text-sm font-semibold underline underline-offset-4 hover:text-primary transition-colors"
              >
                {home.hero.secondaryCta}
              </Link>
            </div>
          </div>
        </section>

        {/* ── PARTNERS MARQUEE ── */}
        <section className="bg-background py-10 overflow-hidden border-y border-border">
          <div className="max-w-7xl mx-auto px-4 mb-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground text-center">
              {home.partners.label}
            </p>
          </div>
          <div className="relative">
            <div className="flex gap-10 mb-5" style={{ animation: 'marquee 30s linear infinite' }}>
              {[...home.partners.logos, ...home.partners.logos].map((p, i) => (
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
              {[...home.partners.logos, ...home.partners.logos].map((p, i) => (
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

        {/* ── THE RACE ── */}
        <section className="relative py-32 overflow-hidden">
          <img
            src="/assets/images/77b3acc22f1a54c4ae128c88697f89ec.jpg"
            alt="Hyfit Games fitness competition athletes"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            width={1280}
            height={720}
          />
          <div className="absolute inset-0 bg-black/70 pointer-events-none" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-4">
              {home.race.eyebrow}
            </p>
            <h2
              className="text-white font-black uppercase leading-tight mb-6"
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            >
              {home.race.title}
            </h2>
            <p className="text-white/80 text-base sm:text-lg mb-10 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-sans)' }}>
              {home.race.body}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/race-format"
                className="px-6 py-3 rounded-full border-2 border-white text-white text-sm font-bold uppercase tracking-wide hover:bg-white hover:text-black transition-colors"
              >
                {home.race.cta1}
              </Link>
              <Link
                to="/race-format"
                className="px-6 py-3 rounded-full border-2 border-white text-white text-sm font-bold uppercase tracking-wide hover:bg-white hover:text-black transition-colors"
              >
                {home.race.cta2}
              </Link>
            </div>
          </div>
        </section>

        {/* ── THE 2026 SEASON ── */}
        <section className="bg-background py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
              <div>
                <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">
                  {home.season.eyebrow}
                </p>
                <h2
                  className="text-white font-black uppercase leading-tight"
                  style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}
                >
                  {home.season.title}
                </h2>
              </div>
              <Link
                to="/find-your-race"
                className="flex-shrink-0 px-6 py-3 rounded-full bg-primary text-black font-bold text-sm uppercase tracking-wide hover:bg-primary/90 transition-colors self-start sm:self-auto"
              >
                {home.season.allRacesCta}
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {home.season.events.map((event) => (
                <div key={event.id} className="relative rounded-2xl overflow-hidden group h-80">
                  <img
                    src={eventImages[event.city] ?? '/airo-assets/images/pages/home/delhi-venue'}
                    alt={event.city}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    width={600}
                    height={400}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">
                      {event.date}
                    </p>
                    <p className="text-white/60 text-xs uppercase tracking-widest mb-2">
                      {event.edition}
                    </p>
                    <h3
                      className="text-white font-black uppercase text-3xl mb-4"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {event.city}
                    </h3>
                    <a
                      href={event.href}
                      className="text-primary text-xs font-bold uppercase tracking-widest hover:underline"
                    >
                      FIND OUT MORE &rarr;
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BECOME A JUDGE ── */}
        <section className="relative py-32 overflow-hidden">
          <img
            src="/airo-assets/images/pages/home/judge-section"
            alt="Hyfit Games judge at competition"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            width={1280}
            height={720}
          />
          <div className="absolute inset-0 bg-black/72 pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-4">
              {home.judge.eyebrow}
            </p>
            <h2
              className="font-black uppercase leading-tight mb-6"
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            >
              <span className="text-white">{home.judge.titlePart1}</span>
              <span className="text-primary">{home.judge.titlePart2}</span>
            </h2>
            <p className="text-white/80 text-base sm:text-lg mb-10 max-w-xl" style={{ fontFamily: 'var(--font-sans)' }}>
              {home.judge.body}
            </p>
            <Link
              to="/become-a-judge"
              className="inline-block px-7 py-3 rounded-full border-2 border-white text-white text-sm font-bold uppercase tracking-wide hover:bg-white hover:text-black transition-colors"
            >
              {home.judge.cta}
            </Link>
          </div>
        </section>

        {/* ── FOR BRANDS ── */}
        <section className="bg-card py-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-4">
              {home.brands.eyebrow}
            </p>
            <h2
              className="text-white font-black uppercase leading-tight mb-6"
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            >
              {home.brands.title}
            </h2>
            <p className="text-white/70 text-base sm:text-lg mb-10" style={{ fontFamily: 'var(--font-sans)' }}>
              {home.brands.body}
            </p>
            <Link
              to="/partner-with-us"
              className="inline-block px-7 py-3 rounded-full border-2 border-white text-white text-sm font-bold uppercase tracking-wide hover:bg-white hover:text-black transition-colors"
            >
              {home.brands.cta}
            </Link>
          </div>
        </section>

        {/* ── LEGACY PARTNERS ── */}
        <section className="bg-background py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-muted-foreground text-xs uppercase tracking-widest mb-4">
              {home.legacyPartners.eyebrow}
            </p>
            <h2
              className="font-black uppercase leading-tight mb-14"
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              <span className="text-white">{home.legacyPartners.titlePart1}</span>
              <span className="text-primary">{home.legacyPartners.titlePart2}</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
              {home.legacyPartners.logos.map((logo) => (
                <div
                  key={logo.id}
                  className="border border-border rounded-xl px-4 py-5 flex items-center justify-center hover:border-primary/40 transition-colors"
                >
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide text-center">
                    {logo.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="bg-background border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
              {/* Brand */}
              <div className="lg:col-span-1">
                <Link to="/">
                  <img
                    src="/airo-assets/images/logo/horizontal"
                    alt="Hyfit Games"
                    className="block h-auto max-h-10 w-auto max-w-[140px] object-contain mb-4"
                  />
                </Link>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  {home.footer.tagline}
                </p>
                <div className="flex gap-3">
                  <a
                    href={home.footer.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a
                    href={home.footer.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* The Race */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">The Race</h3>
                <ul className="space-y-2">
                  <li><Link to="/find-your-race" className="text-sm text-muted-foreground hover:text-primary transition-colors">Find your race</Link></li>
                  <li><Link to="/race-format" className="text-sm text-muted-foreground hover:text-primary transition-colors">Race format</Link></li>
                  <li><Link to="/become-a-judge" className="text-sm text-muted-foreground hover:text-primary transition-colors">Become a judge</Link></li>
                </ul>
              </div>

              {/* Races */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">Races</h3>
                <ul className="space-y-2">
                  <li><Link to="/find-your-race/delhi" className="text-sm text-muted-foreground hover:text-primary transition-colors">Delhi</Link></li>
                  <li><Link to="/find-your-race/ahmedabad" className="text-sm text-muted-foreground hover:text-primary transition-colors">Gujarat</Link></li>
                </ul>
              </div>

              {/* Journal */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">Journal</h3>
                <ul className="space-y-2">
                  <li><Link to="/hybrid-fitness-races-in-india" className="text-sm text-muted-foreground hover:text-primary transition-colors">Hybrid races in India</Link></li>
                  <li><Link to="/family-fitness-racing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Family racing (Bloodline)</Link></li>
                  <li><Link to="/journal/hyfit-games-hec-gandhinagar" className="text-sm text-muted-foreground hover:text-primary transition-colors">HEC Gandhinagar venue</Link></li>
                  <li><Link to="/journal/hyfit-games-delhi-pragati-maidan" className="text-sm text-muted-foreground hover:text-primary transition-colors">Delhi venue</Link></li>
                  <li><Link to="/journal/hyfit-vs-hyrox" className="text-sm text-muted-foreground hover:text-primary transition-colors">Hyfit vs Hyrox</Link></li>
                  <li><Link to="/journal" className="text-sm text-muted-foreground hover:text-primary transition-colors">All articles</Link></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</Link></li>
                  <li><Link to="/partner-with-us" className="text-sm text-muted-foreground hover:text-primary transition-colors">Partner with us</Link></li>
                  <li><Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
                  <li><Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy policy</Link></li>
                  <li><Link to="/terms-and-conditions" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms &amp; conditions</Link></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">Contact</h3>
                <ul className="space-y-2">
                  <li>
                    <a href={`mailto:${home.footer.email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {home.footer.email}
                    </a>
                  </li>
                  <li>
                    <p className="text-sm text-muted-foreground">{home.footer.address}</p>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">{home.footer.copyright}</p>
              <div className="flex items-center gap-4">
                <Link to="/privacy-policy" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
                <Link to="/terms-and-conditions" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms</Link>
                <Link to="/become-a-judge" className="text-xs text-muted-foreground hover:text-primary transition-colors">Become a Judge</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
