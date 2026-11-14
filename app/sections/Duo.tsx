"use client";

import { useRef, useEffect } from "react";
import { team, studio } from "../data/studio";
import { services } from "../data/services";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function SpotlightCard({ children, className = "", dataAnim = "" }: {
  children: React.ReactNode; className?: string; dataAnim?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current; if (!r) return;
    const rect = r.getBoundingClientRect();
    r.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    r.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };
  return (
    <div ref={ref} onMouseMove={onMove} data-anim={dataAnim || undefined}
      className={`kb-card kb-card-hover kb-spotlight ${className}`}>
      {children}
    </div>
  );
}

export default function Duo() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      /* Staggered slide-up for section header */
      gsap.from("[data-anim='duo-header'] > *", {
        scrollTrigger: { trigger: "[data-anim='duo-header']", start: "top 80%", once: true },
        y: 32, opacity: 0, stagger: 0.12, duration: 0.7, ease: "power3.out",
      });
      /* Slide-up for principal cards */
      gsap.from("[data-anim='principal-card']", {
        scrollTrigger: { trigger: "[data-anim='principal-card']", start: "top 80%", once: true },
        y: 48, opacity: 0, stagger: 0.18, duration: 0.8, ease: "power3.out",
      });
      /* Core value banner */
      gsap.from("[data-anim='core-value']", {
        scrollTrigger: { trigger: "[data-anim='core-value']", start: "top 82%", once: true },
        y: 24, opacity: 0, duration: 0.7, ease: "power2.out",
      });
      /* Services stagger */
      gsap.from("[data-anim='service-card']", {
        scrollTrigger: { trigger: "[data-anim='service-card']", start: "top 82%", once: true },
        y: 32, opacity: 0, stagger: 0.1, duration: 0.6, ease: "power2.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="duo" className="kb-section" aria-label="The Principals">
      <div className="kb-container">

        {/* ── Section Header ── */}
        <div className="mb-16 md:mb-20" data-anim="duo-header">
          <div className="kb-badge mb-5">THE DUO — OUR PHILOSOPHY</div>
          <div className="max-w-3xl">
            <h2 className="font-display font-bold text-white mb-5"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Two Principals.
              <br />
              <span className="kb-gradient-text">One Direct Line.</span>
            </h2>
            <p className="font-body text-[#A1A1AA]"
              style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.125rem)", lineHeight: 1.7 }}>
              We believe the best studios are defined not by size, but by{" "}
              <em className="text-white not-italic">precision</em>. Two complementary
              disciplines — systems engineering and product design — operating in full
              harmony from the first sprint to the final deployment.
            </p>
          </div>
        </div>

        {/* ── Principal Cards ── */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-20">
          {team.map((member) => (
            <SpotlightCard key={member.id} dataAnim="principal-card"
              className="p-6 lg:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${member.color}50, transparent)` }} />
              <div className="flex items-start justify-between mb-5 gap-4">
                <span className="kb-badge">{member.roleId}</span>
                <div className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 flex-shrink-0"
                  style={{ background: `${member.color}10` }}>
                  <span className="font-mono text-[10px] text-[#A1A1AA]">
                    {member.id === "systems" ? "SYS" : "DSN"}
                  </span>
                </div>
              </div>
              <p className="font-mono text-[#A1A1AA]/50 text-[10px] tracking-widest uppercase mb-1">
                {member.coPrincipalTitle}
              </p>
              <h3 className="font-display font-bold text-white mb-1"
                style={{ fontSize: "clamp(1.15rem, 2vw, 1.5rem)", letterSpacing: "-0.025em", lineHeight: 1.2 }}>
                {member.fullName}
              </h3>
              <p className="font-body text-[#A1A1AA] text-sm mb-5">{member.role}</p>
              <p className="font-body text-[#A1A1AA] text-sm leading-relaxed mb-6">{member.bio}</p>
              <div className="mb-5">
                <div className="font-mono text-[#A1A1AA]/50 text-[10px] tracking-widest uppercase mb-3">Disciplines</div>
                <div className="flex flex-wrap gap-2">
                  {member.disciplines.map((d) => (
                    <span key={d} className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-[#A1A1AA] text-xs font-body">{d}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-mono text-[#A1A1AA]/50 text-[10px] tracking-widest uppercase mb-3">Stack</div>
                <div className="flex flex-wrap gap-2">
                  {member.stack.map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded-md text-xs font-mono"
                      style={{ background: `${member.color}08`, color: member.color, border: `1px solid ${member.color}25` }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>

        {/* ── Core Value Callout ── */}
        <div data-anim="core-value"
          className="kb-card p-8 lg:p-12 text-center relative overflow-hidden mb-20">
          <div aria-hidden="true" className="absolute inset-0 opacity-[0.04]"
            style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(228,228,231,1), transparent)" }} />
          <div className="relative z-10">
            <div className="kb-badge mx-auto mb-6 w-fit">CORE VALUE</div>
            <blockquote className="font-display font-bold text-white mb-4"
              style={{ fontSize: "clamp(1.25rem, 2.5vw, 2rem)", letterSpacing: "-0.025em", lineHeight: 1.3 }}>
              "{studio.taglineFull}"
            </blockquote>
            <p className="font-body text-[#A1A1AA] text-sm max-w-xl mx-auto">
              Two perspectives. One vision. Zero overhead.
            </p>
          </div>
        </div>

        {/* ── Our Services ── */}
        <div id="services">
          <div className="font-mono text-[#A1A1AA]/50 text-[10px] tracking-widest uppercase mb-8 text-center">
            Our Services
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {services.map((svc) => (
              <SpotlightCard key={svc.id} dataAnim="service-card" className="p-6 lg:p-7">
                <div className="text-2xl mb-4" aria-hidden="true">{svc.icon}</div>
                <h4 className="font-display font-semibold text-white text-sm mb-2 leading-snug"
                  style={{ letterSpacing: "-0.01em" }}>{svc.title}</h4>
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
