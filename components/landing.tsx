"use client";

import { useEffect, useState } from "react";
import { submitLead } from "@/app/actions";

export function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const year = new Date().getFullYear();

  // Safety net: if an OAuth login lands on the homepage with ?code=... (because
  // the provider redirected to the Site URL instead of the callback), forward
  // it to the real callback so the session gets established.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("code") || params.has("error")) {
      window.location.replace(`/auth/callback${window.location.search}`);
    }
  }, []);

  const closeMenu = () => setMenuOpen(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const fd = new FormData(form);
    setStatus("sending");
    setErrorMsg("");
    const res = await submitLead({
      firstName: String(fd.get("firstName") || ""),
      lastName: String(fd.get("lastName") || ""),
      phone: String(fd.get("phone") || ""),
      email: String(fd.get("email") || ""),
      damageType: String(fd.get("damageType") || ""),
      carrier: String(fd.get("carrier") || ""),
      message: String(fd.get("message") || ""),
      company: String(fd.get("company") || ""),
    });
    if (res.ok) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMsg(
        res.error
          ? "Sorry — something went wrong. Please call (901) 659-3612 or try again."
          : ""
      );
    }
  }

  return (
    <div className="hlg-site">
      {/* ===== Header ===== */}
      <header className={menuOpen ? "open" : undefined}>
        <div className="wrap nav">
          <a className="brand" href="#top">
            <span className="logo-badge">HLG</span>
            <span className="brand-text">
              <strong>HALL LEGACY GROUP</strong>
              <span>INSURANCE RESTORATION</span>
            </span>
          </a>
          <div className="nav-right">
            <nav className="nav-links" id="navMenu">
              <a href="#process" onClick={closeMenu}>Our Process</a>
              <a href="#services" onClick={closeMenu}>Services</a>
              <a href="#why" onClick={closeMenu}>Why Us</a>
              <a href="#contact" onClick={closeMenu}>Contact</a>
              <a href="#contact" className="btn btn-gold menu-cta" onClick={closeMenu}>Free Inspection</a>
            </nav>
            <a href="#contact" className="btn btn-gold desktop-cta">Free Inspection</a>
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

      {/* ===== Hero ===== */}
      <section className="hero" id="top">
        <div className="wrap hero-inner">
          <span className="eyebrow">Insurance Restoration Specialists</span>
          <h1>We Handle<br />the <span className="accent">Insurance.</span><br />We Fix Your Home.</h1>
          <p>After a loss, navigating your insurance claim shouldn&apos;t be another burden. Hall Legacy Group works directly from your carrier&apos;s scope of work — restoring your property to pre-loss condition, no shortcuts.</p>
          <div className="hero-cta">
            <a href="#contact" className="btn btn-gold">Get a Free Inspection</a>
            <a href="#services" className="btn btn-outline">Our Services</a>
          </div>
        </div>
      </section>

      {/* ===== Stats ===== */}
      <section className="stats">
        <div className="wrap stats-grid">
          <div className="stat"><div className="num">100%</div><div className="lbl">Insurance Scope Compliant</div></div>
          <div className="stat"><div className="num">0</div><div className="lbl">Out of Pocket Surprises</div></div>
          <div className="stat"><div className="num">24hr</div><div className="lbl">Response Time</div></div>
        </div>
      </section>

      {/* ===== Trust strip ===== */}
      <section className="trust">
        <div className="wrap trust-grid">
          <div className="trust-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 2l8 4v6c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-4z" /></svg> Licensed &amp; Insured</div>
          <div className="trust-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg> Insurance Scope Experts</div>
          <div className="trust-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg> Fast Response After Loss</div>
          <div className="trust-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 21V8l9-5 9 5v13" /><path d="M9 21v-6h6v6" /></svg> Family-Owned, Community-First</div>
        </div>
      </section>

      {/* ===== Process ===== */}
      <section className="section" id="process">
        <div className="wrap">
          <div className="process-head">
            <span className="eyebrow dark">Our Process</span>
            <h2>We Speak <span className="accent">Insurance.</span> So You Don&apos;t Have To.</h2>
            <div className="rule"></div>
          </div>
          <div className="process-grid">
            <div className="steps">
              <div className="step"><div className="n">1</div><div><h3>Free Property Inspection</h3><p>We assess the damage from your loss event — roof, structure, interior — and document everything thoroughly.</p></div></div>
              <div className="step"><div className="n">2</div><div><h3>Insurance Claim Support</h3><p>We work alongside your adjuster, reviewing the scope of work line by line to ensure nothing gets missed.</p></div></div>
              <div className="step"><div className="n">3</div><div><h3>Scope-Based Restoration</h3><p>Once approved, we execute exactly to the carrier&apos;s scope — licensed crews, quality materials, zero shortcuts.</p></div></div>
              <div className="step"><div className="n">4</div><div><h3>Final Walkthrough</h3><p>We don&apos;t consider the job done until you do. We walk through every item and confirm your satisfaction.</p></div></div>
            </div>
            <div className="why" id="why">
              <span className="eyebrow" style={{ color: "var(--gold-soft)" }}>Why It Matters</span>
              <h3>Most homeowners leave money on the table after an insurance loss.</h3>
              <p>Your carrier&apos;s scope of work is a detailed blueprint — but only if someone knows how to read and execute it correctly. Hall Legacy Group was built specifically for this. We&apos;ve done this hundreds of times. We know what&apos;s in scope, what should be in scope, and how to deliver it at the highest quality.</p>
              <a href="#contact" className="btn btn-gold">No Out-of-Pocket Surprises</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Services ===== */}
      <section className="services section" id="services">
        <div className="wrap">
          <div className="services-top">
            <div>
              <span className="eyebrow dark">What We Do</span>
              <h2>Restoration <span className="accent">Services</span></h2>
            </div>
            <a href="#contact" className="btn btn-gold">Start Your Claim</a>
          </div>
          <div className="cards">
            <div className="card">
              <span className="wm">01</span>
              <div className="ico"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" /></svg></div>
              <h3>Roof Repair &amp; Replacement</h3>
              <p>Storm, hail, and wind damage covered completely. We work directly from your adjuster&apos;s scope and coordinate supplement requests when damage is underestimated.</p>
            </div>
            <div className="card">
              <span className="wm">02</span>
              <div className="ico"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2.7S5 10 5 14.5a7 7 0 0014 0C19 10 12 2.7 12 2.7z" /></svg></div>
              <h3>Water &amp; Flood Damage</h3>
              <p>Burst pipes, flooding, or appliance failures — we handle full mitigation coordination, drywall, flooring, and rebuild to restore your home completely.</p>
            </div>
            <div className="card">
              <span className="wm">03</span>
              <div className="ico"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2c1 4-2 5-2 8a4 4 0 008 0c0-2-1-3-1-3 3 2 4 5 4 8a8 8 0 11-16 0C7 8 12 7 12 2z" /></svg></div>
              <h3>Fire &amp; Smoke Damage</h3>
              <p>Structural rebuilds, smoke remediation, and full interior restoration. We coordinate with your adjuster to ensure every affected area is properly included in scope.</p>
            </div>
            <div className="card">
              <span className="wm">04</span>
              <div className="ico"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18" /><path d="M5 21V7l7-4 7 4v14" /><path d="M9 9h0M9 13h0M9 17h0M15 9h0M15 13h0M15 17h0" /></svg></div>
              <h3>Siding &amp; Exterior</h3>
              <p>Hail, impact, and storm damage to siding, windows, gutters, and fascia. Full exterior restoration matched to your property&apos;s existing materials and finish.</p>
            </div>
            <div className="card">
              <span className="wm">05</span>
              <div className="ico"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18" /><path d="M4 21V8h16v13" /><path d="M9 21v-7h6v7" /><path d="M4 8l8-5 8 5" /></svg></div>
              <h3>Interior Rebuild</h3>
              <p>Drywall, paint, flooring, cabinetry, trim — complete interior restoration from damage to finished. Every trade coordinated under one roof, on your timeline.</p>
            </div>
            <div className="card">
              <span className="wm">06</span>
              <div className="ico"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /><path d="M9 13l2 2 4-4" /></svg></div>
              <h3>Scope Review &amp; Supplements</h3>
              <p>We review every line of your carrier&apos;s scope to catch missed items and file supplements where warranted — ensuring your approved claim covers the full extent of damage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Contact ===== */}
      <section className="contact" id="contact">
        <div className="wrap contact-grid">
          <div>
            <span className="eyebrow">Get Started</span>
            <h2>Schedule Your <span className="accent">Free</span> Inspection</h2>
            <p className="lead">Whether your claim just opened or you&apos;ve already received a scope, Hall Legacy Group can step in at any point. Reach out today — no obligation, no pressure.</p>
            <div className="contact-line">
              <div className="ci"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012 4.2 2 2 0 014 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8 9.8a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z" /></svg></div>
              <div><div className="cl">Phone</div><a className="cv" href="tel:+19016593612">(901) 659-3612</a></div>
            </div>
            <a className="contact-line" href="mailto:Ferrakohn@thehalllegacygrp.com">
              <div className="ci"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 6L2 7" /></svg></div>
              <div><div className="cl">Email</div><div className="cv">Ferrakohn@thehalllegacygrp.com</div></div>
            </a>
          </div>

          <div className="form-card">
            {status === "success" ? (
              <div className="form-success show">
                ✓ Thank you! Your request has been received. A Hall Legacy Group specialist will contact you within 24 hours.
              </div>
            ) : (
              <>
                <h3>Request a Free Inspection</h3>
                <p className="sub">We respond within 24 hours.</p>
                <form onSubmit={handleSubmit} noValidate>
                  <div className="row2">
                    <div className="field"><label htmlFor="fn">First Name</label><input id="fn" name="firstName" placeholder="John" required /></div>
                    <div className="field"><label htmlFor="ln">Last Name</label><input id="ln" name="lastName" placeholder="Smith" required /></div>
                  </div>
                  <div className="field"><label htmlFor="ph">Phone Number</label><input id="ph" name="phone" type="tel" placeholder="(555) 000-0000" required /></div>
                  <div className="field"><label htmlFor="em">Email Address</label><input id="em" name="email" type="email" placeholder="john@email.com" required /></div>
                  <div className="field">
                    <label htmlFor="dt">Type of Damage</label>
                    <select id="dt" name="damageType" required defaultValue="">
                      <option value="" disabled>Select damage type</option>
                      <option>Roof / Storm / Hail</option>
                      <option>Water / Flood</option>
                      <option>Fire / Smoke</option>
                      <option>Siding / Exterior</option>
                      <option>Interior Damage</option>
                      <option>Other / Not Sure</option>
                    </select>
                  </div>
                  <div className="field"><label htmlFor="ic">Insurance Carrier (If Known)</label><input id="ic" name="carrier" placeholder="State Farm, Allstate, etc." /></div>
                  <div className="field"><label htmlFor="msg">Tell Us About Your Situation</label><textarea id="msg" name="message" placeholder="Briefly describe the damage and when it occurred..." /></div>
                  <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
                  {status === "error" && <p className="form-error show">{errorMsg}</p>}
                  <button type="submit" className="btn btn-gold" disabled={status === "sending"}>
                    {status === "sending" ? "Sending…" : "Submit & Schedule Inspection"}
                  </button>
                  <p className="form-note">No obligation. Your information is kept private.</p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer>
        <div className="wrap foot">
          <a className="brand" href="#top">
            <span className="logo-badge">HLG</span>
            <span className="brand-text">
              <strong>HALL LEGACY GROUP</strong>
              <span>INSURANCE RESTORATION</span>
            </span>
          </a>
          <div className="foot-links">
            <a href="#process">Our Process</a>
            <a href="#services">Services</a>
            <a href="#why">Why Us</a>
            <a href="#contact">Free Inspection</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
          <div>© {year} Hall Legacy Group. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
