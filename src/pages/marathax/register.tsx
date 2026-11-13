import { useState, useCallback } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import MarathaxLayout from '@/components/marathax/MarathaxLayout';
import { CATEGORY_KEYS, getCategoryInfo } from '@/components/marathax/categoryConfig';

// ── Types ─────────────────────────────────────────────────────────────────────
interface FormData {
  fullName: string;dob: string;age: string;gender: string;bloodGroup: string;
  phone: string;whatsapp: string;email: string;
  city: string;state: string;address: string;
  emergencyContact: string;emergencyPhone: string;
  guardianName: string;guardianPhone: string;guardianConsent: boolean;
  fitToParticipate: boolean;medicalDisclosure: boolean;understandsRisks: boolean;
  agreeToStop: boolean;understandsEmergency: boolean;
  medicalCondition: 'yes' | 'no' | '';medicalDetails: string;
  readRules: boolean;followOfficials: boolean;understandsRefund: boolean;
  infoAccurate: boolean;acceptsTerms: boolean;photoConsent: boolean;
  digitalSignature: string;guardianSignature: string;
  category: string;utrNumber: string;paymentDate: string;paymentAmount: string;
  screenshotFile: File | null;screenshotPath: string;
}

const INITIAL: FormData = {
  fullName: '', dob: '', age: '', gender: '', bloodGroup: '', phone: '', whatsapp: '',
  email: '', city: '', state: '', address: '', emergencyContact: '', emergencyPhone: '',
  guardianName: '', guardianPhone: '', guardianConsent: false,
  fitToParticipate: false, medicalDisclosure: false, understandsRisks: false,
  agreeToStop: false, understandsEmergency: false, medicalCondition: '', medicalDetails: '',
  readRules: false, followOfficials: false, understandsRefund: false,
  infoAccurate: false, acceptsTerms: false, photoConsent: false,
  digitalSignature: '', guardianSignature: '',
  category: '', utrNumber: '', paymentDate: '', paymentAmount: '',
  screenshotFile: null, screenshotPath: ''
};

const BLOOD_GROUPS = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−', 'Unknown'];
const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];
const INDIAN_STATES = [
'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'];


const TOTAL_STEPS = 5;
const STEP_LABELS = ['Personal Info', 'Health', 'Rules', 'Signature', 'Payment'];
type Stage = 'wizard' | 'review' | 'submitting' | 'done';

function calcAge(dob: string): string {
  if (!dob) return '';
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || m === 0 && today.getDate() < birth.getDate()) age--;
  return age >= 0 ? String(age) : '';
}
function todayStr(): string {return new Date().toISOString().split('T')[0];}

// ── Shared class strings (no hex literals) ────────────────────────────────────
const inputCls = 'w-full bg-card border border-[hsl(var(--border-mid))] rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm';
const labelCls = 'block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1';
const errCls = 'text-destructive text-xs mt-1';
const checkboxCls = 'w-5 h-5 rounded border-[hsl(var(--border-strong))] bg-card accent-primary cursor-pointer flex-shrink-0';
const panelCls = 'p-4 rounded-xl bg-card border border-[hsl(var(--border-subtle))]';

export default function MarathaxRegisterPage() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [step, setStep] = useState(1);
  const [stage, setStage] = useState<Stage>('wizard');
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [submitError, setSubmitError] = useState('');
  const [regCode, setRegCode] = useState('');
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [confirmReview, setConfirmReview] = useState(false);

  const hFont = { fontFamily: 'var(--font-heading)' };
  const bFont = { fontFamily: 'var(--font-sans)' };
  const isUnder18 = parseInt(form.age || '0', 10) < 18 && form.age !== '';
  const selectedCat = getCategoryInfo(form.category);

  const set = useCallback((field: keyof FormData, value: string | boolean | File | null) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {const n = { ...prev };delete n[field as string];return n;});
  }, []);

  function handleDobChange(val: string) {
    const age = calcAge(val);
    setForm((prev) => ({ ...prev, dob: val, age }));
    setErrors((prev) => {const n = { ...prev };delete n['dob'];delete n['age'];return n;});
  }

  function validateStep(s: number): boolean {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!form.fullName.trim()) e.fullName = 'Full name is required.';
      if (!form.dob) e.dob = 'Date of birth is required.';
      if (!form.age) e.age = 'Age could not be calculated. Check date of birth.';
      if (!form.gender) e.gender = 'Gender is required.';
      if (!/^\d{10}$/.test(form.phone.trim())) e.phone = 'Enter a valid 10-digit mobile number.';
      if (!/^\d{10}$/.test(form.whatsapp.trim())) e.whatsapp = 'Enter a valid 10-digit WhatsApp number.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
      if (!form.city.trim()) e.city = 'City is required.';
      if (!form.state) e.state = 'State is required.';
      if (!form.address.trim()) e.address = 'Address is required.';
      if (!form.emergencyContact.trim()) e.emergencyContact = 'Emergency contact name is required.';
      if (!/^\d{10}$/.test(form.emergencyPhone.trim())) e.emergencyPhone = 'Enter a valid 10-digit emergency number.';
      if (isUnder18) {
        if (!form.guardianName.trim()) e.guardianName = 'Guardian name is required for participants under 18.';
        if (!/^\d{10}$/.test(form.guardianPhone.trim())) e.guardianPhone = 'Enter a valid 10-digit guardian number.';
        if (!form.guardianConsent) e.guardianConsent = 'Guardian consent is required.';
      }
    }
    if (s === 2) {
      if (!form.fitToParticipate) e.fitToParticipate = 'You must confirm physical fitness.';
      if (!form.medicalDisclosure) e.medicalDisclosure = 'Medical disclosure is required.';
      if (!form.understandsRisks) e.understandsRisks = 'Risk acknowledgement is required.';
      if (!form.agreeToStop) e.agreeToStop = 'This agreement is required.';
      if (!form.understandsEmergency) e.understandsEmergency = 'Emergency understanding is required.';
      if (!form.medicalCondition) e.medicalCondition = 'Please answer the medical condition question.';
      if (form.medicalCondition === 'yes' && !form.medicalDetails.trim())
      e.medicalDetails = 'Please describe your medical condition.';
    }
    if (s === 3) {
      if (!form.readRules) e.readRules = 'You must confirm reading the rules.';
      if (!form.followOfficials) e.followOfficials = 'You must agree to follow officials.';
      if (!form.understandsRefund) e.understandsRefund = 'You must acknowledge the refund policy.';
      if (!form.infoAccurate) e.infoAccurate = 'You must confirm information accuracy.';
      if (!form.acceptsTerms) e.acceptsTerms = 'You must accept the terms and conditions.';
    }
    if (s === 4) {
      if (!form.digitalSignature.trim()) e.digitalSignature = 'Digital signature is required.';
      if (form.digitalSignature.trim().toLowerCase() !== form.fullName.trim().toLowerCase())
      e.digitalSignature = 'Signature must match your full name exactly.';
      if (isUnder18 && !form.guardianSignature.trim())
      e.guardianSignature = 'Guardian signature is required for participants under 18.';
    }
    if (s === 5) {
      if (!form.category) e.category = 'Please select a category.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (validateStep(step)) {
      if (step === TOTAL_STEPS) setStage('review');else
      setStep((s) => s + 1);
    }
  }
  function handleBack() {if (step > 1) setStep((s) => s - 1);}

  function loadRazorpay(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      if ((window as unknown as { Razorpay?: unknown }).Razorpay) return resolve(true);
      const el = document.createElement('script');
      el.src = 'https://checkout.razorpay.com/v1/checkout.js';
      el.onload = () => resolve(true);
      el.onerror = () => resolve(false);
      document.body.appendChild(el);
    });
  }

  async function handleSubmit() {
    setSubmitError('');
    if (!confirmReview) {
      setSubmitError('Please tick the confirmation box before paying.');
      return;
    }
    setStage('submitting');
    try {
      // 1) Server creates the order. The amount is decided by the server from the category —
      //    the browser never sends (and cannot change) the amount.
      const payload = {
        fullName: form.fullName, email: form.email, phone: form.phone,
        whatsapp: form.whatsapp, dob: form.dob, age: form.age,
        gender: form.gender, bloodGroup: form.bloodGroup,
        city: form.city, state: form.state, address: form.address,
        emergencyContact: form.emergencyContact, emergencyPhone: form.emergencyPhone,
        guardianName: form.guardianName, guardianPhone: form.guardianPhone,
        guardianConsent: form.guardianConsent ? 'yes' : 'no',
        medicalCondition: form.medicalCondition, medicalDetails: form.medicalDetails,
        photoConsent: form.photoConsent ? 'yes' : 'no',
        rulesAccepted: 'yes', digitalSignature: form.digitalSignature,
        category: form.category
      };
      const orderRes = await fetch('/api/marathax/create-order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const order = (await orderRes.json()) as {
        orderId?: string; amount?: number; currency?: string; keyId?: string;
        error?: string; message?: string;
      };
      if (!orderRes.ok || !order.orderId || !order.keyId || !order.amount) {
        throw new Error(order.message ?? order.error ?? 'Could not start payment. Please try again.');
      }

      // 2) Open Razorpay Checkout locked to that order.
      const ok = await loadRazorpay();
      if (!ok) throw new Error('Could not load the payment window. Check your internet and try again.');

      type RzpSuccess = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
      const RazorpayCtor = (window as unknown as {
        Razorpay: new (o: Record<string, unknown>) => { open: () => void; on: (e: string, cb: (r: { error?: { description?: string } }) => void) => void };
      }).Razorpay;

      await new Promise<void>((resolve, reject) => {
        const rzp = new RazorpayCtor({
          key: order.keyId,
          order_id: order.orderId,
          amount: order.amount,
          currency: order.currency ?? 'INR',
          name: 'MARATHA X',
          description: `Registration — ${form.category}`,
          prefill: { name: form.fullName, email: form.email, contact: form.phone },
          theme: { color: '#E8820C' },
          modal: { ondismiss: () => reject(new Error('Payment window closed. No money was charged unless you completed the payment.')) },
          handler: async (r: RzpSuccess) => {
            try {
              // 3) Server verifies signature + real amount with Razorpay before issuing a pass.
              const vRes = await fetch('/api/marathax/verify-payment', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(r)
              });
              const v = (await vRes.json()) as { regCode?: string; qrImageUrl?: string; error?: string };
              if (!vRes.ok || !v.regCode) throw new Error(v.error ?? 'Payment verification failed.');
              setRegCode(v.regCode);
              setQrImageUrl(v.qrImageUrl ?? '');
              setStage('done');
              resolve();
            } catch (err) {reject(err);}
          }
        });
        rzp.on('payment.failed', (r) => reject(new Error(r.error?.description ?? 'Payment failed. Please try again.')));
        rzp.open();
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong.');
      setStage('review');
    }
  }

  // ── Sub-components ─────────────────────────────────────────────────────────
  function ProgressBar() {
    return (
      <div style={bFont} className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEP_LABELS.map((label, i) => {
            const n = i + 1;
            const done = n < step;const active = n === step;
            return (
              <div key={n} className="flex flex-col items-center gap-1 flex-1">
                <div className={[
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all',
                done ? 'bg-primary border-primary text-primary-foreground' : '',
                active ? 'border-primary text-primary bg-transparent' : '',
                !done && !active ? 'border-[hsl(var(--border-strong))] text-muted-foreground bg-transparent' : ''].
                join(' ')}>{done ? '✓' : n}</div>
                <span className={`text-[10px] hidden sm:block ${active ? 'text-primary' : done ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}>{label}</span>
              </div>);

          })}
        </div>
        <div className="relative h-1 bg-muted rounded-full">
          <div className="absolute left-0 top-0 h-1 rounded-full bg-primary transition-all duration-500"
          style={{ width: `${(step - 1) / (TOTAL_STEPS - 1) * 100}%` }} />
        </div>
      </div>);

  }

  function SectionTitle({ title, sub }: {title: string;sub?: string;}) {
    return (
      <div className="mb-6">
        <h2 style={hFont} className="text-2xl font-black text-foreground uppercase tracking-wide">{title}</h2>
        {sub && <p style={bFont} className="text-muted-foreground text-sm mt-1">{sub}</p>}
      </div>);

  }

  function NavButtons({ onNext, nextLabel = 'Continue', disableNext = false }: {onNext: () => void;nextLabel?: string;disableNext?: boolean;}) {
    return (
      <div className="flex gap-3 mt-8">
        {step > 1 &&
        <button type="button" onClick={handleBack} style={bFont}
        className="flex-1 py-3 rounded-lg border border-[hsl(var(--border-strong))] text-muted-foreground font-semibold hover:border-[hsl(var(--border-hover))] transition-colors">
            ← Back
          </button>
        }
        <button type="button" onClick={onNext} disabled={disableNext} style={bFont}
        className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-black uppercase tracking-wider hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {nextLabel}
        </button>
      </div>);

  }

  function CheckRow({ field, label, required = true }: {field: keyof FormData;label: string;required?: boolean;}) {
    return (
      <label className="flex items-start gap-3 cursor-pointer group">
        <input type="checkbox" className={checkboxCls} checked={!!form[field]}
        onChange={(e) => set(field, e.target.checked)} />
        <span style={bFont} className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
          {label} {required && <span className="text-destructive">*</span>}
        </span>
      </label>);

  }

  // ── DONE ──────────────────────────────────────────────────────────────────
  if (stage === 'done') {
    return (
      <MarathaxLayout>
        <Helmet>
          <title>Registration Confirmed — MARATHAX 2027</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <section className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-lg w-full text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">✅</span>
            </div>
            <h1 style={hFont} className="text-3xl font-black text-foreground uppercase tracking-wide mb-3">You're In!</h1>
            <p style={bFont} className="text-muted-foreground mb-6">Payment confirmed. Your Arena Pass with your unique QR has also been emailed to {form.email}.</p>
            <div className="bg-card border border-[hsl(var(--border-subtle))] rounded-xl p-6 mb-6">
              {qrImageUrl &&
              <div className="inline-block p-3 bg-white rounded-xl mb-4">
                  <img src={qrImageUrl} alt="Your unique MARATHAX entry QR" className="w-52 h-52" />
                </div>
              }
              <p style={bFont} className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Registration Code</p>
              <p style={hFont} className="text-3xl font-black text-primary tracking-widest">{regCode}</p>
              <p style={bFont} className="text-xs text-muted-foreground mt-2">Show this QR at the check-in desk. Screenshot it or use the emailed copy.</p>
              {qrImageUrl && <a href={qrImageUrl} download={`MARATHAX-${regCode}.png`} className="inline-block mt-3 text-sm text-primary hover:underline" style={bFont}>Download QR</a>}
            </div>
            <p style={bFont} className="text-sm text-muted-foreground">
              Questions? WhatsApp <a href="https://wa.me/917304103956" className="text-primary hover:underline">+91 73041 03956</a> or email <a href="mailto:reservation@marathax.com" className="text-primary hover:underline">reservation@marathax.com</a>
            </p>
          </div>
        </section>
      </MarathaxLayout>);

  }

  // ── REVIEW ─────────────────────────────────────────────────────────────────
  if (stage === 'review' || stage === 'submitting') {
    const fee = getCategoryInfo(form.category)?.fee ?? 0;
    return (
      <MarathaxLayout>
        <Helmet>
          <title>Review Registration — MARATHAX 2027</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <section className="min-h-screen px-4 py-16 max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h1 style={hFont} className="text-3xl font-black text-foreground uppercase tracking-wide">Review Your Registration</h1>
            <p style={bFont} className="text-muted-foreground text-sm mt-2">Please verify all details before final submission.</p>
          </div>
          {submitError &&
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm" style={bFont}>{submitError}</div>
          }
          {[
          { title: 'Personal Information', rows: [
            ['Full Name', form.fullName], ['Date of Birth', form.dob], ['Age', form.age],
            ['Gender', form.gender], ['Blood Group', form.bloodGroup || '—'],
            ['Mobile', form.phone], ['WhatsApp', form.whatsapp], ['Email', form.email],
            ['City', form.city], ['State', form.state], ['Address', form.address],
            ['Emergency Contact', form.emergencyContact], ['Emergency Phone', form.emergencyPhone],
            ...(isUnder18 ? [['Guardian Name', form.guardianName], ['Guardian Phone', form.guardianPhone]] as [string, string][] : [])] as
            [string, string][] },
          { title: 'Health Declaration', rows: [
            ['Medical Condition', form.medicalCondition.toUpperCase()],
            ...(form.medicalCondition === 'yes' ? [['Medical Details', form.medicalDetails]] as [string, string][] : [])] as
            [string, string][] },
          { title: 'Payment', rows: [
            ['Category', form.category], ['Amount to pay', `₹${fee.toLocaleString('en-IN')}`],
            ['Payment method', 'Razorpay secure checkout (UPI / Card / NetBanking)']] as
            [string, string][] },
          { title: 'Signature', rows: [
            ['Digital Signature', form.digitalSignature],
            ...(isUnder18 ? [['Guardian Signature', form.guardianSignature]] as [string, string][] : [])] as
            [string, string][] }].
          map((section) =>
          <div key={section.title} className="mb-4 bg-card border border-[hsl(var(--border-subtle))] rounded-xl overflow-hidden">
              <div className="px-5 py-3 bg-[hsl(var(--surface-inner))] border-b border-[hsl(var(--border-subtle))]">
                <span style={hFont} className="text-xs font-black text-primary uppercase tracking-widest">{section.title}</span>
              </div>
              <div className="divide-y divide-[hsl(var(--divide-dark))]">
                {section.rows.map(([k, v]) =>
              <div key={k} className="flex px-5 py-3 gap-4">
                    <span style={bFont} className="text-xs text-muted-foreground w-40 flex-shrink-0">{k}</span>
                    <span style={bFont} className="text-sm text-foreground break-all">{v}</span>
                  </div>
              )}
              </div>
            </div>
          )}
          <div className="mt-6 p-4 rounded-lg bg-card border border-[hsl(var(--border-mid))]">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className={checkboxCls} checked={confirmReview} onChange={(e) => setConfirmReview(e.target.checked)} />
              <span style={bFont} className="text-sm text-muted-foreground leading-relaxed">
                I confirm that all information submitted by me is correct. <span className="text-destructive">*</span>
              </span>
            </label>
          </div>
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={() => {setStage('wizard');setStep(5);}} style={bFont}
            className="flex-1 py-3 rounded-lg border border-[hsl(var(--border-strong))] text-muted-foreground font-semibold hover:border-[hsl(var(--border-hover))] transition-colors">
              ← Edit
            </button>
            <button type="button" onClick={handleSubmit} disabled={stage === 'submitting'} style={bFont}
            className="flex-1 py-4 rounded-lg bg-primary text-primary-foreground font-black uppercase tracking-wider hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm">
              {stage === 'submitting' ? 'Processing…' : `Pay ₹${fee.toLocaleString('en-IN')} & Register`}
            </button>
          </div>
        </section>
      </MarathaxLayout>);

  }

  // ── WIZARD ─────────────────────────────────────────────────────────────────
  return (
    <MarathaxLayout>
      <Helmet>
        <title>Register — MARATHAX Fitness Challenge 2027</title>
        <meta name="description" content="Register for MARATHAX 2027 — Mumbai's premier military-inspired fitness challenge. 10 January 2027." />
        <meta name="robots" content="noindex" />
      </Helmet>
      <section className="min-h-screen px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p style={bFont} className="text-xs text-primary uppercase tracking-widest font-semibold mb-2">10 January 2027 · Mumbai</p>
            <h1 style={hFont} className="text-4xl md:text-5xl font-black text-foreground uppercase tracking-tight">Athlete Registration</h1>
            <p style={bFont} className="text-muted-foreground text-sm mt-2">Step {step} of {TOTAL_STEPS} — {STEP_LABELS[step - 1]}</p>
          </div>
          <ProgressBar />

          {/* ── STEP 1: Personal Info ── */}
          {step === 1 &&
          <div>
              <SectionTitle title="Personal Information" sub="All fields marked * are mandatory." />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelCls}>Full Name *</label>
                  <input className={inputCls} placeholder="As on government ID" value={form.fullName}
                onChange={(e) => set('fullName', e.target.value)} />
                  {errors.fullName && <p className={errCls}>{errors.fullName}</p>}
                </div>
                <div>
                  <label className={labelCls}>Date of Birth *</label>
                  <input type="date" className={inputCls} max={todayStr()} value={form.dob}
                onChange={(e) => handleDobChange(e.target.value)} />
                  {errors.dob && <p className={errCls}>{errors.dob}</p>}
                </div>
                <div>
                  <label className={labelCls}>Age (auto-calculated)</label>
                  <input className={inputCls + ' opacity-60 cursor-not-allowed'} readOnly
                value={form.age ? `${form.age} years` : ''} placeholder="Select date of birth" />
                  {errors.age && <p className={errCls}>{errors.age}</p>}
                </div>
                <div>
                  <label className={labelCls}>Gender *</label>
                  <select className={inputCls} value={form.gender} onChange={(e) => set('gender', e.target.value)}>
                    <option value="">Select gender</option>
                    {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                  {errors.gender && <p className={errCls}>{errors.gender}</p>}
                </div>
                <div>
                  <label className={labelCls}>Blood Group</label>
                  <select className={inputCls} value={form.bloodGroup} onChange={(e) => set('bloodGroup', e.target.value)}>
                    <option value="">Select blood group</option>
                    {BLOOD_GROUPS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Mobile Number *</label>
                  <input className={inputCls} placeholder="10-digit number" maxLength={10} value={form.phone}
                onChange={(e) => set('phone', e.target.value.replace(/\D/g, ''))} />
                  {errors.phone && <p className={errCls}>{errors.phone}</p>}
                </div>
                <div>
                  <label className={labelCls}>WhatsApp Number *</label>
                  <input className={inputCls} placeholder="10-digit number" maxLength={10} value={form.whatsapp}
                onChange={(e) => set('whatsapp', e.target.value.replace(/\D/g, ''))} />
                  {errors.whatsapp && <p className={errCls}>{errors.whatsapp}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Email Address *</label>
                  <input type="email" className={inputCls} placeholder="your@email.com" value={form.email}
                onChange={(e) => set('email', e.target.value)} />
                  {errors.email && <p className={errCls}>{errors.email}</p>}
                </div>
                <div>
                  <label className={labelCls}>City *</label>
                  <input className={inputCls} placeholder="Your city" value={form.city}
                onChange={(e) => set('city', e.target.value)} />
                  {errors.city && <p className={errCls}>{errors.city}</p>}
                </div>
                <div>
                  <label className={labelCls}>State *</label>
                  <select className={inputCls} value={form.state} onChange={(e) => set('state', e.target.value)}>
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <p className={errCls}>{errors.state}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Complete Address *</label>
                  <textarea className={inputCls + ' resize-none'} rows={2}
                placeholder="House/Flat, Street, Area, PIN code"
                value={form.address} onChange={(e) => set('address', e.target.value)} />
                  {errors.address && <p className={errCls}>{errors.address}</p>}
                </div>
                <div>
                  <label className={labelCls}>Emergency Contact Name *</label>
                  <input className={inputCls} placeholder="Full name" value={form.emergencyContact}
                onChange={(e) => set('emergencyContact', e.target.value)} />
                  {errors.emergencyContact && <p className={errCls}>{errors.emergencyContact}</p>}
                </div>
                <div>
                  <label className={labelCls}>Emergency Contact Number *</label>
                  <input className={inputCls} placeholder="10-digit number" maxLength={10} value={form.emergencyPhone}
                onChange={(e) => set('emergencyPhone', e.target.value.replace(/\D/g, ''))} />
                  {errors.emergencyPhone && <p className={errCls}>{errors.emergencyPhone}</p>}
                </div>
              </div>
              {isUnder18 &&
            <div className="mt-6 p-5 rounded-xl border border-yellow-500/30 bg-yellow-500/5">
                  <p style={hFont} className="text-yellow-400 font-black uppercase tracking-wide text-sm mb-4">Parent / Guardian Details Required (Under 18)</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Guardian Full Name *</label>
                      <input className={inputCls} placeholder="Parent or guardian name" value={form.guardianName}
                  onChange={(e) => set('guardianName', e.target.value)} />
                      {errors.guardianName && <p className={errCls}>{errors.guardianName}</p>}
                    </div>
                    <div>
                      <label className={labelCls}>Guardian Phone *</label>
                      <input className={inputCls} placeholder="10-digit number" maxLength={10} value={form.guardianPhone}
                  onChange={(e) => set('guardianPhone', e.target.value.replace(/\D/g, ''))} />
                      {errors.guardianPhone && <p className={errCls}>{errors.guardianPhone}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <CheckRow field="guardianConsent" label="I, the parent/guardian, give full consent for my child to participate in MARATHAX 2027 and accept all associated risks." />
                      {errors.guardianConsent && <p className={errCls}>{errors.guardianConsent}</p>}
                    </div>
                  </div>
                </div>
            }
              <NavButtons onNext={handleNext} />
            </div>
          }

          {/* ── STEP 2: Health & Medical ── */}
          {step === 2 &&
          <div>
              <SectionTitle title="Health & Medical Declaration" sub="All declarations are mandatory for participant safety." />
              <div className="space-y-4">
                <div className={panelCls + ' space-y-4'}>
                  <CheckRow field="fitToParticipate" label="I confirm that I am physically fit to participate in MARATHAX 2027, which includes running, strength exercises, and obstacle challenges." />
                  {errors.fitToParticipate && <p className={errCls}>{errors.fitToParticipate}</p>}
                  <CheckRow field="medicalDisclosure" label="I have disclosed all existing medical conditions, injuries, or physical limitations that may affect my participation." />
                  {errors.medicalDisclosure && <p className={errCls}>{errors.medicalDisclosure}</p>}
                  <CheckRow field="understandsRisks" label="I understand the physical risks associated with running, strength exercises, and obstacle-based challenges." />
                  {errors.understandsRisks && <p className={errCls}>{errors.understandsRisks}</p>}
                  <CheckRow field="agreeToStop" label="I agree to immediately stop participating if I experience pain, dizziness, breathlessness, or any medical emergency." />
                  {errors.agreeToStop && <p className={errCls}>{errors.agreeToStop}</p>}
                  <CheckRow field="understandsEmergency" label="I understand that emergency medical assistance will be available on-site and I consent to receiving it if required." />
                  {errors.understandsEmergency && <p className={errCls}>{errors.understandsEmergency}</p>}
                </div>
                <div className={panelCls}>
                  <p style={bFont} className="text-sm text-foreground font-semibold mb-3">Do you have any existing medical condition, injury, or physical limitation? <span className="text-destructive">*</span></p>
                  <div className="flex gap-4">
                    {(['yes', 'no'] as const).map((v) =>
                  <label key={v} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="medicalCondition" value={v}
                    checked={form.medicalCondition === v}
                    onChange={() => set('medicalCondition', v)}
                    className="accent-primary" />
                        <span style={bFont} className="text-sm text-foreground uppercase font-semibold">{v.toUpperCase()}</span>
                      </label>
                  )}
                  </div>
                  {errors.medicalCondition && <p className={errCls}>{errors.medicalCondition}</p>}
                  {form.medicalCondition === 'yes' &&
                <div className="mt-3">
                      <label className={labelCls}>Please describe your condition *</label>
                      <textarea className={inputCls + ' resize-none'} rows={3}
                  placeholder="Describe your medical condition, injury, or limitation"
                  value={form.medicalDetails} onChange={(e) => set('medicalDetails', e.target.value)} />
                      {errors.medicalDetails && <p className={errCls}>{errors.medicalDetails}</p>}
                    </div>
                }
                </div>
              </div>
              <NavButtons onNext={handleNext} />
            </div>
          }

          {/* ── STEP 3: Rules ── */}
          {step === 3 &&
          <div>
              <SectionTitle title="Rules & Regulations" sub="Read all rules carefully before accepting." />
              <div className={panelCls + ' mb-5 max-h-64 overflow-y-auto'}>
                <p style={hFont} className="text-primary font-black uppercase tracking-wide text-xs mb-3">Official MARATHAX Competition Rules</p>
                <div style={bFont} className="text-sm text-muted-foreground space-y-2 leading-relaxed">
                  <p><strong className="text-foreground">1. Eligibility:</strong> Rising Star: 8–15 years. Open: 16–55 years. Doubles: 18–55 years.</p>
                  <p><strong className="text-foreground">2. Attire:</strong> Appropriate athletic attire and closed-toe shoes. No jewellery or accessories that may cause injury.</p>
                  <p><strong className="text-foreground">3. Conduct:</strong> Unsportsmanlike conduct, cheating, or interference results in immediate disqualification.</p>
                  <p><strong className="text-foreground">4. Stations:</strong> All 7 stations must be completed in sequence. Skipping a station results in disqualification.</p>
                  <p><strong className="text-foreground">5. Officials:</strong> Decisions of event officials are final. Disputes must be raised within 15 minutes.</p>
                  <p><strong className="text-foreground">6. Safety:</strong> Participants must stop immediately upon instruction from medical or safety personnel.</p>
                  <p><strong className="text-foreground">7. Refund Policy:</strong> Registrations are non-refundable. Event cancellations transfer to the rescheduled date.</p>
                  <p><strong className="text-foreground">8. Media:</strong> MARATHAX may use event photographs and videos for promotional purposes unless opted out.</p>
                  <p><strong className="text-foreground">9. Liability:</strong> Participants compete at their own risk. MARATHAX is not liable for injuries sustained during the event.</p>
                  <p><strong className="text-foreground">10. Doubles:</strong> Both partners must be present at check-in. Substitutions are not permitted after registration closes.</p>
                </div>
              </div>
              <div className={panelCls + ' space-y-4'}>
                <CheckRow field="readRules" label="I have read and understood all MARATHAX competition rules." />
                {errors.readRules && <p className={errCls}>{errors.readRules}</p>}
                <CheckRow field="followOfficials" label="I agree to follow the instructions of all event officials." />
                {errors.followOfficials && <p className={errCls}>{errors.followOfficials}</p>}
                <CheckRow field="understandsRefund" label="I understand the refund and cancellation policy — registrations are non-refundable." />
                {errors.understandsRefund && <p className={errCls}>{errors.understandsRefund}</p>}
                <CheckRow field="infoAccurate" label="All information submitted by me is accurate and complete." />
                {errors.infoAccurate && <p className={errCls}>{errors.infoAccurate}</p>}
                <CheckRow field="acceptsTerms" label="I accept the MARATHAX competition terms and conditions." />
                {errors.acceptsTerms && <p className={errCls}>{errors.acceptsTerms}</p>}
                <div className="pt-2 border-t border-[hsl(var(--border-subtle))]">
                  <CheckRow field="photoConsent" label="I consent to MARATHAX using photographs and videos of me for promotional purposes. (Optional)" required={false} />
                </div>
              </div>
              <NavButtons onNext={handleNext} />
            </div>
          }

          {/* ── STEP 4: Signature ── */}
          {step === 4 &&
          <div>
              <SectionTitle title="Digital Signature" sub="Type your full legal name exactly as entered in Step 1." />
              <div className="space-y-5">
                <div className={panelCls}>
                  <label className={labelCls}>Athlete's Digital Signature *</label>
                  <p style={bFont} className="text-xs text-muted-foreground mb-3">Type your full name exactly as: <span className="text-primary">{form.fullName || '(your full name)'}</span></p>
                  <input className={inputCls + ' text-lg font-semibold'} placeholder="Type your full legal name"
                value={form.digitalSignature} onChange={(e) => set('digitalSignature', e.target.value)} />
                  {errors.digitalSignature && <p className={errCls}>{errors.digitalSignature}</p>}
                  <p style={bFont} className="text-xs text-muted-foreground/60 mt-2">Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                {isUnder18 &&
              <div className="p-5 rounded-xl border border-yellow-500/30 bg-yellow-500/5">
                    <p style={hFont} className="text-yellow-400 font-black uppercase tracking-wide text-sm mb-3">Parent / Guardian Signature *</p>
                    <label className={labelCls}>Guardian's Digital Signature *</label>
                    <p style={bFont} className="text-xs text-muted-foreground mb-3">Type guardian's full name exactly as: <span className="text-yellow-400">{form.guardianName || '(guardian name)'}</span></p>
                    <input className={inputCls + ' text-lg font-semibold'} placeholder="Type guardian's full legal name"
                value={form.guardianSignature} onChange={(e) => set('guardianSignature', e.target.value)} />
                    {errors.guardianSignature && <p className={errCls}>{errors.guardianSignature}</p>}
                  </div>
              }
                <div className="p-4 rounded-xl bg-[hsl(var(--surface-inner))] border border-[hsl(var(--border-subtle))]">
                  <p style={bFont} className="text-xs text-muted-foreground leading-relaxed">
                    By signing above, I declare that all information provided is accurate, I have read and accepted all MARATHAX rules and terms, and I participate at my own risk.
                  </p>
                </div>
              </div>
              <NavButtons onNext={handleNext} nextLabel="Proceed to Payment" />
            </div>
          }

          {/* ── STEP 5: Category & Payment ── */}
          {step === 5 &&
          <div>
              <SectionTitle title="Category & Payment" sub="Select your category. You will pay securely on the next screen via Razorpay (UPI, cards, netbanking)." />
              <div className="space-y-5">
                <div>
                  <label className={labelCls}>Competition Category *</label>
                  <select className={inputCls} value={form.category} onChange={(e) => set('category', e.target.value)}>
                    <option value="">Select your category</option>
                    {CATEGORY_KEYS.map((k) =>
                  <option key={k} value={k}>{k} — ₹{getCategoryInfo(k)?.fee.toLocaleString('en-IN')}</option>
                  )}
                  </select>
                  {errors.category && <p className={errCls}>{errors.category}</p>}
                </div>
                {selectedCat &&
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p style={bFont} className="text-xs text-muted-foreground">Registration Fee (fixed)</p>
                        <p style={hFont} className="text-3xl font-black text-primary">₹{selectedCat.fee.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="text-right">
                        <p style={bFont} className="text-xs text-muted-foreground">Category</p>
                        <p style={bFont} className="text-sm text-foreground font-semibold">{form.category}</p>
                      </div>
                    </div>
                  </div>
              }
                <div className={panelCls}>
                  <p style={bFont} className="text-xs text-muted-foreground leading-relaxed">
                    The amount is fixed by our server and cannot be changed. After a successful payment your registration is confirmed automatically and your unique entry QR is shown on screen and emailed to you.
                  </p>
                </div>
              </div>
              <NavButtons onNext={handleNext} nextLabel="Review & Pay" />
            </div>
          }
        </div>
      </section>
    </MarathaxLayout>);

}