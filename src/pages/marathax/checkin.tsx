import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { Helmet } from '@dr.pogodin/react-helmet';
import MarathaxLayout from '@/components/marathax/MarathaxLayout';

// Opened when a staff member scans a participant's unique QR.
// Anyone with a valid QR sees only "valid pass + name + category".
// Staff who enter the admin token see the FULL registration.

interface Details {
  fullName: string; email: string; phone: string; whatsapp: string;
  dob: string; age: string; gender: string; bloodGroup: string;
  city: string; state: string; address: string;
  emergencyContact: string; emergencyPhone: string;
  guardianName: string; guardianPhone: string;
  medicalCondition: string; medicalDetails: string;
  category: string; feePaid: number; paymentRef: string; passRefId: string; registeredAt: string;
}
interface Result {
  valid: boolean; staff?: boolean; status?: string; regCode?: string;
  fullName?: string; category?: string; details?: Details; error?: string;
}

const TOKEN_KEY = 'marathax_staff_token';

export default function MarathaxCheckinPage() {
  const [params] = useSearchParams();
  const code = params.get('code') ?? '';
  const sig = params.get('s') ?? '';
  const [token, setToken] = useState('');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  const hFont = { fontFamily: 'var(--font-heading)' };
  const bFont = { fontFamily: 'var(--font-sans)' };

  const load = useCallback(async (tok: string) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ code, s: sig });
      const res = await fetch(`/api/marathax/checkin?${qs}`, tok ? { headers: { Authorization: `Bearer ${tok}` } } : undefined);
      const data = (await res.json()) as Result;
      setResult(data);
      if (tok && !data.staff) setAuthError('Staff token not accepted.');
      else setAuthError('');
    } catch {
      setResult({ valid: false, error: 'Could not reach the server.' });
    } finally {setLoading(false);}
  }, [code, sig]);

  useEffect(() => {
    let saved = '';
    try {saved = sessionStorage.getItem(TOKEN_KEY) ?? '';} catch {/* storage unavailable */}
    setToken(saved);
    void load(saved);
  }, [load]);

  function staffLogin() {
    try {sessionStorage.setItem(TOKEN_KEY, input.trim());} catch {/* ignore */}
    setToken(input.trim());
    void load(input.trim());
  }

  const d = result?.details;
  const rows: [string, string][] = d ? [
    ['Full Name', d.fullName], ['Category', d.category], ['Age / DOB', `${d.age} · ${d.dob}`],
    ['Gender', d.gender], ['Blood Group', d.bloodGroup || '—'],
    ['Mobile', d.phone], ['WhatsApp', d.whatsapp], ['Email', d.email],
    ['City / State', `${d.city}, ${d.state}`], ['Address', d.address],
    ['Emergency Contact', `${d.emergencyContact} — ${d.emergencyPhone}`],
    ...(d.guardianName ? [['Guardian', `${d.guardianName} — ${d.guardianPhone}`]] as [string, string][] : []),
    ['Medical Condition', d.medicalCondition === 'yes' ? `YES — ${d.medicalDetails}` : 'No'],
    ['Fee Paid', `₹${d.feePaid.toLocaleString('en-IN')}`], ['Payment Ref', d.paymentRef], ['Pass Ref', d.passRefId],
  ] : [];

  return (
    <MarathaxLayout>
      <Helmet>
        <title>Check-in — MARATHAX 2027</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <section className="min-h-screen px-4 py-16 max-w-xl mx-auto">
        <h1 style={hFont} className="text-3xl font-black text-foreground uppercase tracking-wide text-center mb-6">Entry Pass Check-in</h1>

        {loading && <p style={bFont} className="text-center text-muted-foreground">Verifying…</p>}

        {!loading && result && !result.regCode &&
        <div className="p-5 rounded-xl bg-destructive/10 border border-destructive/30 text-center">
            <p style={hFont} className="text-xl font-black text-destructive uppercase">✕ Invalid QR</p>
            <p style={bFont} className="text-sm text-muted-foreground mt-1">{result.error ?? 'This pass could not be verified.'}</p>
          </div>
        }

        {!loading && result?.regCode &&
        <>
            <div className={`p-5 rounded-xl border text-center mb-6 ${result.valid ? 'bg-green-500/10 border-green-500/40' : 'bg-yellow-500/10 border-yellow-500/40'}`}>
              <p style={hFont} className={`text-2xl font-black uppercase ${result.valid ? 'text-green-400' : 'text-yellow-400'}`}>
                {result.valid ? '✓ Valid — Payment Confirmed' : '⚠ Not confirmed'}
              </p>
              <p style={hFont} className="text-lg text-primary tracking-widest mt-1">{result.regCode}</p>
              {!result.staff && <>
                <p style={bFont} className="text-foreground font-semibold mt-2">{result.fullName}</p>
                <p style={bFont} className="text-sm text-muted-foreground">{result.category}</p>
              </>}
            </div>

            {!result.staff &&
          <div className="p-4 rounded-xl bg-card border border-[hsl(var(--border-subtle))]">
                <p style={bFont} className="text-xs text-muted-foreground mb-2">Organiser? Enter your staff token to see the full registration details.</p>
                <div className="flex gap-2">
                  <input type="password" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Staff / admin token"
              className="flex-1 bg-card border border-[hsl(var(--border-mid))] rounded-lg px-3 py-2 text-sm text-foreground" />
                  <button type="button" onClick={staffLogin} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm">View</button>
                </div>
                {(authError || (token && !result.staff)) && <p className="text-destructive text-xs mt-2">{authError || 'Token not accepted.'}</p>}
              </div>
          }

            {result.staff && d &&
          <div className="bg-card border border-[hsl(var(--border-subtle))] rounded-xl overflow-hidden divide-y divide-[hsl(var(--divide-dark))]">
                {rows.map(([k, v]) =>
            <div key={k} className="flex px-5 py-3 gap-4">
                    <span style={bFont} className="text-xs text-muted-foreground w-36 flex-shrink-0">{k}</span>
                    <span style={bFont} className="text-sm text-foreground break-words">{v}</span>
                  </div>
            )}
              </div>
          }
          </>
        }
      </section>
    </MarathaxLayout>);
}
