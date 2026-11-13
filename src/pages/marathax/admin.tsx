import { useState, useEffect, useCallback } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import MarathaxLayout from '@/components/marathax/MarathaxLayout';

interface Registration {
  id: number;
  fullName: string; email: string; phone: string; whatsapp: string;
  dob: string; age: string; gender: string; bloodGroup: string;
  city: string; state: string; address: string;
  emergencyContact: string; emergencyPhone: string;
  guardianName: string; guardianPhone: string;
  medicalCondition: string; medicalDetails: string;
  photoConsent: string; rulesAccepted: string; digitalSignature: string;
  category: string; feePaise: number; feeDisplay: string;
  utrNumber: string; paymentDate: string; paymentAmount: string; screenshotPath: string;
  regCode: string; status: string;
  createdAt: string; updatedAt: string;
}

interface AdminData {
  counts: { total: number; confirmed: number; pending_upi: number; failed: number };
  registrations: Registration[];
}

const STATUS_COLORS: Record<string, string> = {
  confirmed:   'text-green-400 bg-green-400/10 border-green-400/30',
  pending_upi: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  pending:     'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  failed:      'text-red-400 bg-red-400/10 border-red-400/30',
};
const STATUS_LABELS: Record<string, string> = {
  confirmed: 'Confirmed', pending_upi: 'Pending Verification', pending: 'Awaiting Online Payment', failed: 'Rejected',
};

export default function MarathaxAdminPage() {
  const [token, setToken]     = useState('');
  const [authed, setAuthed]   = useState(false);
  const [data, setData]       = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [search, setSearch]   = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [actionMsg, setActionMsg] = useState<Record<number, string>>({});

  const hFont = { fontFamily: 'var(--font-heading)' };
  const bFont = { fontFamily: 'var(--font-sans)' };

  const fetchData = useCallback(async (tok: string, s: string, sf: string) => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams();
      if (s)  params.set('search', s);
      if (sf) params.set('status', sf);
      params.set('limit', '200');
      const res = await fetch(`/api/marathax/admin/registrations?${params}`, {
        headers: { Authorization: `Bearer ${tok}` },
      });
      if (res.status === 401) { setError('Invalid admin token.'); setAuthed(false); return; }
      if (!res.ok) throw new Error('Failed to load data.');
      const json = await res.json() as AdminData;
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error loading data.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (authed) fetchData(token, search, statusFilter);
  }, [authed, search, statusFilter, fetchData, token]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!token.trim()) return;
    setAuthed(true);
  }

  async function handleAction(id: number, action: 'confirm' | 'reject') {
    setActionLoading(id);
    try {
      const endpoint = action === 'confirm'
        ? '/api/marathax/admin/confirm-payment'
        : '/api/marathax/admin/reject-payment';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id }),
      });
      const data = await res.json() as { ok?: boolean; message?: string; error?: string; emailSent?: boolean; regCode?: string };
      if (!res.ok) throw new Error(data.error ?? 'Action failed.');
      const msg = action === 'confirm'
        ? (data.emailSent ? `✓ Confirmed — Arena Pass sent (${data.regCode})` : `✓ Confirmed — Email failed, retry manually`)
        : '✓ Rejected';
      setActionMsg(prev => ({ ...prev, [id]: msg }));
      await fetchData(token, search, statusFilter);
    } catch (e) {
      setActionMsg(prev => ({ ...prev, [id]: e instanceof Error ? e.message : 'Action failed.' }));
    } finally { setActionLoading(null); }
  }

  // ── Login screen ───────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <MarathaxLayout>
        <Helmet><title>Admin — MARATHAX</title><meta name="robots" content="noindex" /></Helmet>
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <h1 style={hFont} className="text-3xl font-black text-foreground uppercase tracking-wide">Admin Dashboard</h1>
              <p style={bFont} className="text-muted-foreground text-sm mt-2">MARATHAX 2027 — Restricted Access</p>
            </div>
            <form onSubmit={handleLogin} className="bg-card border border-[hsl(var(--border-subtle))] rounded-xl p-6 space-y-4">
              <div>
                <label style={bFont} className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Admin Token</label>
                <input type="password" value={token} onChange={e => setToken(e.target.value)}
                  className="w-full bg-background border border-[hsl(var(--border-mid))] rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary text-sm"
                  placeholder="Enter admin token" />
              </div>
              {error && <p style={bFont} className="text-destructive text-sm">{error}</p>}
              <button type="submit" style={bFont}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-black uppercase tracking-wider hover:bg-accent transition-colors">
                Access Dashboard
              </button>
            </form>
          </div>
        </section>
      </MarathaxLayout>
    );
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────
  return (
    <MarathaxLayout>
      <Helmet>
          <title>Admin Dashboard — MARATHAX 2027</title>
          <meta name="description" content="MARATHAX 2027 admin dashboard — manage athlete registrations, verify UPI payments, and issue Arena Passes." />
          <meta name="robots" content="noindex" />
        </Helmet>
      <section className="min-h-screen px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 style={hFont} className="text-3xl font-black text-foreground uppercase tracking-wide">Admin Dashboard</h1>
              <p style={bFont} className="text-muted-foreground text-sm mt-1">MARATHAX 2027 — Registration Management</p>
            </div>
            <button onClick={() => fetchData(token, search, statusFilter)} style={bFont}
              className="px-4 py-2 rounded-lg border border-[hsl(var(--border-mid))] text-muted-foreground text-sm hover:border-primary hover:text-primary transition-colors">
              ↻ Refresh
            </button>
          </div>

          {/* Stats */}
          {data && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total', val: data.counts.total, cls: 'text-foreground' },
                { label: 'Confirmed', val: data.counts.confirmed, cls: 'text-green-400' },
                { label: 'Pending Verification', val: data.counts.pending_upi, cls: 'text-yellow-400' },
                { label: 'Rejected', val: data.counts.failed, cls: 'text-red-400' },
              ].map(s => (
                <div key={s.label} className="bg-card border border-[hsl(var(--border-subtle))] rounded-xl p-4 text-center">
                  <p style={hFont} className={`text-3xl font-black ${s.cls}`}>{s.val}</p>
                  <p style={bFont} className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name, email, phone, UTR…"
              style={bFont}
              className="flex-1 bg-card border border-[hsl(var(--border-mid))] rounded-lg px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary text-sm" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              style={bFont}
              className="bg-card border border-[hsl(var(--border-mid))] rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary text-sm">
              <option value="">All Statuses</option>
              <option value="pending_upi">Pending Verification</option>
              <option value="confirmed">Confirmed</option>
              <option value="failed">Rejected</option>
            </select>
          </div>

          {loading && <p style={bFont} className="text-muted-foreground text-sm">Loading…</p>}
          {error && <p style={bFont} className="text-destructive text-sm">{error}</p>}

          {/* Registrations */}
          {data && (
            <div className="space-y-3">
              {data.registrations.length === 0 && (
                <p style={bFont} className="text-muted-foreground text-sm">No registrations found.</p>
              )}
              {data.registrations.map(reg => (
                <div key={reg.id} className="bg-card border border-[hsl(var(--border-subtle))] rounded-xl overflow-hidden">
                  {/* Row header */}
                  <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setExpanded(expanded === reg.id ? null : reg.id)}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span style={hFont} className="text-base font-black text-foreground">{reg.fullName}</span>
                        <span style={bFont} className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${STATUS_COLORS[reg.status] ?? 'text-muted-foreground border-muted'}`}>
                          {STATUS_LABELS[reg.status] ?? reg.status}
                        </span>
                        {reg.regCode && <span style={bFont} className="text-xs text-primary font-mono">{reg.regCode}</span>}
                      </div>
                      <div style={bFont} className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-3">
                        <span>{reg.category}</span>
                        <span>₹{(reg.feePaise / 100).toLocaleString('en-IN')}</span>
                        <span>{reg.email}</span>
                        <span>{reg.phone}</span>
                        <span>{new Date(reg.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                    <span className="text-muted-foreground text-sm">{expanded === reg.id ? '▲' : '▼'}</span>
                  </div>

                  {/* Expanded details */}
                  {expanded === reg.id && (
                    <div className="border-t border-[hsl(var(--border-subtle))] px-5 py-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal */}
                        <div>
                          <p style={hFont} className="text-xs font-black text-primary uppercase tracking-widest mb-3">Personal Details</p>
                          <table className="w-full text-sm" style={bFont}>
                            <tbody className="divide-y divide-[hsl(var(--border-subtle))]">
                              {[
                                ['DOB', reg.dob], ['Age', reg.age], ['Gender', reg.gender],
                                ['Blood Group', reg.bloodGroup || '—'], ['WhatsApp', reg.whatsapp],
                                ['City / State', `${reg.city}, ${reg.state}`],
                                ['Address', reg.address],
                                ['Emergency', `${reg.emergencyContact} — ${reg.emergencyPhone}`],
                                ...(reg.guardianName ? [['Guardian', `${reg.guardianName} — ${reg.guardianPhone}`]] as [string,string][] : []),
                              ].map(([k, v]) => (
                                <tr key={k}>
                                  <td className="py-1.5 pr-4 text-muted-foreground w-32 flex-shrink-0">{k}</td>
                                  <td className="py-1.5 text-foreground break-all">{v}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Payment & Medical */}
                        <div>
                          <p style={hFont} className="text-xs font-black text-primary uppercase tracking-widest mb-3">Payment & Health</p>
                          <table className="w-full text-sm" style={bFont}>
                            <tbody className="divide-y divide-[hsl(var(--border-subtle))]">
                              {[
                                ['UTR Number', reg.utrNumber || '—'],
                                ['Payment Date', reg.paymentDate || '—'],
                                ['Amount Paid', reg.paymentAmount ? `₹${reg.paymentAmount}` : '—'],
                                ['Medical', reg.medicalCondition?.toUpperCase() ?? '—'],
                                ...(reg.medicalDetails ? [['Med Details', reg.medicalDetails]] as [string,string][] : []),
                                ['Signature', reg.digitalSignature || '—'],
                                ['Photo Consent', reg.photoConsent === 'yes' ? 'Yes' : 'No'],
                              ].map(([k, v]) => (
                                <tr key={k}>
                                  <td className="py-1.5 pr-4 text-muted-foreground w-32 flex-shrink-0">{k}</td>
                                  <td className={`py-1.5 break-all ${k === 'UTR Number' ? 'text-primary font-mono font-semibold' : 'text-foreground'}`}>{v}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          {/* Screenshot */}
                          {reg.screenshotPath && (
                            <div className="mt-3">
                              <a href={`/airo-assets/uploads/marathax-screenshots/${reg.screenshotPath}`}
                                target="_blank" rel="noopener noreferrer"
                                style={bFont}
                                className="inline-flex items-center gap-2 text-xs text-primary hover:underline border border-primary/30 rounded-lg px-3 py-1.5">
                                📎 View Payment Screenshot
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      {reg.status === 'pending_upi' && (
                        <div className="mt-5 pt-4 border-t border-[hsl(var(--border-subtle))] flex flex-wrap gap-3 items-center">
                          <button
                            onClick={() => handleAction(reg.id, 'confirm')}
                            disabled={actionLoading === reg.id}
                            style={bFont}
                            className="px-5 py-2.5 rounded-lg bg-green-600 text-white font-bold text-sm hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {actionLoading === reg.id ? 'Processing…' : '✓ Confirm Payment & Send Arena Pass'}
                          </button>
                          <button
                            onClick={() => handleAction(reg.id, 'reject')}
                            disabled={actionLoading === reg.id}
                            style={bFont}
                            className="px-5 py-2.5 rounded-lg bg-red-600/20 border border-red-500/40 text-red-400 font-bold text-sm hover:bg-red-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {actionLoading === reg.id ? 'Processing…' : '✗ Reject Payment'}
                          </button>
                          {actionMsg[reg.id] && (
                            <span style={bFont} className="text-sm text-green-400">{actionMsg[reg.id]}</span>
                          )}
                        </div>
                      )}
                      {reg.status === 'confirmed' && (
                        <div className="mt-4 pt-4 border-t border-[hsl(var(--border-subtle))]">
                          <span style={bFont} className="text-sm text-green-400 font-semibold">✓ Payment confirmed — Arena Pass issued</span>
                          {actionMsg[reg.id] && <span style={bFont} className="text-sm text-muted-foreground ml-3">{actionMsg[reg.id]}</span>}
                        </div>
                      )}
                      {reg.status === 'failed' && (
                        <div className="mt-4 pt-4 border-t border-[hsl(var(--border-subtle))]">
                          <span style={bFont} className="text-sm text-red-400 font-semibold">✗ Payment rejected</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </MarathaxLayout>
  );
}
