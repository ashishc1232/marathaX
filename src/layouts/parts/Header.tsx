import { useState, useEffect } from 'react';
import { Link } from 'react-router';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-background/95 backdrop-blur-sm border-b border-border' : 'bg-transparent'
      }`}
      style={{ top: '40px' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="/airo-assets/images/logo/horizontal"
              alt="Hyfit Games"
              className="block h-auto max-h-10 md:max-h-12 w-auto max-w-[160px] object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-6">
            {[
              { label: 'About', href: '/about' },
              { label: 'Race Format', href: '/race-format' },
              { label: 'Journal', href: '/journal' },
              { label: 'Become a Judge', href: '/become-a-judge' },
              { label: 'FAQ', href: '/faq' },
            ].map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors uppercase tracking-wide"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/find-your-race"
              className="px-5 py-2 rounded-full bg-primary text-black font-bold text-sm uppercase tracking-wide hover:bg-primary/90 transition-colors"
            >
              Find Your Race
            </Link>
          </div>

          {/* Mobile hamburger */}
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

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-background/98 border-t border-border px-4 py-4">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-3">
            {[
              { label: 'About', href: '/about' },
              { label: 'Race Format', href: '/race-format' },
              { label: 'Journal', href: '/journal' },
              { label: 'Become a Judge', href: '/become-a-judge' },
              { label: 'FAQ', href: '/faq' },
            ].map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors uppercase tracking-wide py-2"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
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
  );
}
