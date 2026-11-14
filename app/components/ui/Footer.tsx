import KaryaByteLogo from "./KaryaByteLogo";
import { studio } from "../../data/studio";

const navGroups = [
  {
    label: "Studio",
    links: [
      { label: "The Duo", href: "#duo" },
      { label: "Philosophy", href: "#duo" },
      { label: "Services", href: "#pipeline" },
    ],
  },
  {
    label: "Work",
    links: [
      { label: "Case Studies", href: "#works" },
      { label: "System Architecture", href: "#works" },
      { label: "UI/UX Projects", href: "#works" },
    ],
  },
  {
    label: "Contact",
    links: [
      { label: "Start a Project", href: "#contact" },
      { label: "hello@karyabyte.dev", href: "mailto:hello@karyabyte.dev" },
      { label: "Indonesia", href: "#" },
    ],
  },
];

export default function Footer() {
  const year = 2026;

  return (
    <footer className="relative border-t border-white/[0.06]" aria-label="Footer">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-16 pb-10">
        <div className="grid md:grid-cols-[1fr_auto] gap-12 md:gap-20 mb-14">

          {/* Brand column */}
          <div className="max-w-sm">
            <KaryaByteLogo size={120} className="mb-6" />
            <p className="font-body text-[#A1A1AA] text-sm leading-relaxed mb-6">
              Independent Digital Product &amp; Systems Studio.
              <br />
            <span className="text-[#E4E4E7]/70">Enterprise architecture. Craft-level design. Two-principal agility.</span>
            </p>
            {/* Stack badges */}
            <div className="flex flex-wrap gap-2">
              {["Next.js", "TypeScript", "Figma", "PostgreSQL", "AWS"].map((s) => (
                <span key={s} className="kb-badge text-[9px]">{s}</span>
              ))}
            </div>
          </div>

          {/* Nav groups */}
          <div className="grid grid-cols-3 gap-10">
            {navGroups.map((group) => (
              <div key={group.label}>
                <div className="font-mono text-[#A1A1AA]/40 text-[10px] tracking-widest uppercase mb-5">
                  {group.label}
                </div>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="font-body text-[#A1A1AA] text-sm hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="kb-divider mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#A1A1AA]/40">
          <span>© {year} {studio.name}. All rights reserved.</span>
          <span className="tracking-widest uppercase">
            SYS.ENG ◈ DSN.PM — 2 Principals · Indonesia
          </span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-[#A1A1AA] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#A1A1AA] transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
