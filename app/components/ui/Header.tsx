"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import { KaryaByteLogoCompact } from "./KaryaByteLogo";
import { useSceneStore } from "../../store/useSceneStore";

const navLinks = [
  { label: "Studio",   labelId: "Studio",     href: "#duo" },
  { label: "Services", labelId: "Layanan",    href: "#pipeline" },
  { label: "Work",     labelId: "Portofolio", href: "#works" },
  { label: "Contact",  labelId: "Kontak",     href: "#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* ── X-Ray mode from global store ── */
  const mode       = useSceneStore((s) => s.mode);
  const toggleMode = useSceneStore((s) => s.toggleMode);
  const isBlueprint = mode === "blueprint";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[#050505]/90 backdrop-blur-md border-b border-white/[0.06]"
          : "bg-transparent",
        /* Blueprint mode: subtle blue tint on header */
        isBlueprint && "border-b border-blue-500/20"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between gap-6">

        {/* ── Logo ── */}
        <a href="#" aria-label="KaryaByte — Back to top" className="flex-shrink-0">
          <KaryaByteLogoCompact />
        </a>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={clsx(
                "relative px-1 py-2 text-sm transition-colors duration-200 group font-body",
                isBlueprint
                  ? "text-blue-300/70 hover:text-blue-200"
                  : "text-[#A1A1AA] hover:text-white"
              )}
            >
              {link.label}
              <span
                className={clsx(
                  "absolute bottom-1 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left",
                  isBlueprint ? "bg-blue-400/50" : "bg-white/40"
                )}
              />
            </a>
          ))}
        </nav>

        {/* ── Right Actions ── */}
        <div className="hidden md:flex items-center gap-3">

          {/* ── X-Ray Architecture Toggle ── */}
          <button
            onClick={toggleMode}
            aria-label={isBlueprint ? "Switch to Design Mode" : "Switch to System Blueprint Mode"}
            aria-pressed={isBlueprint}
            className={clsx(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-all duration-300",
              isBlueprint
                ? "border-blue-500/50 bg-blue-950/60 text-blue-300 hover:bg-blue-900/60"
                : "border-white/10 bg-white/[0.04] text-[#A1A1AA] hover:bg-white/[0.08] hover:text-white"
            )}
          >
            <span
              className={clsx(
                "w-1.5 h-1.5 rounded-full transition-colors duration-300",
                isBlueprint ? "bg-blue-400 animate-pulse" : "bg-[#E4E4E7] animate-pulse-slow"
              )}
            />
            <span className="transition-all duration-300">
              {isBlueprint ? "Blueprint Mode" : "Design Mode"}
            </span>
          </button>

          {/* ── CTA ── */}
          <a
            href="#contact"
            className={clsx(
              "px-4 py-2 rounded-full text-sm font-semibold font-display tracking-tight transition-colors duration-200",
              isBlueprint
                ? "bg-blue-500 text-white hover:bg-blue-400"
                : "bg-white text-[#050505] hover:bg-[#E4E4E7]"
            )}
          >
            Start a Project
          </a>
        </div>

        {/* ── Mobile Hamburger ── */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 -mr-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className={clsx("block w-5 h-px bg-white transition-all duration-300", menuOpen && "rotate-45 translate-y-2")} />
          <span className={clsx("block w-5 h-px bg-white transition-all duration-300", menuOpen && "opacity-0")} />
          <span className={clsx("block w-5 h-px bg-white transition-all duration-300", menuOpen && "-rotate-45 -translate-y-2")} />
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      <div
        className={clsx(
          "md:hidden overflow-hidden",
          menuOpen ? "max-h-80 border-b border-white/[0.06]" : "max-h-0"
        )}
        style={{ transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1)" }}
      >
        <nav className="px-6 py-4 flex flex-col gap-1 bg-[#050505]/95 backdrop-blur-md">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="py-3 text-base text-[#A1A1AA] hover:text-white transition-colors duration-200 border-b border-white/[0.05] last:border-0 font-body"
            >
              <span className="text-white/20 font-mono text-xs mr-3">//</span>
              {link.label}
              <span className="ml-2 text-white/30 text-xs">/ {link.labelId}</span>
            </a>
          ))}
          {/* Mobile X-Ray toggle */}
          <button
            onClick={toggleMode}
            className={clsx(
              "mt-2 py-2.5 text-sm font-mono rounded-xl border transition-colors duration-200",
              isBlueprint
                ? "border-blue-500/40 text-blue-300 bg-blue-950/40"
                : "border-white/10 text-[#A1A1AA]"
            )}
          >
            {isBlueprint ? "⟡ Blueprint Mode — tap to exit" : "◈ Switch to Blueprint Mode"}
          </button>
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="mt-2 py-3 text-center rounded-full bg-white text-[#050505] text-sm font-semibold font-display"
          >
            Start a Project
          </a>
        </nav>
      </div>
    </header>
  );
}
