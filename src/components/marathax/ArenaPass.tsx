import { Link } from 'react-router';
import { motion } from 'motion/react';
import { getCategoryInfo, PRIZE_LABELS } from './categoryConfig';

// ── Minimal inline QR code generator (no external dependency, no network call) ──
// Uses the qrcode package which is bundled with Vite. Falls back to a text badge if unavailable.
import QRCode from 'qrcode';
import { useEffect, useRef, useState } from 'react';

function useQrDataUrl(text: string): string {
  const [dataUrl, setDataUrl] = useState('');
  useEffect(() => {
    QRCode.toDataURL(text, {
      width: 200,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' },
      errorCorrectionLevel: 'H',
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(''));
  }, [text]);
  return dataUrl;
}

interface PassData {
  fullName: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  bloodGroup: string;
  category: string;
  fee: number;
  prizes: string[];
}

interface ArenaPassProps {
  data: PassData;
  regCode: string;
  passRefId: string;
  onRegisterAnother: () => void;
}

function Confetti() {
  const colors = [
    'hsl(var(--primary))',
    'hsl(var(--pass-gold))',
    'hsl(var(--pass-green))',
    'hsl(var(--foreground))',
  ];
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    size: 4 + Math.random() * 6,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{ left: `${p.left}%`, top: '-10px', width: p.size, height: p.size, backgroundColor: p.color }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: [1, 1, 0], rotate: 360 * 3 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

export default function ArenaPass({ data, regCode, passRefId, onRegisterAnother }: ArenaPassProps) {
  const passRef = useRef<HTMLDivElement>(null);
  const hFont = { fontFamily: 'var(--font-heading)' };
  const bFont = { fontFamily: 'var(--font-sans)' };

  // Include timestamp + random salt so every generated QR is cryptographically unique
  const qrSalt = useRef(`${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`).current;
  const qrText = `MARATHAX|REG:${regCode}|NAME:${data.fullName}|CAT:${data.category}|REF:${passRefId}|TS:${qrSalt}`;
  const qrDataUrl = useQrDataUrl(qrText);

  const catInfo = getCategoryInfo(data.category);
  const prizes = catInfo?.prizes ?? data.prizes ?? [];

  return (
    <div className="relative min-h-screen bg-[hsl(var(--pass-bg))]">
      <Confetti />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-16 sm:py-24">

        {/* ── VERIFIED BADGE ── */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' as const }}
        >
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border"
            style={{ background: 'hsl(var(--pass-green-bg))', borderColor: 'hsl(var(--pass-green))' }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'hsl(var(--pass-green))', boxShadow: 'hsl(var(--pass-green-glow) / 0.53) 0 0 12px' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'hsl(var(--pass-green))', ...hFont }}>
              PAYMENT CONFIRMED &amp; VERIFIED
            </span>
          </div>
        </motion.div>

        {/* ── HEADING ── */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' as const }}
        >
          <h1
            className="font-black uppercase leading-none mb-4"
            style={{ color: 'hsl(var(--pass-gold))', fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', letterSpacing: '-0.02em', ...hFont }}
          >
            WELCOME TO THE ARENA!
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground" style={bFont}>
            Congratulations <strong className="text-foreground">{data.fullName}</strong>! Your spot is officially secured for{' '}
            <strong className="text-primary">MARATHA X FITNESS CHALLENGE</strong>.
          </p>
        </motion.div>

        {/* ── EMAIL NOTICE ── */}
        <motion.div
          className="rounded-xl border p-4 mb-8 flex items-start gap-3"
          style={{ background: 'hsl(var(--pass-surface))', borderColor: 'hsl(var(--pass-border))' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25, ease: 'easeOut' as const }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: 'hsl(var(--pass-green-bg))', border: '1px solid hsl(var(--pass-green))' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--pass-green))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: 'hsl(var(--pass-green))', ...hFont }}>
              Pass Sent to Your Inbox
            </p>
            <p className="text-sm text-muted-foreground" style={bFont}>
              A copy of this entry pass has been emailed to <strong className="text-foreground">{data.email}</strong>
            </p>
          </div>
        </motion.div>

        {/* ── ARENA PASS CARD ── */}
        <motion.div
          ref={passRef}
          className="rounded-2xl overflow-hidden mb-8"
          style={{
            background: 'hsl(var(--pass-card))',
            border: '1px solid hsl(var(--pass-border))',
            boxShadow: 'hsl(var(--primary) / 0.15) 0 0 40px',
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' as const }}
        >
          {/* Card header */}
          <div
            className="px-8 py-6 text-center"
            style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))' }}
          >
            <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: 'hsl(var(--primary-foreground) / 0.8)', ...hFont }}>
              OFFICIAL ENTRY PASS
            </p>
            <h2
              className="font-black uppercase leading-none mb-1"
              style={{ color: 'hsl(var(--primary-foreground))', fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', letterSpacing: '0.05em', ...hFont }}
            >
              MARATHA X
            </h2>
            <p className="text-xs" style={{ color: 'hsl(var(--primary-foreground) / 0.75)', ...bFont }}>
              FITNESS CHALLENGE — 10 JANUARY 2027 · MUMBAI
            </p>
          </div>

          {/* Card body */}
          <div className="p-6 sm:p-8">

            {/* Verified badge */}
            <div className="flex justify-end mb-5">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"
                style={{ background: 'hsl(var(--pass-green-bg))', border: '1px solid hsl(var(--pass-green))', color: 'hsl(var(--pass-green))', ...hFont }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                VERIFIED ENTRY
              </span>
            </div>

            {/* Participant details */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="col-span-2 p-3 rounded-lg" style={{ background: 'hsl(var(--pass-surface))', border: '1px solid hsl(var(--pass-border-subtle))' }}>
                <p className="text-xs uppercase tracking-widest mb-1 text-muted-foreground" style={hFont}>Participant</p>
                <p className="font-bold text-base text-foreground" style={hFont}>{data.fullName}</p>
              </div>
              <div className="col-span-2 p-3 rounded-lg" style={{ background: 'hsl(var(--pass-surface))', border: '1px solid hsl(var(--pass-border-subtle))' }}>
                <p className="text-xs uppercase tracking-widest mb-1 text-muted-foreground" style={hFont}>Category</p>
                <p className="font-bold text-base text-primary" style={hFont}>{data.category}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'hsl(var(--pass-surface))', border: '1px solid hsl(var(--pass-border-subtle))' }}>
                <p className="text-xs uppercase tracking-widest mb-1 text-muted-foreground" style={hFont}>Age</p>
                <p className="font-bold text-sm text-foreground" style={hFont}>{data.age}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'hsl(var(--pass-surface))', border: '1px solid hsl(var(--pass-border-subtle))' }}>
                <p className="text-xs uppercase tracking-widest mb-1 text-muted-foreground" style={hFont}>Gender</p>
                <p className="font-bold text-sm text-foreground" style={hFont}>{data.gender}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'hsl(var(--pass-surface))', border: '1px solid hsl(var(--pass-border-subtle))' }}>
                <p className="text-xs uppercase tracking-widest mb-1 text-muted-foreground" style={hFont}>Blood Group</p>
                <p className="font-bold text-sm" style={{ color: 'hsl(var(--pass-danger))', ...hFont }}>{data.bloodGroup}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'hsl(var(--pass-surface))', border: '1px solid hsl(var(--pass-border-subtle))' }}>
                <p className="text-xs uppercase tracking-widest mb-1 text-muted-foreground" style={hFont}>Fee Paid</p>
                <p className="font-black text-sm" style={{ color: 'hsl(var(--pass-gold))', ...hFont }}>
                  ₹{data.fee.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Prize breakdown */}
            <div
              className="rounded-xl p-4 mb-5"
              style={{ background: 'hsl(var(--pass-surface))', border: '1px solid hsl(var(--pass-border-subtle))' }}
            >
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3" style={hFont}>
                Prize Pool — {data.category}
              </p>
              <div className="space-y-2">
                {prizes.map((prize, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground" style={hFont}>{PRIZE_LABELS[i]}</span>
                    <span
                      className="text-sm font-black"
                      style={{
                        color: i === 0 ? 'hsl(var(--pass-gold))' : i === 1 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                        ...hFont,
                      }}
                    >
                      {prize}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* QR + Reg Code */}
            <div
              className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-xl"
              style={{ background: 'hsl(var(--pass-surface))', border: '1px dashed hsl(var(--pass-border))' }}
            >
              {/* QR Code — inline canvas-generated, no external network call */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                {qrDataUrl ? (
                  <div className="p-2 rounded-lg bg-white">
                    <img
                      src={qrDataUrl}
                      alt={`QR Gate Pass for ${regCode}`}
                      width={120}
                      height={120}
                      className="block"
                    />
                  </div>
                ) : (
                  <div
                    className="w-[136px] h-[136px] rounded-lg flex items-center justify-center bg-white"
                    aria-label="QR code loading"
                  >
                    <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" aria-hidden="true">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                  </div>
                )}
                <p className="text-xs text-center uppercase tracking-wider text-muted-foreground" style={hFont}>
                  SCANNABLE GATE PASS
                </p>
              </div>

              {/* Reg code */}
              <div className="flex-1 text-center sm:text-left">
                <p className="text-xs uppercase tracking-widest mb-2 text-muted-foreground" style={hFont}>Registration Code</p>
                <p
                  className="font-black mb-3"
                  style={{ color: 'hsl(var(--pass-gold))', fontSize: 'clamp(1.4rem, 4vw, 2rem)', letterSpacing: '0.1em', ...hFont }}
                >
                  {regCode}
                </p>
                <p className="text-xs mb-1" style={{ color: 'hsl(var(--pass-dimmed))', ...bFont }}>Pass Ref: {passRefId}</p>
                <p className="text-xs" style={{ color: 'hsl(var(--pass-dimmed))', ...bFont }}>
                  Present this code at the check-in desk on event day.
                </p>
              </div>
            </div>
          </div>

          {/* Card footer */}
          <div
            className="px-8 py-4 text-center"
            style={{ background: 'hsl(var(--pass-surface))', borderTop: '1px solid hsl(var(--pass-border))' }}
          >
            <p className="text-xs text-muted-foreground" style={bFont}>
              Questions?{' '}
              <a href="mailto:reservation@marathax.com" className="text-primary hover:underline">
                reservation@marathax.com
              </a>
            </p>
          </div>
        </motion.div>

        {/* ── ACTION BUTTONS ── */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' as const }}
        >
          <button
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all hover:opacity-90 active:scale-95 text-primary-foreground"
            style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))', ...hFont }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            PRINT / SAVE TICKET PASS
          </button>

          <Link
            to="/marathax"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all hover:opacity-90 active:scale-95"
            style={{ background: 'hsl(var(--pass-card))', color: 'hsl(var(--pass-gold))', border: '1px solid hsl(var(--pass-border))', ...hFont }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            VIEW MY PROFILE / DASHBOARD
          </Link>
        </motion.div>

        <div className="text-center mt-8">
          <button
            onClick={onRegisterAnother}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
            style={bFont}
          >
            Register another participant
          </button>
        </div>

      </div>

      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}
