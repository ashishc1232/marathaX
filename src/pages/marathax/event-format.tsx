import { useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router';
import { marathax_format } from 'virtual:content';
import MarathaxLayout from '@/components/marathax/MarathaxLayout';

type CategoryKey = 'male' | 'female' | 'kids';

const CATEGORIES: { key: CategoryKey; label: string; sub: string }[] = [
  { key: 'male',   label: 'Male',   sub: 'Ages 16+' },
  { key: 'female', label: 'Female', sub: 'Ages 16+' },
  { key: 'kids',   label: 'Rising Star', sub: 'Ages 8–15' },
];

interface StationSpec {
  load: string;
  reps: string;
  note?: string;
}

interface Station {
  number: string;
  label: string;
  description: string;
  kidsLabel?: string;
  kidsDescription?: string;
  specs: Record<CategoryKey, StationSpec>;
}

const STATIONS: Station[] = [
  {
    number: '01',
    label: 'Dumbbell Step-Ups',
    description: 'Weighted step-ups onto a box — quads, glutes and single-leg stability.',
    specs: {
      male:   { load: '10 kg each hand', reps: '20 reps' },
      female: { load: '5 kg each hand',  reps: '20 reps' },
      kids:   { load: '2 kg each hand',  reps: '10 reps' },
    },
  },
  {
    number: '02',
    label: 'Farmer Carry',
    description: 'Heavy loaded carry for grip strength, core bracing and total-body endurance.',
    specs: {
      male:   { load: '20 kg each hand', reps: '100m' },
      female: { load: '15 kg each hand', reps: '100m' },
      kids:   { load: '2 kg each hand',  reps: '50m' },
    },
  },
  {
    number: '03',
    label: 'Sandbag Lunges',
    description: 'Walking lunges with a sandbag — legs, core and balance under load.',
    kidsLabel: 'Cognitive Cross Cone Colour Challenge',
    kidsDescription: 'A fun cognitive agility drill — kids navigate colour-coded cones in sequence, sharpening reaction time, coordination and mental focus.',
    specs: {
      male:   { load: '20 kg', reps: '100m' },
      female: { load: '10 kg', reps: '100m' },
      kids:   { load: 'No equipment', reps: 'Colour-coded cone sequence' },
    },
  },
  {
    number: '04',
    label: 'Net Crawl',
    description: 'Low crawl under a military-style net — full-body coordination and mental grit.',
    specs: {
      male:   { load: 'Bodyweight', reps: '25m' },
      female: { load: 'Bodyweight', reps: '25m' },
      kids:   { load: 'Bodyweight', reps: '25m' },
    },
  },
  {
    number: '05',
    label: 'Tyre Flip',
    description: 'Explosive posterior chain power — drive through the hips to flip a heavy tyre.',
    specs: {
      male:   { load: 'Scaled tyre', reps: '20 reps' },
      female: { load: 'Scaled tyre', reps: '20 reps' },
      kids:   { load: 'Scaled tyre', reps: '20 reps' },
    },
  },
  {
    number: '06',
    label: 'Burpees',
    description: 'Full-body explosive movement — no equipment, every rep counts.',
    specs: {
      male:   { load: 'Bodyweight', reps: '30 reps' },
      female: { load: 'Bodyweight', reps: '30 reps' },
      kids:   { load: 'Bodyweight', reps: '10 reps' },
    },
  },
  {
    number: '07',
    label: 'Basketball Shot',
    description: 'Sink 1 basket to stop the clock. The race ends only when the ball goes in.',
    specs: {
      male:   { load: 'Standard ball', reps: '1 basket' },
      female: { load: 'Standard ball', reps: '1 basket' },
      kids:   { load: 'Standard ball', reps: '1 basket' },
    },
  },
];

export default function MarathaxFormatPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('male');

  return (
    <MarathaxLayout>
      <Helmet>
        <title>Event Format — MARATHAX | 7 Runs. 7 Stations.</title>
        <meta name="description" content="MARATHAX event format: 7 running sections and 7 functional workout stations including a Basketball Shot finale. Weights and reps shown per category — Male, Female, Rising Star." />
        <link rel="canonical" href="https://marathax.in/event-format" />
        <meta property="og:title" content="Event Format — MARATHAX | 7 Runs. 7 Stations." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://marathax.in/event-format" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main>
        {/* ── HERO ── */}
        <section className="relative pt-40 pb-24 overflow-hidden">
          <img
            src="/airo-assets/images/marathax/format-running"
            alt="Athletes racing at MARATHAX"
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
              {marathax_format.hero.eyebrow}
            </p>
            <h1
              className="text-white font-black uppercase leading-none mb-6"
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(3rem, 8vw, 6rem)', letterSpacing: '-0.03em' }}
            >
              {marathax_format.hero.title}
            </h1>
            <p className="text-white/80 text-base sm:text-xl max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-sans)' }}>
              {marathax_format.hero.body}
            </p>
          </div>
        </section>

        {/* ── OVERVIEW ── */}
        <section className="bg-background py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p
              className="text-primary text-xs font-bold uppercase tracking-widest mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {marathax_format.overview.eyebrow}
            </p>
            <h2
              className="text-foreground font-black uppercase leading-tight mb-6"
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              {marathax_format.overview.title}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-sans)' }}>
              {marathax_format.overview.body}
            </p>
          </div>
        </section>

        {/* ── INTERACTIVE RACE FORMAT ── */}
        <section className="bg-card border-y border-border py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Section heading */}
            <div className="text-center mb-10">
              <p
                className="text-primary text-xs font-bold uppercase tracking-widest mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Your Race
              </p>
              <h2
                className="text-foreground font-black uppercase leading-tight mb-3"
                style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}
              >
                Choose Your Category
              </h2>
              <p className="text-muted-foreground text-sm" style={{ fontFamily: 'var(--font-sans)' }}>
                Select your category to see your exact weights, reps and distances.
              </p>
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-6 py-3 rounded border font-black uppercase text-sm tracking-wider transition-all ${
                    activeCategory === cat.key
                      ? 'bg-primary text-white border-primary'
                      : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                  }`}
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  <span className="block">{cat.label}</span>
                  <span className={`block text-xs font-normal normal-case tracking-normal mt-0.5 ${activeCategory === cat.key ? 'text-white/70' : 'text-muted-foreground'}`} style={{ fontFamily: 'var(--font-sans)' }}>
                    {cat.sub}
                  </span>
                </button>
              ))}
            </div>

            {/* Race flow */}
            <div className="relative">
              {/* Vertical connector line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden sm:block" />

              <div className="space-y-0">
                {STATIONS.map((station, i) => (
                  <div key={station.number}>
                    {/* 200m Run connector */}
                    <div className="flex items-center gap-4 py-3 sm:pl-0">
                      <div className="relative flex-shrink-0 w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center z-10">
                        <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                      <div>
                        <p
                          className="text-muted-foreground text-xs font-bold uppercase tracking-widest"
                          style={{ fontFamily: 'var(--font-heading)' }}
                        >
                          200m Run
                        </p>
                        <p className="text-muted-foreground/60 text-xs" style={{ fontFamily: 'var(--font-sans)' }}>
                          Run {i + 1} of 7
                        </p>
                      </div>
                    </div>

                    {/* Station card */}
                    <div className="flex items-start gap-4 sm:pl-0">
                      <div className="relative flex-shrink-0 w-12 h-12 rounded bg-primary flex items-center justify-center z-10">
                        <span
                          className="text-white text-xs font-black"
                          style={{ fontFamily: 'var(--font-heading)' }}
                        >
                          {station.number}
                        </span>
                      </div>
                      <div className="flex-1 bg-background border border-border rounded-xl p-5 mb-2 hover:border-primary/30 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                          <div>
                            <h3
                              className="text-foreground font-black uppercase text-base mb-1"
                              style={{ fontFamily: 'var(--font-heading)' }}
                            >
                              {activeCategory === 'kids' && station.kidsLabel ? station.kidsLabel : station.label}
                            </h3>
                            <p className="text-muted-foreground text-sm" style={{ fontFamily: 'var(--font-sans)' }}>
                              {activeCategory === 'kids' && station.kidsDescription ? station.kidsDescription : station.description}
                            </p>
                          </div>
                        </div>

                        {/* Category-specific specs */}
                        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border">
                          <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-4 py-2">
                            <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                            </svg>
                            <div>
                              <p className="text-primary/70 text-xs uppercase tracking-wider" style={{ fontFamily: 'var(--font-heading)' }}>Load</p>
                              <p className="text-foreground font-bold text-sm" style={{ fontFamily: 'var(--font-heading)' }}>
                                {station.specs[activeCategory].load}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-4 py-2">
                            <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                              <p className="text-primary/70 text-xs uppercase tracking-wider" style={{ fontFamily: 'var(--font-heading)' }}>Reps / Distance</p>
                              <p className="text-foreground font-bold text-sm" style={{ fontFamily: 'var(--font-heading)' }}>
                                {station.specs[activeCategory].reps}
                              </p>
                            </div>
                          </div>
                          {station.specs[activeCategory].note && (
                            <div className="w-full flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2">
                              <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p className="text-muted-foreground text-xs" style={{ fontFamily: 'var(--font-sans)' }}>
                                {station.specs[activeCategory].note}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Finish */}
                <div className="flex items-center gap-4 pt-3">
                  <div className="relative flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center z-10">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p
                      className="text-primary font-black uppercase tracking-widest text-sm"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      Finish Line
                    </p>
                    <p className="text-muted-foreground text-xs" style={{ fontFamily: 'var(--font-sans)' }}>
                      Clock stops when the basketball goes in.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── RULES ── */}
        <section className="bg-background py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p
                className="text-primary text-xs font-bold uppercase tracking-widest mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {marathax_format.rules.eyebrow}
              </p>
              <h2
                className="text-foreground font-black uppercase leading-tight"
                style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}
              >
                {marathax_format.rules.title}
              </h2>
            </div>
            <ol className="space-y-4">
              {marathax_format.rules.items.map((item, i) => (
                <li key={item.id} className="flex items-start gap-4 bg-card border border-border rounded-lg p-5">
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-black"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-foreground text-sm leading-relaxed pt-1" style={{ fontFamily: 'var(--font-sans)' }}>
                    {item.rule}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── PARTICIPATION FORMATS ── */}
        <section className="bg-card border-t border-border py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p
                className="text-primary text-xs font-bold uppercase tracking-widest mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {marathax_format.participation.eyebrow}
              </p>
              <h2
                className="text-foreground font-black uppercase leading-tight"
                style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}
              >
                HOW TO COMPETE
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="bg-background border border-border rounded-lg p-8 text-center hover:border-primary/40 transition-colors">
                <div className="text-5xl font-black text-primary/20 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>01</div>
                <h3 className="text-foreground font-black uppercase text-xl mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                  {marathax_format.participation.individual.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
                  {marathax_format.participation.individual.body}
                </p>
              </div>
              <div className="bg-background border border-border rounded-lg p-8 text-center hover:border-primary/40 transition-colors">
                <div className="text-5xl font-black text-primary/20 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>02</div>
                <h3 className="text-foreground font-black uppercase text-xl mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                  {marathax_format.participation.doubles.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
                  {marathax_format.participation.doubles.body}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Station Visual Gallery ── */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-primary text-xs uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--font-heading)' }}>VISUALISE THE RACE</p>
              <h2
                className="text-foreground font-black uppercase leading-tight"
                style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
              >
                7 STATIONS. 7 BATTLES.
              </h2>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-sm" style={{ fontFamily: 'var(--font-sans)' }}>
                Every station is a test of a different dimension — strength, endurance, agility, and mental grit. Here's what awaits you on race day.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Station 01 */}
              <div className="group relative overflow-hidden rounded-xl border border-border hover:border-primary/50 transition-all duration-300">
                <div className="aspect-video overflow-hidden">
                  <img
                    src="/airo-assets/images/marathax/station-dumbbell-stepups"
                    alt="Dumbbell Step-Ups challenge"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="text-primary text-xs font-black uppercase tracking-widest" style={{ fontFamily: 'var(--font-heading)' }}>Station 01</span>
                  <h3 className="text-white font-black uppercase text-lg leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>Dumbbell Step-Ups</h3>
                </div>
              </div>

              {/* Station 02 */}
              <div className="group relative overflow-hidden rounded-xl border border-border hover:border-primary/50 transition-all duration-300">
                <div className="aspect-video overflow-hidden">
                  <img
                    src="/airo-assets/images/marathax/station-farmer-carry"
                    alt="Farmer Carry challenge"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="text-primary text-xs font-black uppercase tracking-widest" style={{ fontFamily: 'var(--font-heading)' }}>Station 02</span>
                  <h3 className="text-white font-black uppercase text-lg leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>Farmer Carry</h3>
                </div>
              </div>

              {/* Station 03 */}
              <div className="group relative overflow-hidden rounded-xl border border-border hover:border-primary/50 transition-all duration-300">
                <div className="aspect-video overflow-hidden">
                  <img
                    src="/airo-assets/images/marathax/station-sandbag-lunges"
                    alt="Sandbag Lunges / Cognitive Cross Cone challenge"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="text-primary text-xs font-black uppercase tracking-widest" style={{ fontFamily: 'var(--font-heading)' }}>Station 03</span>
                  <h3 className="text-white font-black uppercase text-lg leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>Sandbag Lunges</h3>
                  <p className="text-white/60 text-xs mt-1" style={{ fontFamily: 'var(--font-sans)' }}>Kids: Cognitive Cross Cone Colour Challenge</p>
                </div>
              </div>

              {/* Station 04 */}
              <div className="group relative overflow-hidden rounded-xl border border-border hover:border-primary/50 transition-all duration-300">
                <div className="aspect-video overflow-hidden">
                  <img
                    src="/airo-assets/images/marathax/station-net-crawl"
                    alt="Net Crawl challenge"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="text-primary text-xs font-black uppercase tracking-widest" style={{ fontFamily: 'var(--font-heading)' }}>Station 04</span>
                  <h3 className="text-white font-black uppercase text-lg leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>Net Crawl</h3>
                </div>
              </div>

              {/* Station 05 */}
              <div className="group relative overflow-hidden rounded-xl border border-border hover:border-primary/50 transition-all duration-300">
                <div className="aspect-video overflow-hidden">
                  <img
                    src="/airo-assets/images/marathax/station-tyre-flip"
                    alt="Tyre Flip challenge"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="text-primary text-xs font-black uppercase tracking-widest" style={{ fontFamily: 'var(--font-heading)' }}>Station 05</span>
                  <h3 className="text-white font-black uppercase text-lg leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>Tyre Flip</h3>
                </div>
              </div>

              {/* Station 06 */}
              <div className="group relative overflow-hidden rounded-xl border border-border hover:border-primary/50 transition-all duration-300">
                <div className="aspect-video overflow-hidden">
                  <img
                    src="/airo-assets/images/marathax/station-burpees"
                    alt="Burpees challenge"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="text-primary text-xs font-black uppercase tracking-widest" style={{ fontFamily: 'var(--font-heading)' }}>Station 06</span>
                  <h3 className="text-white font-black uppercase text-lg leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>Burpees</h3>
                </div>
              </div>

              {/* Station 07 — full width */}
              <div className="group relative overflow-hidden rounded-xl border border-border hover:border-primary/50 transition-all duration-300 sm:col-span-2 lg:col-span-3">
                <div className="aspect-video sm:aspect-[21/7] overflow-hidden">
                  <img
                    src="/airo-assets/images/marathax/station-basketball-shot"
                    alt="Basketball Shot final challenge"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-primary text-xs font-black uppercase tracking-widest" style={{ fontFamily: 'var(--font-heading)' }}>Station 07 — Final Challenge</span>
                  <h3 className="text-white font-black uppercase text-2xl leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>Basketball Shot</h3>
                  <p className="text-white/70 text-sm mt-1" style={{ fontFamily: 'var(--font-sans)' }}>Finish strong. One shot. All or nothing.</p>
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
              READY TO TAKE ON THE GAUNTLET?
            </h2>
            <Link
              to="/register"
              className="inline-block px-10 py-4 bg-white text-primary font-black text-sm uppercase tracking-widest rounded hover:bg-white/90 transition-colors"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Register Now
            </Link>
          </div>
        </section>
      </main>
    </MarathaxLayout>
  );
}
