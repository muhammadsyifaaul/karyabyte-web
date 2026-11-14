"use client";

import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { caseStudies, filterTags, type CaseStudyTag, type CaseStudy } from "../data/portfolio";
import { previewMap } from "../components/ui/ProjectPreviews";
import { useWorksAnimations } from "../hooks/useSectionAnimations";

function SpotlightCard({ children, className = "", onClick, role, ariaLabel, dataAnim }:
  { children: React.ReactNode; className?: string; onClick?: () => void; role?: string; ariaLabel?: string; dataAnim?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current; if (!r) return;
    const rect = r.getBoundingClientRect();
    r.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    r.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };
  return (
    <div ref={ref} onMouseMove={onMove} onClick={onClick} role={role} aria-label={ariaLabel}
      data-anim={dataAnim}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter") onClick(); } : undefined}
      className={`kb-card kb-card-hover kb-spotlight ${className} ${onClick ? "cursor-pointer" : ""}`}>
      {children}
    </div>
  );
}

export default function Works() {
  const [activeTag, setActiveTag] = useState<CaseStudyTag | "All">("All");
  const [openCase, setOpenCase] = useState<CaseStudy | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  useWorksAnimations(sectionRef);

  const filtered = activeTag === "All"
    ? caseStudies
    : caseStudies.filter((c) => c.tags.includes(activeTag));

  return (
    <section ref={sectionRef} id="works" className="kb-section" aria-label="Selected Works">
      <div className="kb-container">

        {/* ── Header ── */}
        <div data-anim="works-header" className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="kb-badge mb-5">SELECTED WORKS</div>
            <h2 className="font-display font-bold text-white"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Problems We've Solved.
              <br />
              <span className="kb-gradient-text">Systems We've Shipped.</span>
            </h2>
          </div>
          <p className="font-body text-[#A1A1AA] text-sm max-w-sm leading-relaxed md:text-right">
            Every project is proof that engineering and design moving in lockstep
            produces better outcomes.
          </p>
        </div>

        {/* ── Filter Tabs ── */}
        <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filter by tag">
          {(["All", ...filterTags] as (CaseStudyTag | "All")[]).map((tag) => (
            <button key={tag} onClick={() => setActiveTag(tag)}
              className={clsx(
                "px-4 py-2 rounded-full text-xs font-mono transition-all duration-200",
                activeTag === tag
                  ? "bg-white text-[#050505] font-semibold"
                  : "border border-white/10 text-[#A1A1AA] hover:text-white hover:border-white/20"
              )}>
              {tag}
            </button>
          ))}
        </div>

        {/* ── Case Study Grid ── */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {filtered.map((cs) => {
            const Preview = previewMap[cs.id];
            return (
              <SpotlightCard key={cs.id} onClick={() => setOpenCase(cs)}
                role="button" ariaLabel={`View case study: ${cs.title}`}
                className="relative overflow-hidden group" dataAnim="works-card">
                {/* SVG architectural preview */}
                <div className="relative h-52 md:h-56 overflow-hidden rounded-t-[1rem]">
                  {Preview && <Preview />}

                  {/* Key metric badge — top right */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="kb-card px-3 py-1.5 !rounded-lg border-white/15 !bg-[#0c0c0e]/90">
                      <div className="font-display font-bold text-white text-sm" style={{ letterSpacing: "-0.02em" }}>
                        {cs.keyMetric}
                      </div>
                      <div className="font-mono text-[#A1A1AA]/70 text-[9px] tracking-widest">{cs.keyMetricLabel}</div>
                    </div>
                  </div>

                  {/* Year + tags — bottom left */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <span className="kb-badge">{cs.year}</span>
                    {cs.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="kb-badge text-[9px]">{tag}</span>
                    ))}
                  </div>

                  {/* Hover reveal */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                    <span className="font-mono text-white/90 text-xs tracking-widest uppercase">
                      View Case Study →
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-6 lg:p-7">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="font-mono text-[#A1A1AA]/50 text-[10px] tracking-widest uppercase mb-1">
                        {cs.client}
                      </p>
                      <h3 className="font-display font-bold text-white group-hover:text-[#E4E4E7] transition-colors"
                        style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)", letterSpacing: "-0.02em" }}>
                        {cs.title}
                      </h3>
                    </div>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                      className="flex-shrink-0 mt-1 text-[#A1A1AA] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                      aria-hidden="true">
                      <path d="M4 14L14 4M14 4H7M14 4V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="font-body text-[#A1A1AA] text-sm leading-relaxed mb-4">{cs.summary}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cs.stack.slice(0, 4).map(s => (
                      <span key={s} className="px-2 py-1 rounded-md text-[10px] font-mono bg-white/[0.04] border border-white/[0.06] text-[#A1A1AA]">{s}</span>
                    ))}
                    {cs.stack.length > 4 && (
                      <span className="px-2 py-1 rounded-md text-[10px] font-mono bg-white/[0.04] border border-white/[0.06] text-[#A1A1AA]">+{cs.stack.length - 4}</span>
                    )}
                  </div>
                </div>
              </SpotlightCard>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-center font-mono text-[#A1A1AA]/50 py-20 text-sm">No case studies match this filter.</p>
        )}
      </div>

      {openCase && <CaseStudyModal cs={openCase} onClose={() => setOpenCase(null)} />}
    </section>
  );
}

function CaseStudyModal({ cs, onClose }: { cs: CaseStudy; onClose: () => void }) {
  const Preview = previewMap[cs.id];
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6"
      role="dialog" aria-modal="true" aria-label={`Case study: ${cs.title}`}>
      {/* Backdrop */}
      <button className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-default"
        onClick={onClose} aria-label="Close" tabIndex={-1} />

      {/* Panel */}
      <div className="relative w-full md:max-w-2xl lg:max-w-3xl max-h-[92vh] overflow-y-auto kb-card rounded-t-2xl md:rounded-2xl">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 p-6 pb-4 bg-[#0c0c0e]/95 backdrop-blur-md border-b border-white/[0.07]">
          <div>
            <p className="font-mono text-[#A1A1AA]/50 text-[10px] tracking-widest uppercase mb-1">
              {cs.client} · {cs.year}
            </p>
            <h2 className="font-display font-bold text-white text-xl" style={{ letterSpacing: "-0.025em" }}>
              {cs.title}
            </h2>
          </div>
          <button onClick={onClose}
            className="flex-shrink-0 w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#A1A1AA] hover:text-white hover:border-white/20 transition-colors"
            aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* SVG architecture preview */}
          <div className="rounded-xl overflow-hidden border border-white/[0.07] h-52">
            {Preview && <Preview />}
          </div>

          {/* Tags + metric */}
          <div className="flex items-center gap-3 flex-wrap">
            {cs.tags.map(tag => <span key={tag} className="kb-badge">{tag}</span>)}
            <div className="ml-auto kb-card !rounded-lg px-3 py-1.5 border-white/15">
              <span className="font-display font-bold text-white text-sm">{cs.keyMetric}</span>
              <span className="font-mono text-[#A1A1AA]/60 text-[9px] ml-2 tracking-widest">{cs.keyMetricLabel}</span>
            </div>
          </div>

          {/* Client Context */}
          <ModalSection label="Client Context" text={cs.problem} />

          {/* System Architecture */}
          <ModalSection label="System Architecture" text={cs.systemArchitecture} />

          {/* UI/UX Design Decisions */}
          <ModalSection label="UI/UX Design Decisions" text={cs.uiSolution} />

          {/* Measured Impact */}
          <div>
            <div className="font-mono text-[#A1A1AA]/50 text-[10px] tracking-widest uppercase mb-4">
              Measured Business Impact
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {cs.impact.map((item) => (
                <div key={item} className="kb-card !rounded-xl px-4 py-3 flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#E4E4E7]/60 flex-shrink-0" />
                  <span className="font-body text-[#E4E4E7] text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <div className="font-mono text-[#A1A1AA]/50 text-[10px] tracking-widest uppercase mb-3">Tech Stack</div>
            <div className="flex flex-wrap gap-2">
              {cs.stack.map(s => (
                <span key={s} className="px-3 py-1.5 rounded-lg text-xs font-mono bg-white/[0.04] border border-white/[0.08] text-[#E4E4E7]">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalSection({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <div className="font-mono text-[#A1A1AA]/50 text-[10px] tracking-widest uppercase mb-3">{label}</div>
      <p className="font-body text-[#A1A1AA] text-sm leading-relaxed">{text}</p>
    </div>
  );
}
