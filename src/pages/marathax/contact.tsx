import { useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { marathax_contact } from 'virtual:content';
import MarathaxLayout from '@/components/marathax/MarathaxLayout';

export default function MarathaxContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  const inputClass = 'w-full bg-muted border border-border rounded px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors';
  const labelClass = 'block text-xs font-bold uppercase tracking-widest text-foreground mb-2';

  return (
    <MarathaxLayout>
      <Helmet>
        <title>Contact — MARATHAX | India's Fittest Challenge</title>
        <meta name="description" content="Contact the MARATHAX team. Reach us on Instagram, WhatsApp or email for event queries, registration help and sponsorship enquiries." />
        <link rel="canonical" href="https://marathax.in/contact" />
        <meta property="og:title" content="Contact — MARATHAX" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://marathax.in/contact" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main>
        {/* ── HERO ── */}
        <section className="bg-background pt-40 pb-16 border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p
              className="text-primary text-xs font-bold uppercase tracking-widest mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {marathax_contact.hero.eyebrow}
            </p>
            <h1
              className="text-foreground font-black uppercase leading-none mb-6"
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(3rem, 8vw, 6rem)', letterSpacing: '-0.03em' }}
            >
              {marathax_contact.hero.title}
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto" style={{ fontFamily: 'var(--font-sans)' }}>
              {marathax_contact.hero.body}
            </p>
          </div>
        </section>

        {/* ── CONTACT CHANNELS ── */}
        <section className="bg-background py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {marathax_contact.channels.map((ch) => (
                <a
                  key={ch.id}
                  href={ch.href}
                  target={ch.type !== 'email' ? '_blank' : undefined}
                  rel={ch.type !== 'email' ? 'noopener noreferrer' : undefined}
                  className="bg-card border border-border rounded-xl p-8 text-center hover:border-primary/40 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors">
                    {ch.type === 'instagram' && (
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="text-primary" aria-hidden="true">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    )}
                    {ch.type === 'whatsapp' && (
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="text-primary" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    )}
                    {ch.type === 'email' && (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-primary" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <h3
                    className="text-foreground font-black uppercase text-base mb-2"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {ch.label}
                  </h3>
                  <p className="text-primary font-bold text-sm mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    {ch.handle}
                  </p>
                  <p className="text-muted-foreground text-xs" style={{ fontFamily: 'var(--font-sans)' }}>
                    {ch.note}
                  </p>
                </a>
              ))}
            </div>

            {/* ── CONTACT FORM ── */}
            <div className="max-w-2xl mx-auto">
              <h2
                className="text-foreground font-black uppercase text-2xl sm:text-3xl mb-8 text-center"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {marathax_contact.form.title}
              </h2>

              {sent ? (
                <div className="bg-card border border-border rounded-xl p-10 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-primary" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-foreground font-bold text-lg mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    Message Sent
                  </p>
                  <p className="text-muted-foreground text-sm" style={{ fontFamily: 'var(--font-sans)' }}>
                    We'll get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 sm:p-8 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className={labelClass} style={{ fontFamily: 'var(--font-heading)' }}>
                        Name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder={marathax_contact.form.namePlaceholder}
                        value={form.name}
                        onChange={handleChange}
                        className={inputClass}
                        style={{ fontFamily: 'var(--font-sans)' }}
                      />
                    </div>
                    <div>
                      <label htmlFor="contactEmail" className={labelClass} style={{ fontFamily: 'var(--font-heading)' }}>
                        Email *
                      </label>
                      <input
                        id="contactEmail"
                        name="email"
                        type="email"
                        required
                        placeholder={marathax_contact.form.emailPlaceholder}
                        value={form.email}
                        onChange={handleChange}
                        className={inputClass}
                        style={{ fontFamily: 'var(--font-sans)' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className={labelClass} style={{ fontFamily: 'var(--font-heading)' }}>
                      Subject *
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      placeholder={marathax_contact.form.subjectPlaceholder}
                      value={form.subject}
                      onChange={handleChange}
                      className={inputClass}
                      style={{ fontFamily: 'var(--font-sans)' }}
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className={labelClass} style={{ fontFamily: 'var(--font-heading)' }}>
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      placeholder={marathax_contact.form.messagePlaceholder}
                      value={form.message}
                      onChange={handleChange}
                      className={`${inputClass} resize-none`}
                      style={{ fontFamily: 'var(--font-sans)' }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-primary text-white font-black text-sm uppercase tracking-widest rounded hover:bg-primary/90 transition-colors"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {marathax_contact.form.submitLabel}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
    </MarathaxLayout>
  );
}
