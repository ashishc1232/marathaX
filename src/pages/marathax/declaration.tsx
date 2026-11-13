import { useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import MarathaxLayout from '@/components/marathax/MarathaxLayout';

const DECLARATIONS = [
  {
    id: 'fitness',
    heading: 'Physical Fitness',
    text: 'I confirm that I am in good physical health and have no known medical condition, injury, or illness that would prevent me from safely participating in MARATHAX. I have consulted a medical professional if required.',
  },
  {
    id: 'medical',
    heading: 'Medical Disclosure',
    text: 'I confirm that I have disclosed any pre-existing medical conditions, allergies, or medications to the event organisers via the registration form. I understand that the organisers may use this information solely for emergency medical purposes.',
  },
  {
    id: 'liability',
    heading: 'Liability Waiver',
    text: 'I acknowledge that participation in MARATHAX involves physical exertion and inherent risks including but not limited to injury, illness, or death. I voluntarily assume all such risks and release MARATHAX, Hyfit Games, their officers, volunteers, sponsors, and partners from any and all liability arising from my participation.',
  },
  {
    id: 'rules',
    heading: 'Rules & Conduct',
    text: 'I agree to abide by all MARATHAX event rules, the decisions of the judges, and the instructions of event officials. I understand that unsportsmanlike conduct, cheating, or violation of rules may result in immediate disqualification without refund.',
  },
  {
    id: 'media',
    heading: 'Media & Photography',
    text: 'I grant MARATHAX and Hyfit Games the right to photograph, film, and record my participation and to use such media for promotional, marketing, and editorial purposes without compensation or further consent.',
  },
  {
    id: 'age',
    heading: 'Age & Eligibility',
    text: 'I confirm that the age group and category I have registered under accurately reflects my date of birth and eligibility. I understand that misrepresentation of age or eligibility will result in disqualification and forfeiture of any prizes.',
  },
  {
    id: 'emergency',
    heading: 'Emergency Medical Treatment',
    text: 'In the event of an emergency, I authorise MARATHAX event officials and medical personnel to seek and administer emergency medical treatment on my behalf. I accept responsibility for any associated costs.',
  },
];

interface DeclForm {
  fullName: string;
  registrationId: string;
  date: string;
  signature: string;
  checks: Record<string, boolean>;
}

const today = new Date().toISOString().split('T')[0];

const INITIAL: DeclForm = {
  fullName: '',
  registrationId: '',
  date: today,
  signature: '',
  checks: Object.fromEntries(DECLARATIONS.map((d) => [d.id, false])),
};

export default function MarathaxDeclarationPage() {
  const [form, setForm] = useState<DeclForm>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const allChecked = DECLARATIONS.every((d) => form.checks[d.id]);

  function handleText(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function handleCheck(id: string) {
    setForm((prev) => {
      const checks = { ...prev.checks, [id]: !prev.checks[id] };
      return { ...prev, checks };
    });
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: '' }));
  }

  function handleAgreeAll() {
    const next = !allChecked;
    setForm((prev) => ({
      ...prev,
      checks: Object.fromEntries(DECLARATIONS.map((d) => [d.id, next])),
    }));
    DECLARATIONS.forEach((d) => {
      if (errors[d.id]) setErrors((prev) => ({ ...prev, [d.id]: '' }));
    });
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required.';
    if (!form.date) e.date = 'Date is required.';
    if (!form.signature.trim()) e.signature = 'Please type your full name as signature.';
    DECLARATIONS.forEach((d) => {
      if (!form.checks[d.id]) e[d.id] = 'You must accept this declaration.';
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  }

  const inputClass = (field: string) =>
    `w-full bg-muted border rounded px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
      errors[field] ? 'border-destructive' : 'border-border focus:border-primary'
    }`;

  const labelClass = 'block text-xs font-bold uppercase tracking-widest text-foreground mb-2';

  if (submitted) {
    return (
      <MarathaxLayout>
        <Helmet>
          <title>Declaration Submitted — MARATHAX</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <main className="min-h-screen flex items-center justify-center px-4 pt-20">
          <div className="max-w-lg w-full text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-6">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-primary" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1
              className="text-foreground font-black uppercase text-3xl sm:text-4xl mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Declaration Accepted
            </h1>
            <p className="text-muted-foreground text-base mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
              Thank you, <strong className="text-foreground">{form.fullName}</strong>. Your declaration for MARATHAX has been recorded.
            </p>
            <p className="text-muted-foreground text-sm mb-8" style={{ fontFamily: 'var(--font-sans)' }}>
              Please carry a copy of this declaration to the event venue on race day.
            </p>
            <div className="bg-card border border-border rounded-lg p-5 text-left mb-8 space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                Submission Summary
              </p>
              <p className="text-sm text-foreground" style={{ fontFamily: 'var(--font-sans)' }}>
                <span className="text-muted-foreground">Name: </span>{form.fullName}
              </p>
              {form.registrationId && (
                <p className="text-sm text-foreground" style={{ fontFamily: 'var(--font-sans)' }}>
                  <span className="text-muted-foreground">Registration ID: </span>{form.registrationId}
                </p>
              )}
              <p className="text-sm text-foreground" style={{ fontFamily: 'var(--font-sans)' }}>
                <span className="text-muted-foreground">Date: </span>{form.date}
              </p>
              <p className="text-sm text-foreground" style={{ fontFamily: 'var(--font-sans)' }}>
                <span className="text-muted-foreground">Signed as: </span>{form.signature}
              </p>
            </div>
            <button
              onClick={() => { setSubmitted(false); setForm(INITIAL); }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors underline"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Submit another declaration
            </button>
          </div>
        </main>
      </MarathaxLayout>
    );
  }

  return (
    <MarathaxLayout>
      <Helmet>
        <title>Participant Declaration — MARATHAX | India's Fittest Challenge</title>
        <meta name="description" content="Complete your MARATHAX participant declaration — fitness confirmation, liability waiver, and event rules acceptance." />
        <link rel="canonical" href="https://marathax.in/declaration" />
        <meta property="og:title" content="Participant Declaration — MARATHAX" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://marathax.in/declaration" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main className="bg-background pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── HEADER ── */}
          <div className="text-center mb-12">
            <p
              className="text-primary text-xs font-bold uppercase tracking-widest mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              MARATHAX 2027 — Mumbai Edition
            </p>
            <h1
              className="text-foreground font-black uppercase leading-none mb-4"
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.03em' }}
            >
              Participant Declaration
            </h1>
            <p className="text-muted-foreground text-base max-w-xl mx-auto" style={{ fontFamily: 'var(--font-sans)' }}>
              All participants must read and accept each declaration before race day. This form is mandatory for entry to the event.
            </p>
          </div>

          {/* ── NOTICE BANNER ── */}
          <div className="bg-primary/10 border border-primary/30 rounded-xl px-6 py-4 mb-10 flex gap-4 items-start">
            <svg className="text-primary mt-0.5 shrink-0" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
            </svg>
            <p className="text-sm text-foreground" style={{ fontFamily: 'var(--font-sans)' }}>
              This declaration is a legal document. By signing, you confirm that you have read, understood, and voluntarily agreed to all terms. Please do not proceed if you have any doubts — contact us at{' '}
              <a href="mailto:reservation@marathax.com" className="text-primary underline">reservation@marathax.com</a> first.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-8">

            {/* ── PARTICIPANT DETAILS ── */}
            <fieldset className="bg-card border border-border rounded-xl p-6 sm:p-8">
              <legend
                className="text-xs font-black uppercase tracking-widest text-primary px-2 mb-6"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Participant Details
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label htmlFor="fullName" className={labelClass} style={{ fontFamily: 'var(--font-heading)' }}>
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="As on government ID"
                    value={form.fullName}
                    onChange={handleText}
                    className={inputClass('fullName')}
                    style={{ fontFamily: 'var(--font-sans)' }}
                  />
                  {errors.fullName && <p className="text-destructive text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label htmlFor="registrationId" className={labelClass} style={{ fontFamily: 'var(--font-heading)' }}>
                    Registration ID (if available)
                  </label>
                  <input
                    id="registrationId"
                    name="registrationId"
                    type="text"
                    placeholder="e.g. MX-2027-00123"
                    value={form.registrationId}
                    onChange={handleText}
                    className={inputClass('registrationId')}
                    style={{ fontFamily: 'var(--font-sans)' }}
                  />
                </div>
                <div>
                  <label htmlFor="date" className={labelClass} style={{ fontFamily: 'var(--font-heading)' }}>
                    Date *
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleText}
                    className={inputClass('date')}
                    style={{ fontFamily: 'var(--font-sans)' }}
                  />
                  {errors.date && <p className="text-destructive text-xs mt-1">{errors.date}</p>}
                </div>
              </div>
            </fieldset>

            {/* ── DECLARATIONS ── */}
            <fieldset className="bg-card border border-border rounded-xl p-6 sm:p-8">
              <legend
                className="text-xs font-black uppercase tracking-widest text-primary px-2 mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Declarations
              </legend>
              <p className="text-muted-foreground text-xs mb-6" style={{ fontFamily: 'var(--font-sans)' }}>
                Read each statement carefully and tick the box to confirm your acceptance.
              </p>

              {/* Select All */}
              <button
                type="button"
                onClick={handleAgreeAll}
                className="flex items-center gap-3 mb-6 group"
                aria-pressed={allChecked}
              >
                <span
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                    allChecked ? 'bg-primary border-primary' : 'border-border group-hover:border-primary'
                  }`}
                  aria-hidden="true"
                >
                  {allChecked && (
                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none" aria-hidden="true">
                      <path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span
                  className="text-sm font-bold text-foreground uppercase tracking-widest"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Accept All Declarations
                </span>
              </button>

              <div className="space-y-5">
                {DECLARATIONS.map((decl, i) => (
                  <div
                    key={decl.id}
                    className={`border rounded-lg p-5 transition-colors ${
                      form.checks[decl.id] ? 'border-primary/40 bg-primary/5' : errors[decl.id] ? 'border-destructive/50 bg-destructive/5' : 'border-border'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleCheck(decl.id)}
                      className="flex gap-4 items-start w-full text-left"
                      aria-pressed={form.checks[decl.id]}
                    >
                      <span
                        className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                          form.checks[decl.id] ? 'bg-primary border-primary' : errors[decl.id] ? 'border-destructive' : 'border-border hover:border-primary'
                        }`}
                        aria-hidden="true"
                      >
                        {form.checks[decl.id] && (
                          <svg width="11" height="9" viewBox="0 0 11 9" fill="none" aria-hidden="true">
                            <path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <div>
                        <p
                          className="text-xs font-black uppercase tracking-widest text-primary mb-1"
                          style={{ fontFamily: 'var(--font-heading)' }}
                        >
                          {i + 1}. {decl.heading}
                        </p>
                        <p className="text-sm text-foreground leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
                          {decl.text}
                        </p>
                      </div>
                    </button>
                    {errors[decl.id] && (
                      <p className="text-destructive text-xs mt-2 ml-9">{errors[decl.id]}</p>
                    )}
                  </div>
                ))}
              </div>
            </fieldset>

            {/* ── SIGNATURE ── */}
            <fieldset className="bg-card border border-border rounded-xl p-6 sm:p-8">
              <legend
                className="text-xs font-black uppercase tracking-widest text-primary px-2 mb-6"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Digital Signature
              </legend>
              <p className="text-muted-foreground text-sm mb-5" style={{ fontFamily: 'var(--font-sans)' }}>
                Type your full name below as your digital signature. By doing so, you confirm that you have read and agree to all declarations above.
              </p>
              <div>
                <label htmlFor="signature" className={labelClass} style={{ fontFamily: 'var(--font-heading)' }}>
                  Full Name (Signature) *
                </label>
                <input
                  id="signature"
                  name="signature"
                  type="text"
                  placeholder="Type your full name to sign"
                  value={form.signature}
                  onChange={handleText}
                  className={`${inputClass('signature')} font-semibold italic text-base`}
                  style={{ fontFamily: 'Georgia, serif' }}
                />
                {errors.signature && <p className="text-destructive text-xs mt-1">{errors.signature}</p>}
              </div>
              <p className="text-muted-foreground text-xs mt-4 leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
                By submitting this form, I, <strong className="text-foreground">{form.signature || '_______________'}</strong>, confirm that all information provided is accurate and that I voluntarily accept all terms stated above. I understand this declaration is binding.
              </p>
            </fieldset>

            {/* ── SUBMIT ── */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2">
              <p className="text-muted-foreground text-xs text-center sm:text-left" style={{ fontFamily: 'var(--font-sans)' }}>
                * Required fields. All declarations must be accepted before submission.
              </p>
              <button
                type="submit"
                className="w-full sm:w-auto bg-primary hover:bg-accent text-white font-black uppercase tracking-widest px-10 py-4 rounded-lg transition-colors text-sm"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Submit Declaration
              </button>
            </div>

          </form>
        </div>
      </main>
    </MarathaxLayout>
  );
}
