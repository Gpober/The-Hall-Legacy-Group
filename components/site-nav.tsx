"use client";

import { useState } from "react";

// Shared marketing header/footer. The landing page renders its sections inline,
// so its anchors are bare (`#process`); other pages need to jump back to the
// home page first (`/#process`). `anchorBase` supplies that prefix.
type NavProps = { anchorBase?: string };

const LINKS = [
  { href: "process", label: "Our Process", page: "/process" },
  { href: "services", label: "Services" },
  { href: "why", label: "Why Us" },
  { href: "contact", label: "Contact" },
];

export function SiteHeader({ anchorBase = "" }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={menuOpen ? "open" : undefined}>
      <div className="wrap nav">
        <a className="brand" href={anchorBase ? "/" : "#top"}>
          <span className="logo-badge">HLG</span>
          <span className="brand-text">
            <strong>HALL LEGACY GROUP</strong>
            <span>PROPERTY RESTORATION</span>
          </span>
        </a>
        <div className="nav-right">
          <nav className="nav-links" id="navMenu">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.page ?? `${anchorBase}#${l.href}`}
                onClick={closeMenu}
              >
                {l.label}
              </a>
            ))}
            <a
              href={`${anchorBase}#contact`}
              className="btn btn-gold menu-cta"
              onClick={closeMenu}
            >
              Free Inspection
            </a>
          </nav>
          <a href={`${anchorBase}#contact`} className="btn btn-gold desktop-cta">
            Free Inspection
          </a>
          <button
            className="menu-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="navMenu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({ anchorBase = "" }: NavProps) {
  return (
    <footer>
      <div className="wrap foot">
        <a className="brand" href={anchorBase ? "/" : "#top"}>
          <span className="logo-badge">HLG</span>
          <span className="brand-text">
            <strong>HALL LEGACY GROUP</strong>
            <span>PROPERTY RESTORATION</span>
          </span>
        </a>
        <div className="foot-links">
          <a href="/process">Our Process</a>
          <a href={`${anchorBase}#services`}>Services</a>
          <a href={`${anchorBase}#why`}>Why Us</a>
          <a href={`${anchorBase}#contact`}>Free Inspection</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
        <div>© {new Date().getFullYear()} Hall Legacy Group. All rights reserved.</div>
      </div>
    </footer>
  );
}
