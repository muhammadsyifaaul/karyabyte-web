"use client";

import { useRef, useEffect } from "react";
import { team, studio } from "../data/studio";
import { services } from "../data/services";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function SpotlightCard({
  children,
  className = "",
  dataAnim = "",
}: {
  children: React.ReactNode;
  className?: string;
  dataAnim?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current;
    if (!r) return;
    const rect = r.getBoundingClientRect();
    r.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    r.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      data-anim={dataAnim || undefined}
      className={`kb-card kb-card-hover kb-spotlight ${className}`}
    >
      {children}
    </div>
  );
}

export default function Duo() {
  const sectionRef        = useRef<HTMLElement>(null);
  /* Refs on the grid containers — more reliable trigger targets than
     the first matching [data-anim] element in the document           */
  const headerRef         = useRef<HTMLDivElement>(null);
  const principalGridRef  = useRef<HTMLDivElement>(null);
  const coreValueRef      = useRef<HTMLDivElement>(null);
  const serviceGridRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {

      /* ── Section header ── */
      if (headerRef.current) {
        const kids = Array.from(headerRef.current.children) as HTMLElement[];
        gsap.fromTo(
          kids,
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0,
            duration: 0.65, stagger: 0.1, ease: "power2.out",
            clearProps: "transform",
            scrollTrigger: { trigger: headerRef.current, start: "top 85%", once: true },
          },
        );
      }

      /* ── Principal cards (2-column grid) ── */
      if (principalGridRef.current) {
        const cards = Array.from(
          principalGridRef.current.querySelectorAll<HTMLElement>("[data-anim='principal-card']"),
        );
        gsap.fromTo(
          cards,
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0,
            duration: 0.6, stagger: 0.08, ease: "power2.out",
            clearProps: "transform",
            scrollTrigger: { trigger: principalGridRef.current, start: "top 88%", once: true },
          },
        );
      }

      /* ── Core value banner ── */
      if (coreValueRef.current) {
        gsap.fromTo(
          coreValueRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0,
            duration: 0.65, ease: "power2.out",
            clearProps: "transform",
            scrollTrigger: { trigger: coreValueRef.current, start: "top 88%", once: true },
          },
        );
      }

      /* ── Service cards (4-column grid) ── */
      if (serviceGridRef.current) {
        const cards = Array.from(
          serviceGridRef.current.querySelectorAll<HTMLElement>("[data-anim='service-card']"),
        );
        gsap.fromTo(
          cards,
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0,
            duration: 0.6, stagger: 0.08, ease: "power2.out",
            clearProps: "transform",
            scrollTrigger: { trigger: serviceGridRef.current, start: "top 88%", once: true },
          },
        );
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="duo" className="kb-section" aria-label="The Principals">
      <div className="kb-container">

        {/* ── Section Header ── */}
        <div ref={headerRef} className="mb-16 md:mb-20">
          <div className="kb-badge mb-5">THE DUO — OUR PHILOSOPHY</div>
          <div className="max-w-3xl">
            <h2
              className="font-display font-bold text-white mb-5"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
            >
              Two Principals.
              <br />
              <span className="kb-gradient-text">One Direct Line.</span>
            </h2>
            <p
              className="font-body text-[#A1A1AA]"
              style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.125rem)", lineHeight: 1.7 }}
            >
              We believe the best studios are defined not by size, but by{" "}
              <em className="text-white not-italic">precision</em>. Two complementary
              disciplines — systems engineering and product design — operating in full
              harmony from the first sprint to the final deployment.
            </p>
          </div>
        </div>

        {/* ── Principal Cards
              items-stretch   → both cards share the same top edge and fill
                                equal height regardless of content length
              No per-card mt-* or translate-y-* — GSAP fromTo + clearProps
              ensures no stalled transform offset remains after animation    ── */}
        <div
          ref={principalGridRef}
          className="grid md:grid-cols-2 gap-6 lg:gap-8 items-stretch mb-20"
        >
          {team.map((member) => (
            <SpotlightCard
              key={member.id}
              dataAnim="principal-card"
              className="p-6 lg:p-8 relative overflow-hidden"
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${member.color}50, transparent)` }}
              />

              {/* Badge + monogram */}
              <div className="flex items-start justify-between mb-5 gap-4">
                <span className="kb-badge">{member.roleId}</span>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 flex-shrink-0"
                  style={{ background: `${member.color}10` }}
                >
                  <span className="font-mono text-[10px] text-[#A1A1AA]">
                    {member.id === "systems" ? "SYS" : "DSN"}
                  </span>
                </div>
              </div>

              {/* Name */}
              <p className="font-mono text-[#A1A1AA]/50 text-[10px] tracking-widest uppercase mb-1">
                {member.coPrincipalTitle}
              </p>
              <h3
                className="font-display font-bold text-white mb-1"
                style={{ fontSize: "clamp(1.15rem, 2vw, 1.5rem)", letterSpacing: "-0.025em", lineHeight: 1.2 }}
              >
                {member.fullName}
              </h3>
              <p className="font-body text-[#A1A1AA] text-sm mb-5">{member.role}</p>

              {/* Bio */}
              <p className="font-body text-[#A1A1AA] text-sm leading-relaxed mb-6">{member.bio}</p>

              {/* Disciplines */}
              <div className="mb-5">
                <div className="font-mono text-[#A1A1AA]/50 text-[10px] tracking-widest uppercase mb-3">
                  Disciplines
                </div>
                <div className="flex flex-wrap gap-2">
                  {member.disciplines.map((d) => (
                    <span
                      key={d}
                      className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-[#A1A1AA] text-xs font-body"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stack */}
              <div>
                <div className="font-mono text-[#A1A1AA]/50 text-[10px] tracking-widest uppercase mb-3">
                  Stack
                </div>
                <div className="flex flex-wrap gap-2">
                  {member.stack.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-md text-xs font-mono"
                      style={{ background: `${member.color}08`, color: member.color, border: `1px solid ${member.color}25` }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>

        {/* ── Core Value Callout ── */}
        <div
          ref={coreValueRef}
          className="kb-card p-8 lg:p-12 text-center relative overflow-hidden mb-20"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.04]"
            style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(228,228,231,1), transparent)" }}
          />
          <div className="relative z-10">
            <div className="kb-badge mx-auto mb-6 w-fit">CORE VALUE</div>
            <blockquote
              className="font-display font-bold text-white mb-4"
              style={{ fontSize: "clamp(1.25rem, 2.5vw, 2rem)", letterSpacing: "-0.025em", lineHeight: 1.3 }}
            >
              &ldquo;{studio.taglineFull}&rdquo;
            </blockquote>
            <p className="font-body text-[#A1A1AA] text-sm max-w-xl mx-auto">
              Two perspectives. One vision. Zero overhead.
            </p>
          </div>
        </div>

        {/* ── Our Services
              items-stretch   → all 4 cards share the same top baseline
              No per-card translate — GSAP fromTo + clearProps handles animation ── */}
        <div id="services">
          <div className="font-mono text-[#A1A1AA]/50 text-[10px] tracking-widest uppercase mb-8 text-center">
            Our Services
          </div>
          <div
            ref={serviceGridRef}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 items-stretch"
          >
            {services.map((svc) => (
              <SpotlightCard key={svc.id} dataAnim="service-card" className="p-6 lg:p-7">
                <div className="text-2xl mb-4" aria-hidden="true">{svc.icon}</div>
                <h4
                  className="font-display font-semibold text-white text-sm mb-2 leading-snug"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {svc.title}
                </h4>
                <p className="font-body text-[#A1A1AA] text-xs leading-relaxed">{svc.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {svc.tags.slice(0, 3).map((t) => (
                    <span key={t} className="kb-badge text-[9px]">{t}</span>
                  ))}
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
