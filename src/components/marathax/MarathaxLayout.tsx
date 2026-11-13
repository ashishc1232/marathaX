import { useState, useEffect, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { HelmetProvider } from '@dr.pogodin/react-helmet';

const NAV_ITEMS = [
{ id: 'n1', label: 'Home', href: '/' },
{ id: 'n2', label: 'About', href: '/about' },
{ id: 'n3', label: 'Event Format', href: '/event-format' },
{ id: 'n4', label: 'Categories & Prizes', href: '/categories-prizes' },
{ id: 'n5', label: 'Gallery', href: '/gallery' },
{ id: 'n6', label: 'Contact', href: '/contact' },
{ id: 'n7', label: 'Declaration', href: '/declaration' }];


const FOOTER_LINKS = [
{ id: 'fl1', label: 'Home', href: '/' },
{ id: 'fl2', label: 'About', href: '/about' },
{ id: 'fl3', label: 'Event Format', href: '/event-format' },
{ id: 'fl4', label: 'Categories & Prizes', href: '/categories-prizes' },
{ id: 'fl5', label: 'Register', href: '/register' },
{ id: 'fl6', label: 'Gallery', href: '/gallery' },
{ id: 'fl7', label: 'Contact', href: '/contact' }];


interface MarathaxLayoutProps {
  children: ReactNode;
}

export default function MarathaxLayout({ children }: MarathaxLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <HelmetProvider>
    <div className="min-h-screen bg-background text-foreground">
      {/* ── HEADER ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ?
        'bg-background/95 backdrop-blur-md border-b border-border shadow-lg' :
        'bg-transparent'}`
        }>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="flex-shrink-0">
              <span
                className="text-2xl md:text-3xl font-black uppercase text-foreground"
                style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
                
                MARA<span className="text-primary">THAX</span>
              </span>
            </Link>

            <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) =>
              <Link
                key={item.id}
                to={item.href}
                className={`px-3 py-2 text-xs font-semibold uppercase tracking-widest transition-colors rounded ${
                location.pathname === item.href ?
                'text-primary' :
                'text-foreground/70 hover:text-foreground'}`
                }
                style={{ fontFamily: 'var(--font-heading)' }}>
                
                  {item.label}
                </Link>
              )}
            </nav>

            <div className="hidden lg:flex">
              <Link
                to="/register"
                className="px-5 py-2.5 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded hover:bg-primary/90 transition-colors"
                style={{ fontFamily: 'var(--font-heading)' }}>
                
                Register Now
              </Link>
            </div>

            <button
              className="lg:hidden flex flex-col gap-1.5 p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}>
              
              <span className={`block w-6 h-0.5 bg-foreground transition-transform duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-foreground transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-foreground transition-transform duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-screen border-t border-border bg-background/98' : 'max-h-0'}`
          }>
          
          <nav aria-label="Mobile navigation" className="px-4 py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) =>
            <Link
              key={item.id}
              to={item.href}
              className={`px-3 py-3 text-sm font-semibold uppercase tracking-widest border-b border-border/40 transition-colors ${
              location.pathname === item.href ? 'text-primary' : 'text-foreground/80 hover:text-primary'}`
              }
              style={{ fontFamily: 'var(--font-heading)' }}>
              
                {item.label}
              </Link>
            )}
            <Link
              to="/register"
              className="mt-3 px-5 py-3 bg-primary text-white font-bold text-sm uppercase tracking-widest rounded text-center"
              style={{ fontFamily: 'var(--font-heading)' }}>
              
              Register Now
            </Link>
          </nav>
        </div>
      </header>

      {children}

      {/* ── FOOTER ── */}
      <footer className="bg-[hsl(var(--surface-footer))] border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div className="lg:col-span-1">
              <span
                className="text-3xl font-black uppercase text-foreground block mb-3"
                style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
                
                MARA<span className="text-primary">THAX</span>
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed mb-5">
                India's premier military-style fitness challenge. Strength. Endurance. Speed. Mental Toughness.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/marathaxindia"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                  
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/917304103956"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-9 h-9 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                  
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                Quick Links
              </h3>
              <ul className="space-y-2">
                {FOOTER_LINKS.map((item) =>
                <li key={item.id}>
                    <Link to={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {item.label}
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                Event Info
              </h3>
              <ul className="space-y-3">
                <li className="text-sm text-muted-foreground">Date: <span className="text-foreground font-medium">10 January 2027</span></li>
                <li className="text-sm text-muted-foreground">Prize Pool: <span className="text-primary font-bold">₹3,00,000+</span></li>
                <li className="text-sm text-muted-foreground">Format: <span className="text-foreground font-medium">Individual &amp; Doubles</span></li>
                <li className="text-sm text-muted-foreground">Stations: <span className="text-foreground font-medium">6 Runs + 6 Workouts</span></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                Contact
              </h3>
              <ul className="space-y-2"><li><a href="mailto:reservation@marathax.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">reservation@marathax.com</a></li><li><a href="https://wa.me/917304103956" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">WhatsApp Us</a></li><li><a href="https://www.instagram.com/marathaxindia" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">@marathaxindia</a></li>















              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">© 2027 MARATHAX. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">India's Fittest Challenge</p>
          </div>
        </div>
      </footer>
    </div>
    </HelmetProvider>
  );
}