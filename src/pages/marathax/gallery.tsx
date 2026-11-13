import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router';
import { marathax_gallery } from 'virtual:content';
import MarathaxLayout from '@/components/marathax/MarathaxLayout';

const GALLERY_IMAGES = [
  { slot: '/airo-assets/images/marathax/gallery-7',   alt: 'MARATHAX event action shot',           wide: false },
  { slot: '/airo-assets/images/marathax/gallery-8',   alt: 'MARATHAX athlete challenge',            wide: false },
  { slot: '/airo-assets/images/marathax/gallery-9',   alt: 'MARATHAX fitness competition',          wide: false },
  { slot: '/airo-assets/images/marathax/gallery-10',  alt: 'MARATHAX workout event',                wide: false },
  { slot: '/airo-assets/images/marathax/gallery-11',  alt: 'MARATHAX workout challenge grid',       wide: true  },
  { slot: '/airo-assets/images/marathax/ambassador-6',alt: 'MARATHAX brand ambassador award',       wide: false },
  { slot: '/airo-assets/images/marathax/gallery-13',  alt: 'MARATHAX brand ambassador trophy',      wide: false },
  { slot: '/airo-assets/images/marathax/gallery-14',  alt: 'MARATHAX fitness challenge',            wide: false },
  { slot: '/airo-assets/images/marathax/gallery-15',  alt: 'MARATHAX competition highlight',        wide: false },
  { slot: '/airo-assets/images/marathax/gallery-19',  alt: 'MARATHAX brand ambassador recognition', wide: false },
  { slot: '/airo-assets/images/marathax/gallery-20',  alt: 'MARATHAX brand ambassador trophy',      wide: false },
  { slot: '/airo-assets/images/marathax/gallery-16',  alt: 'MARATHAX event moment',                 wide: false },
  { slot: '/airo-assets/images/marathax/gallery-17',  alt: 'MARATHAX athlete performance',          wide: true  },
  { slot: '/airo-assets/images/marathax/gallery-18',  alt: 'MARATHAX challenge in action',          wide: false },
];






export default function MarathaxGalleryPage() {
  return (
    <MarathaxLayout>
      <Helmet>
        <title>Gallery — MARATHAX | India's Fittest Challenge</title>
        <meta name="description" content="MARATHAX photo gallery — obstacle racing, functional fitness, military-style challenges and athlete action photography." />
        <link rel="canonical" href="https://marathax.in/gallery" />
        <meta property="og:title" content="Gallery — MARATHAX" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://marathax.in/gallery" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main>
        {/* ── HERO ── */}
        <section className="bg-background pt-40 pb-16 border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p
              className="text-primary text-xs font-bold uppercase tracking-widest mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}>
              
              {marathax_gallery.hero.eyebrow}
            </p>
            <h1
              className="text-foreground font-black uppercase leading-none mb-6"
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(3rem, 8vw, 6rem)', letterSpacing: '-0.03em' }}>
              
              {marathax_gallery.hero.title}
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg" style={{ fontFamily: 'var(--font-sans)' }}>
              {marathax_gallery.hero.body}
            </p>
          </div>
        </section>

        {/* ── GRID ── */}
        <section className="bg-background py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {GALLERY_IMAGES.map((img, i) =>
              <div
                key={i}
                className={`relative overflow-hidden rounded-lg group ${img.wide ? 'sm:col-span-2' : ''}`}
                style={{ aspectRatio: img.wide ? '16/7' : '4/3' }}>
                
                  <img
                  src={img.slot}
                  alt={img.alt}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  width={800}
                  height={600} />
                
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors pointer-events-none" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-card border-t border-border py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p
              className="text-primary text-xs font-bold uppercase tracking-widest mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}>
              
              {marathax_gallery.cta.eyebrow}
            </p>
            <h2
              className="text-foreground font-black uppercase leading-tight mb-8"
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              
              {marathax_gallery.cta.title}
            </h2>
            <Link
              to="/register"
              className="inline-block px-10 py-4 bg-primary text-white font-black text-sm uppercase tracking-widest rounded hover:bg-primary/90 transition-colors"
              style={{ fontFamily: 'var(--font-heading)' }}>
              
              {marathax_gallery.cta.button}
            </Link>
          </div>
        </section>
      </main>
    </MarathaxLayout>);

}