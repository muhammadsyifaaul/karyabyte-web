"use client";

import { useState, useRef } from "react";
import clsx from "clsx";
import { studio } from "../data/studio";
import { useEstimatorPulse } from "../hooks/useSectionAnimations";

/* ─── Types ─────────────────────────────────────────────────────────────── */
type ProjectType = "Web Application" | "Design System" | "System Architecture" | "Full Product Build" | "Consultation";
type Timeline    = "1-2 months" | "3-4 months" | "5-6 months" | "6+ months";
type Deliverable = "UI/UX Design" | "Fullstack Dev" | "System Architecture" | "Mobile" | "API Integration" | "DevOps Setup";

const projectTypes: ProjectType[] = [
  "Web Application", "Design System", "System Architecture", "Full Product Build", "Consultation",
];
const timelines: Timeline[] = ["1-2 months", "3-4 months", "5-6 months", "6+ months"];
const deliverables: Deliverable[] = [
  "UI/UX Design", "Fullstack Dev", "System Architecture", "Mobile", "API Integration", "DevOps Setup",
];

/* ─── Blueprint calculation ─────────────────────────────────────────────── */
type Blueprint = { squad: string; sprints: string; artifacts: string[]; kickoff: string };

function calcBlueprint(
  type: ProjectType | null, time: Timeline | null, del: Set<Deliverable>,
): Blueprint | null {
  if (!type && !time && del.size === 0) return null;
  const hasDev    = del.has("Fullstack Dev") || del.has("System Architecture");
  const hasDesign = del.has("UI/UX Design");
  const squad     = hasDev && hasDesign
    ? "Both principals · Full-stack + Design"
    : hasDev    ? "Muhammad Syifaaul · Systems & Engineering"
    : hasDesign ? "Ardana Yaziddirrisqo · Design & PM"
    : "Discovery call to confirm principal";
  const sprintMap: Record<string, string> = {
    "1-2 months": "4–6 sprints (1 wk each)",
    "3-4 months": "6–8 sprints (2 wk each)",
    "5-6 months": "8–10 sprints (2 wk each)",
    "6+ months":  "12+ sprints (2 wk each)",
  };
  const artifactMap: Record<string, string> = {
    "UI/UX Design":        "Design system + hi-fi prototype",
    "Fullstack Dev":       "Production codebase + CI/CD",
    "System Architecture": "Architecture doc + ERD + API spec",
    "Mobile":              "React Native / PWA build",
    "API Integration":     "API contracts + integration tests",
    "DevOps Setup":        "Docker + IaC + monitoring stack",
  };
  const kickoffMap: Record<string, string> = {
    "Web Application":     "Within 1 week of contract sign",
    "Design System":       "Within 5 business days",
    "System Architecture": "Within 3 business days",
    "Full Product Build":  "Within 1 week of contract sign",
    "Consultation":        "Within 48 hours",
  };
  return {
    squad,
    sprints: time ? sprintMap[time] : "TBD after discovery call",
    artifacts: del.size > 0
      ? [...del].map(d => artifactMap[d])
      : type === "Consultation" ? ["Strategy document", "Technical recommendations"] : ["Full discovery brief"],
    kickoff: type ? kickoffMap[type] : "After discovery call",
  };
}

/* ─── Validation ────────────────────────────────────────────────────────── */
type FormFields = { name: string; email: string; company: string; message: string };
type FormErrors = Partial<Record<keyof FormFields, string>>;

function validate(fields: FormFields): FormErrors {
  const errors: FormErrors = {};
  if (!fields.name.trim())
    errors.name = "Name is required.";
  if (!fields.email.trim())
    errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
    errors.email = "Enter a valid email address.";
  return errors;
}

/* ─── UI helpers ─────────────────────────────────────────────────────────── */
function SpotlightCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current; if (!r) return;
    const rect = r.getBoundingClientRect();
    r.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    r.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };
  return (
    <div ref={ref} onMouseMove={onMove} className={`kb-card kb-spotlight ${className}`}>
      {children}
    </div>
  );
}

function FormInput({
  label, id, type = "text", value, onChange, error, required = false,
}: {
  label: string; id: string; type?: string; value: string;
  onChange: (v: string) => void; error?: string; required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id}
        className="block font-mono text-[#A1A1AA]/60 text-[10px] tracking-widest uppercase mb-2">
        {label}{required && <span className="text-red-400/70 ml-1">*</span>}
      </label>
      <input id={id} type={type} required={required} value={value}
        onChange={e => onChange(e.target.value)}
        aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}
        className={clsx(
          "w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-white placeholder-[#A1A1AA]/40 text-sm font-body focus:outline-none transition-colors",
          error ? "border-red-400/50 focus:border-red-400/70" : "border-white/[0.08] focus:border-white/20"
        )}
        autoComplete={type === "email" ? "email" : id}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-body text-red-400/80">
          {error}
        </p>
      )}
    </div>
  );
}

function BlueprintRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="font-mono text-[#A1A1AA]/40 text-[9px] tracking-widest uppercase pt-0.5 min-w-[72px]">{label}</span>
      <span className="font-body text-[#E4E4E7] text-sm leading-snug">{value}</span>
    </div>
  );
}

function ContactRow({ icon, label, value, href }: { icon: string; label: string; value: string; href?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.04] border border-white/[0.06] text-[#A1A1AA] text-xs flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="font-mono text-[#A1A1AA]/50 text-[9px] tracking-widest uppercase">{label}</div>
        {href
          ? <a href={href} className="font-body text-[#E4E4E7] text-sm hover:text-white transition-colors">{value}</a>
          : <span className="font-body text-[#E4E4E7] text-sm">{value}</span>}
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
type SubmitState = "idle" | "loading" | "success" | "error";

export default function Estimator() {
  const [projectType, setProjectType] = useState<ProjectType | null>(null);
  const [timeline, setTimeline]       = useState<Timeline | null>(null);
  const [selDel, setSelDel]           = useState<Set<Deliverable>>(new Set());
  const [form, setForm]               = useState<FormFields>({ name: "", email: "", company: "", message: "" });
  const [errors, setErrors]           = useState<FormErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const pulseK = useEstimatorPulse();

  const toggleDel = (d: Deliverable) => {
    setSelDel(prev => { const n = new Set(prev); n.has(d) ? n.delete(d) : n.add(d); return n; });
    pulseK();
  };

  const blueprint = calcBlueprint(projectType, timeline, selDel);

  const autoContext = (() => {
    const parts: string[] = [];
    if (projectType) parts.push(`Type: ${projectType}`);
    if (timeline)    parts.push(`Timeline: ${timeline}`);
    if (selDel.size) parts.push(`Scope: ${[...selDel].join(", ")}`);
    if (blueprint)   parts.push(`Sprints: ${blueprint.sprints}`);
    return parts.join(" | ");
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    /* Client-side validation */
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitState("loading");

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          projectType,
          timeline,
          deliverables: [...selDel],
          autoContext,
          blueprint,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { message?: string }).message ?? "Submission failed.");
      }

      setSubmitState("success");
    } catch (err) {
      setSubmitState("error");
      setServerError(err instanceof Error ? err.message : "An unexpected error occurred.");
    }
  };

  return (
    <section
      id="contact"
      className="kb-section relative overflow-hidden"
      aria-label="Project Estimator and Contact"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(228,228,231,0.025) 0%, transparent 70%)",
        }}
      />

      <div className="kb-container">
        {/* ── Header ── */}
        <div className="mb-14 max-w-3xl">
          <div className="kb-badge mb-5">START A PROJECT</div>
          <h2
            className="font-display font-bold text-white mb-5"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
          >
            Let&apos;s Build Something
            <br />
            <span className="kb-gradient-text">Worth Scaling.</span>
          </h2>
          <p
            className="font-body text-[#A1A1AA]"
            style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.125rem)", lineHeight: 1.7 }}
          >
            Tell us what you need. We&apos;ll respond within 24 hours with an initial
            read on how we&apos;d approach the technical and design challenges.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-14">

          {/* ── Left: scope selector + contact form ── */}
          {submitState === "success" ? (
            <div className="kb-card p-10 flex flex-col items-center justify-center text-center min-h-[400px]">
              <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center mb-6">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                  <path d="M4 11l5 5L18 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3
                className="font-display font-bold text-white text-2xl mb-3"
                style={{ letterSpacing: "-0.025em" }}
              >
                Message Received
              </h3>
              <p className="font-body text-[#A1A1AA] text-sm max-w-xs leading-relaxed">
                Thank you for reaching out. We&apos;ll be in touch within one business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8" noValidate aria-label="Project inquiry form">

              {/* Step 1 — Project Type */}
              <fieldset>
                <legend className="font-mono text-[#A1A1AA]/50 text-[10px] tracking-widest uppercase mb-4">
                  01 — Project Type
                </legend>
                <div className="flex flex-wrap gap-3" role="group" aria-label="Project type">
                  {projectTypes.map(t => (
                    <button
                      type="button" key={t}
                      onClick={() => { setProjectType(t); pulseK(); }}
                      aria-pressed={projectType === t}
                      className={clsx(
                        "px-5 py-2.5 rounded-full text-sm font-body transition-all duration-200",
                        projectType === t
                          ? "bg-white text-[#050505] font-semibold"
                          : "border border-white/10 text-[#A1A1AA] hover:text-white hover:border-white/20",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Step 2 — Timeline */}
              <fieldset>
                <legend className="font-mono text-[#A1A1AA]/50 text-[10px] tracking-widest uppercase mb-4">
                  02 — Timeline
                </legend>
                <div className="flex flex-wrap gap-3" role="group" aria-label="Timeline">
                  {timelines.map(t => (
                    <button
                      type="button" key={t}
                      onClick={() => { setTimeline(t); pulseK(); }}
                      aria-pressed={timeline === t}
                      className={clsx(
                        "px-5 py-2.5 rounded-full text-sm font-body transition-all duration-200",
                        timeline === t
                          ? "bg-white text-[#050505] font-semibold"
                          : "border border-white/10 text-[#A1A1AA] hover:text-white hover:border-white/20",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Step 3 — Deliverables */}
              <fieldset>
                <legend className="font-mono text-[#A1A1AA]/50 text-[10px] tracking-widest uppercase mb-4">
                  03 — Deliverables <span className="normal-case text-[#A1A1AA]/30">(select all that apply)</span>
                </legend>
                <div className="flex flex-wrap gap-3" role="group" aria-label="Deliverables">
                  {deliverables.map(d => (
                    <button
                      type="button" key={d}
                      onClick={() => toggleDel(d)}
                      aria-pressed={selDel.has(d)}
                      className={clsx(
                        "px-5 py-2.5 rounded-full text-sm font-body transition-all duration-200",
                        selDel.has(d)
                          ? "bg-white text-[#050505] font-semibold"
                          : "border border-white/10 text-[#A1A1AA] hover:text-white hover:border-white/20",
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="kb-divider" />

              {/* Step 4 — Contact fields */}
              <div className="space-y-4">
                <div className="font-mono text-[#A1A1AA]/50 text-[10px] tracking-widest uppercase mb-4">
                  04 — Contact Information
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Name" id="name" value={form.name}
                    onChange={v => setForm(f => ({ ...f, name: v }))}
                    error={errors.name} required
                  />
                  <FormInput
                    label="Email" id="email" type="email" value={form.email}
                    onChange={v => setForm(f => ({ ...f, email: v }))}
                    error={errors.email} required
                  />
                </div>
                <FormInput
                  label="Company (optional)" id="company" value={form.company}
                  onChange={v => setForm(f => ({ ...f, company: v }))}
                />
                <div>
                  <label
                    htmlFor="message"
                    className="block font-mono text-[#A1A1AA]/60 text-[10px] tracking-widest uppercase mb-2"
                  >
                    Tell us about your project
                  </label>
                  <textarea
                    id="message" rows={4} value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Describe what you're building, the problem it solves, and any technical constraints..."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-[#A1A1AA]/40 text-sm font-body focus:outline-none focus:border-white/20 transition-colors resize-none"
                  />
                </div>

                {/* Auto-populated context (read-only preview) */}
                {autoContext && (
                  <div className="px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06] font-mono text-[#A1A1AA]/50 text-[10px] leading-relaxed break-words">
                    <span className="text-[#A1A1AA]/25 mr-2">AUTO-CONTEXT ›</span>
                    {autoContext}
                  </div>
                )}
              </div>

              {/* Server error */}
              {submitState === "error" && serverError && (
                <div
                  role="alert"
                  className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-400/20 text-red-400/80 text-sm font-body"
                >
                  {serverError} Please try again or email us directly at{" "}
                  <a href={`mailto:${studio.email}`} className="underline underline-offset-2">
                    {studio.email}
                  </a>.
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitState === "loading"}
                className={clsx(
                  "inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold font-display text-sm transition-all duration-200",
                  submitState === "loading"
                    ? "bg-white/40 text-[#050505]/60 cursor-not-allowed"
                    : "bg-white text-[#050505] hover:bg-[#E4E4E7]",
                )}
              >
                {submitState === "loading" ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Sending…
                  </>
                ) : (
                  <>
                    Send Inquiry
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ── Right: live blueprint + studio info ── */}
          <div className="space-y-5">
            {/* Live Engagement Blueprint */}
            {blueprint ? (
              <SpotlightCard className="p-6">
                <div className="font-mono text-[#A1A1AA]/50 text-[10px] tracking-widest uppercase mb-5">
                  Estimated Engagement Blueprint
                </div>
                <div className="space-y-4">
                  <BlueprintRow label="Squad"       value={blueprint.squad} />
                  <BlueprintRow label="Sprint Plan" value={blueprint.sprints} />
                  <div>
                    <div className="font-mono text-[#A1A1AA]/40 text-[9px] tracking-widest uppercase mb-2">
                      Key Artifacts
                    </div>
                    <ul className="space-y-1.5">
                      {blueprint.artifacts.map(a => (
                        <li key={a} className="flex items-start gap-2 text-xs font-body text-[#A1A1AA]">
                          <span className="mt-1 w-1 h-1 rounded-full bg-[#E4E4E7]/40 flex-shrink-0" />{a}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <BlueprintRow label="Kickoff" value={blueprint.kickoff} />
                </div>
              </SpotlightCard>
            ) : (
              <SpotlightCard className="p-6">
                <div className="font-mono text-[#A1A1AA]/30 text-[10px] tracking-widest uppercase mb-3">
                  Engagement Blueprint
                </div>
                <p className="font-body text-[#A1A1AA]/40 text-sm leading-relaxed">
                  Select a project type, timeline, and deliverables above to see your personalised engagement plan.
                </p>
              </SpotlightCard>
            )}

            {/* Contact */}
            <SpotlightCard className="p-6">
              <div className="font-mono text-[#A1A1AA]/50 text-[10px] tracking-widest uppercase mb-5">
                Get In Touch
              </div>
              <div className="space-y-4">
                <ContactRow icon="@" label="Email"    value={studio.email}    href={`mailto:${studio.email}`} />
                <ContactRow icon="⌖" label="Location" value={studio.location} />
                <ContactRow icon="◈" label="Founded"  value={String(studio.founded)} />
              </div>
            </SpotlightCard>

            {/* How it works */}
            <SpotlightCard className="p-6">
              <div className="font-mono text-[#A1A1AA]/50 text-[10px] tracking-widest uppercase mb-4">
                How It Works
              </div>
              <ol className="space-y-3">
                {([
                  ["Brief Review",   "We study your inquiry within 24 hrs"],
                  ["Discovery Call", "30-min alignment session at no cost"],
                  ["Proposal",       "Tailored scope, timeline & investment"],
                  ["Kickoff",        "Sprint 1 begins within days"],
                ] as [string, string][]).map(([step, desc], i) => (
                  <li key={step} className="flex gap-3 text-xs">
                    <span className="font-mono text-[#A1A1AA]/40 w-4 flex-shrink-0">{`0${i + 1}`}</span>
                    <div>
                      <span className="font-body text-white block">{step}</span>
                      <span className="font-body text-[#A1A1AA]">{desc}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </section>
  );
}
