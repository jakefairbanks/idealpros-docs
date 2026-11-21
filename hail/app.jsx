/* global React, ReactDOM */
const { useState, useEffect, useRef, useMemo } = React;

/* ============================================================
   ICONS — inline Lucide-style SVGs, 1.75 stroke
   ============================================================ */
const Icon = ({ name, size = 20, color = "currentColor", stroke = 1.75 }) => {
  const paths = {
    check: <polyline points="20 6 9 17 4 12" />,
    arrowRight: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
    arrowDown: <><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></>,
    chevDown: <polyline points="6 9 12 15 18 9" />,
    home: <><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V9.5z" /></>,
    shield: <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" /></>,
    camera: <><path d="M3 9a2 2 0 0 1 2-2h2l2-2h6l2 2h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" /><circle cx="12" cy="13" r="4" /></>,
    users: <><circle cx="9" cy="8" r="4" /><path d="M2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1" /><circle cx="18" cy="9" r="3" /><path d="M22 21v-1a5 5 0 0 0-4-4.9" /></>,
    fileText: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="14" y2="17" /></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
    droplet: <path d="M12 2.5s7 8 7 12.5a7 7 0 0 1-14 0c0-4.5 7-12.5 7-12.5z" />,
    sparkle: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.5 5.5l2.8 2.8M15.7 15.7l2.8 2.8M5.5 18.5l2.8-2.8M15.7 8.3l2.8-2.8" /></>,
    award: <><circle cx="12" cy="8" r="6" /><polyline points="8.5 13 7 22 12 19 17 22 15.5 13" /></>,
    star: <polygon points="12 2 15.1 8.6 22 9.3 16.8 14 18.5 21 12 17.3 5.5 21 7.2 14 2 9.3 8.9 8.6 12 2" />,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.7 19.7 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.7A2 2 0 0 1 22 16.9z" />,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3 7 12 13 21 7" /></>,
    creditCard: <><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></>
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>);

};

/* ============================================================
   TWEAK DEFAULTS — live data the homeowner can have personalized
   ============================================================ */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroPhoto": "assets/photo-aerial-04.jpg"
} /*EDITMODE-END*/;

/* ============================================================
   DATA — the actual content of the manual
   ============================================================ */
/* Inspection coverage zones — diagrammed on the house illustration */
const ZONES = [
{ n: 1, title: "Roof field", body: "Shingle mat, granule loss, bruising, and storm-side exposure across every plane." },
{ n: 2, title: "Ridges, hips & valleys", body: "High-stress lines where hail impact is most visible and most often missed." },
{ n: 3, title: "Flashing & penetrations", body: "Vents, pipe boots, chimney and skylight flashing \u2014 small parts, big leaks." },
{ n: 4, title: "Gutters & downspouts", body: "Dimpling, dents and detachment consistent with the same hail event." },
{ n: 5, title: "Garage doors", body: "Metal panels show dents clearly; an easy adjuster confirmation when present." },
{ n: 6, title: "Siding & wraps", body: "Storm-facing elevations checked for cracks, holes, and impact dimples." },
{ n: 7, title: "Windows & screens", body: "Tears, frame dents, broken seals \u2014 documented per opening." },
{ n: 8, title: "Paint & trim", body: "Chips, scrapes and impact marks on fascia, soffit, and exterior trim." }];


/* Three-tier photo methodology */
const METHODOLOGY = [
{ tier: "Overview", scale: "Aerial / wide", body: "Establishes the property and which slopes faced the storm. One photo, the whole picture.", photo: "assets/method-overview.jpg" },
{ tier: "Medium", scale: "Slope / panel", body: "Zooms to the affected slope or elevation. Shows distribution and density of impacts.", photo: "assets/method-medium.jpg" },
{ tier: "Close-up", scale: "Inches", body: "The smoking gun. A single hail strike at a scale the adjuster can verify on their own visit.", photo: "assets/method-closeup.jpg" }];


const TIMELINE = [
{
  eb: "Step 01 · Today",
  title: "Inspection & claim filing.",
  short: "We confirm damage is adequate, document everything, and you file the claim with your carrier.",
  detail:
  <>
        <p><b>We never recommend filing until a thorough inspection has been completed and adequate damage has been documented.</b> Today's inspection met that bar.</p>
        <p style={{ marginTop: 10 }}>From here:</p>
        <ul>
          <li>You call your insurance carrier and open a claim (we'll coach you on the script).</li>
          <li>We finalize our inspection report and detailed estimate.</li>
          <li>Both documents are sent to your insurance <b>before</b> their adjuster arrives.</li>
        </ul>
      </>

},
{
  eb: "Step 02 · Within 7–14 days",
  title: "Adjuster inspection.",
  short: "The insurance adjuster comes out to verify the damage. They already have our full report in hand.",
  detail:
  <>
        <p>We do not meet the adjuster on site. <b>By the time they arrive, they already have our full photo inspection report and line-item estimate.</b> That makes their job faster — and faster adjusters mean a faster project for you.</p>
        <p style={{ marginTop: 10 }}>What the adjuster will do:</p>
        <ul>
          <li>Walk the roof and exterior, verifying our findings.</li>
          <li>Take their own photos and measurements.</li>
          <li>Prepare a scope of approved repairs (their estimate).</li>
        </ul>
      </>

},
{
  eb: "Step 03 · 1–3 weeks after adjuster",
  title: "Paperwork review.",
  short: "You receive the insurance estimate. We sit down together and walk it line by line.",
  detail:
  <>
        <p>Once you receive the approved estimate, send it our way and we'll schedule a sit-down. At that meeting we'll:</p>
        <ul>
          <li>Review every approved line item together.</li>
          <li>Flag anything that was missed and queue it for a supplement.</li>
          <li>Pick shingle colors. If gutters are in scope, pick gutter colors. If painting, decide match / partial / full repaint.</li>
          <li>Get you tentatively on the production schedule.</li>
        </ul>
      </>

},
{
  eb: "Step 04 · Ongoing",
  title: "Supplements (revisions).",
  short: "We go back to the insurance for anything missed — in writing, with photos, and with line-item math.",
  detail:
  <>
        <p>Our initial supplement goes in <b>within two weeks</b> of our materials &amp; scheduling meeting. We handle every back-and-forth with the carrier in writing — no phone-tag, no surprises.</p>
        <p style={{ marginTop: 10 }}>On average we recover <b>~$8,000</b> in initially-missed line items per claim. That's not a fee — that's what was already owed under your policy.</p>
      </>

},
{
  eb: "Step 05 · Production day",
  title: "Production.",
  short: "Roof first, then gutters, then painting — in that order, each trade handled by its own crew.",
  detail:
  <>
        <p>On install day a project supervisor is on site from start to finish. Your property is protected end-to-end by our <b>Catch-All system</b>. Tarps and netting are set before the first shingle comes off; the lawn, garden beds, garage door, and siding stay protected throughout.</p>
        <p style={{ marginTop: 10 }}>Order of work:</p>
        <ul>
          <li><b>Roof.</b> Tear-off and install — typically one day.</li>
          <li><b>Gutters.</b> Scheduled separately by the gutter crew.</li>
          <li><b>Painting.</b> Last, so nothing else lands on fresh paint.</li>
        </ul>
      </>

},
{
  eb: "Step 06 · Project close",
  title: "Project complete & funds released.",
  short: "Final invoice goes to the carrier, depreciation is released, warranties are filed and handed to you.",
  detail:
  <>
        <p>Once work is signed off, we forward the final invoice and any closing paperwork to the carrier. The carrier releases the final payment (depreciation) to you, and we deliver:</p>
        <ul>
          <li>Manufacturer warranty registration (Owens Corning).</li>
          <li>Our 5-year workmanship warranty.</li>
          <li>A close-out package: final photos, invoices, scope-of-work.</li>
        </ul>
      </>

}];


const DIFFERENTIATORS = [
{
  n: "01",
  eb: "Differentiator",
  title: "A dedicated project supervisor, on site.",
  body: "Most companies make your salesperson play five roles: project manager, insurance liaison, production oversight, quality control, and billing. Nobody can do all five at the level you deserve. We split the work across a dedicated team — and your project supervisor is the one on site when the work happens.",
  them: { h: "Most contractors", p: "One person handling inspection, claim, install oversight, QC, and billing. Quality slips at the seams." },
  us: { h: "Ideal Pros", p: "Dedicated project supervisor on site during install. Separate teams for sales, claims, and billing." },
  photo: "assets/aaron-caldwell.jpg",
  pin: "On-site lead",
  nameplate: { name: "Aaron Caldwell", credit: "Project Supervisor · 8 years of roofing project management" }
},
{
  n: "02",
  eb: "Differentiator",
  title: "The Catch-All property protection system.",
  body: "A large net suspended from poles around the work area. Every shingle, nail, and piece of debris we throw off the roof lands in the net and rolls down — instead of bouncing off your garage door, scraping your siding, or hiding in your landscaping. The number one complaint we hear about previous roofers is cleanup. We make cleanup easy on purpose, so it gets done right every single time.",
  them: { h: "Most contractors", p: "Tarps on the ground. Debris ricochets off the house. Nails found in the lawn for months." },
  us: { h: "Ideal Pros", p: "Catch-All netting set up before tear-off. Property protected end-to-end. Easier cleanup = better cleanup." },
  video: (typeof window !== "undefined" && window.__CATCH_ALL_VIDEO) || "assets/catch-all.mp4",
  pin: "Property-safe"
},
{
  n: "03",
  eb: "Differentiator",
  title: "Documentation thorough enough to speed up your adjuster.",
  body: "Every photo from our inspection — overview, medium, close-up — is logged into a written inspection report and filed to your account. We mirror exactly what the insurance adjuster needs to see: is there hail damage, and what specifically did it impact? Siding, gutters, roof, paint, garage doors. When the adjuster's job is easier, they move faster. When they move faster, your project moves faster. Most companies take quick phone pics and call it documented. That's how claims stall.",
  them: { h: "Most contractors", p: "Quick phone photos. No written report. Adjuster does it all from scratch — and finds half what we'd find." },
  us: { h: "Ideal Pros", p: "Full photo report + line-item estimate sent to the carrier before the adjuster ever arrives." },
  photo: "assets/documentation-screenshot.png",
  pin: "Documented"
}];


const TEAM = [
{ initials: "TB", role: "Project Consultant", name: "Terrance Bunch", body: "Your point of contact today. Walks the roof, scopes damage, coaches you on the claim filing.", photo: "assets/team-terrance.jpg" },
{ initials: "AC", role: "Project Supervisor", name: "Aaron Caldwell", body: "On site during install. Owns quality, crew, and property protection from setup to final walk.", photo: "assets/aaron-caldwell.jpg" },
{ initials: "CF", role: "Office Administrator", name: "Christina Fairbanks", body: "Runs the supplement desk. Communicates with your carrier in writing, tracks every revision.", photo: "assets/team-christina.jpg" },
{ initials: "JF", role: "Owner & Founder", name: "Jake Fairbanks", body: "Founded Ideal in 2019. Reachable directly if anything ever needs to come to the top.", photo: "assets/team-jake.jpg" }];


const PRODUCTION = [
{ n: "First", title: "Roof", body: "Full tear-off and install. Most replacements complete in a single day; tarps and Catch-All netting come down at sundown." },
{ n: "Second", title: "Gutters", body: "If approved in scope. Scheduled separately so the gutter crew can fit cleanly to the new fascia and drip-edge." },
{ n: "Third", title: "Painting", body: "Sherwin Williams catalog. Match, partial, or full repaint — discussed at the materials meeting." },
{ n: "Close", title: "Final invoice", body: "Final invoice and closing paperwork go to the carrier. Depreciation releases to you. Warranties are filed and handed over." }];


const CREDS = [
{ num: "1%", label: "Owens Corning Platinum", body: "We're in the select 1% of US contractors certified at this tier." },
{ num: "750+", label: "Projects since 2019", body: "Real roofs, real Front Range homes, documented every time." },
{ num: "200+", label: "Five-star reviews", body: "Built on showing up, doing the work, cleaning up." },
{ num: "5", label: "Year workmanship warranty", suffix: "yr", body: "Every roof we install. Stacked on top of the Owens Corning warranty issued for your roof." }];


const SECTIONS = [
{ id: "damage", label: "Damage" },
{ id: "claim", label: "Claim Process" },
{ id: "financing", label: "Financing" },
{ id: "why", label: "Why Ideal" },
{ id: "team", label: "Your Team" },
{ id: "process", label: "Production" },
{ id: "next", label: "Next Steps" }];


/* ============================================================
   TOP BAR — sticky with anchor nav + scroll-spy
   ============================================================ */
function TopBar({ activeId, onJump }) {
  return (
    <header className="topbar">
      <div className="page-wrap topbar-inner">
        <a href="#top" onClick={(e) => {e.preventDefault();window.scrollTo({ top: 0, behavior: "smooth" });}} aria-label="Ideal Roof &amp; Exterior Pros">
          <img src="../assets/logo-dark.webp" alt="Ideal Roof &amp; Exterior Pros" className="topbar-logo" />
        </a>
        <nav className="topbar-nav" aria-label="Manual sections">
          {SECTIONS.map((s) =>
          <button
            key={s.id}
            className={activeId === s.id ? "active" : ""}
            onClick={() => onJump(s.id)}>
            {s.label}</button>
          )}
        </nav>
      </div>
    </header>);

}

/* ============================================================
   SCROLL PROGRESS — thin gold bar at very top
   ============================================================ */
function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? doc.scrollTop / max * 100 : 0;
      if (ref.current) ref.current.style.width = pct + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div ref={ref} className="scroll-progress" />;
}

/* ============================================================
   HERO
   ============================================================ */
function Hero({ t }) {
  return (
    <section className="hero" id="top" data-screen-label="01 Hero">
      <div className="page-wrap hero-grid">
        <div>
          <div className="hero-eyebrow">
            <span className="line"></span>
            <span>Post-Inspection · Client Manual</span>
          </div>
          <h1>
            Here's what<br />happens <span className="gg">next.</span>
          </h1>
          <p className="hero-lede">
            Your roof has adequate damage to recommend filing a claim. From here, we walk every step with you —
            inspection report, adjuster meeting, paperwork review, production, and project close.
            Calm, documented, in order.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => document.getElementById("claim").scrollIntoView({ behavior: "smooth", block: "start" })}>
              Walk me through the process <Icon name="arrowRight" size={16} />
            </button>
            <button className="btn btn-ghost" style={{ background: "rgba(244,238,227,.06)", color: "var(--cream-stone)", borderColor: "rgba(244,238,227,.18)" }}
            onClick={() => document.getElementById("why").scrollIntoView({ behavior: "smooth", block: "start" })}>
              Why Ideal
            </button>
          </div>
        </div>

        <div>
          <div className="hero-photo">
            <img src={t.heroPhoto} alt="Aerial drone photo of completed Ideal Pros roof" />
          </div>
        </div>
      </div>

      <div className="hero-scroll">
        <span>Scroll</span>
        <span className="arrow"></span>
      </div>
    </section>);

}

/* ============================================================
   WHY WE RECOMMEND FILING — inspection coverage diagram
   ============================================================ */
function HouseDiagram() {
  // Stylized elevation of a hail-impacted home with numbered zone pins.
  // Drawn line-art so it stays brand-consistent and reads at any size.
  return (
    <svg className="house-svg" viewBox="0 0 520 380" role="img" aria-label="Diagram of inspection zones on a home">
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4EEE3" />
          <stop offset="1" stopColor="#ECE4D2" />
        </linearGradient>
        <pattern id="shingles" x="0" y="0" width="14" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(0)">
          <line x1="0" y1="0" x2="14" y2="0" stroke="#2B2D2F" strokeOpacity=".12" strokeWidth=".8" />
          <line x1="7" y1="3" x2="7" y2="6" stroke="#2B2D2F" strokeOpacity=".12" strokeWidth=".8" />
        </pattern>
      </defs>

      {/* sky / ground */}
      <rect x="0" y="0" width="520" height="320" fill="url(#skyGrad)" />
      <line x1="0" y1="320" x2="520" y2="320" stroke="#2B2D2F" strokeOpacity=".25" />

      {/* house body */}
      <g>
        {/* main rectangle body */}
        <rect x="110" y="180" width="320" height="140" fill="#FFFFFF" stroke="#2B2D2F" strokeWidth="1.5" />
        {/* main roof */}
        <polygon points="95,180 270,80 445,180" fill="#3A3C40" stroke="#0F0F10" strokeWidth="1.5" />
        <polygon points="95,180 270,80 445,180" fill="url(#shingles)" />
        {/* ridge */}
        <line x1="95" y1="180" x2="445" y2="180" stroke="#0F0F10" strokeWidth="1.2" />
        {/* hip line */}
        <line x1="270" y1="80" x2="270" y2="180" stroke="#0F0F10" strokeOpacity=".4" strokeWidth=".8" strokeDasharray="3 3" />

        {/* chimney */}
        <rect x="335" y="100" width="20" height="38" fill="#2B2D2F" stroke="#0F0F10" />
        <rect x="332" y="96" width="26" height="6" fill="#0F0F10" />

        {/* gutters */}
        <rect x="95" y="180" width="350" height="6" fill="#C9A03A" stroke="#2B2D2F" strokeWidth=".8" />
        {/* downspout */}
        <rect x="108" y="186" width="6" height="134" fill="#C9A03A" stroke="#2B2D2F" strokeWidth=".8" />

        {/* siding (vertical lines on left bay) */}
        <g stroke="#2B2D2F" strokeOpacity=".12" strokeWidth=".8">
          <line x1="124" y1="195" x2="124" y2="315" />
          <line x1="138" y1="195" x2="138" y2="315" />
          <line x1="152" y1="195" x2="152" y2="315" />
          <line x1="166" y1="195" x2="166" y2="315" />
          <line x1="180" y1="195" x2="180" y2="315" />
        </g>

        {/* garage door */}
        <rect x="195" y="230" width="100" height="90" fill="#ECEEF0" stroke="#2B2D2F" strokeWidth="1.2" />
        <g stroke="#2B2D2F" strokeOpacity=".3" strokeWidth=".8">
          <line x1="195" y1="250" x2="295" y2="250" />
          <line x1="195" y1="270" x2="295" y2="270" />
          <line x1="195" y1="290" x2="295" y2="290" />
        </g>

        {/* front door */}
        <rect x="315" y="245" width="30" height="75" fill="#0F0F10" />
        <circle cx="340" cy="282" r="1.5" fill="#C9A03A" />

        {/* windows */}
        <rect x="360" y="230" width="50" height="45" fill="#ECEEF0" stroke="#2B2D2F" strokeWidth="1.2" />
        <line x1="385" y1="230" x2="385" y2="275" stroke="#2B2D2F" />
        <line x1="360" y1="252" x2="410" y2="252" stroke="#2B2D2F" />

        {/* trim baseline */}
        <line x1="110" y1="315" x2="430" y2="315" stroke="#C9A03A" strokeWidth="2" />
      </g>

      {/* zone pins with thin connector lines */}
      <g>
        {[
        { n: 1, x: 200, y: 130, cx: 240, cy: 110 }, /* Roof field */
        { n: 2, x: 270, y: 80, cx: 270, cy: 55 }, /* Ridge */
        { n: 3, x: 345, y: 105, cx: 405, cy: 80 }, /* Flashing (chimney) */
        { n: 4, x: 200, y: 183, cx: 70, cy: 175 }, /* Gutters */
        { n: 5, x: 245, y: 275, cx: 240, cy: 350 }, /* Garage */
        { n: 6, x: 150, y: 255, cx: 60, cy: 270 }, /* Siding */
        { n: 7, x: 385, y: 252, cx: 470, cy: 240 }, /* Windows */
        { n: 8, x: 105, y: 318, cx: 60, cy: 350 } /* Paint / trim */].
        map((p) =>
        <g key={p.n}>
            <line x1={p.x} y1={p.y} x2={p.cx} y2={p.cy} stroke="#C9A03A" strokeWidth="1" strokeDasharray="2 3" />
            <circle cx={p.cx} cy={p.cy} r="13" fill="#C9A03A" stroke="#0F0F10" strokeWidth="1.2" />
            <text x={p.cx} y={p.cy + 4} textAnchor="middle" fontFamily="Poppins, sans-serif" fontSize="12" fontWeight="800" fill="#0F0F10">{p.n}</text>
          </g>
        )}
      </g>
    </svg>);

}

function WhyClaim() {
  return (
    <section className="scene" id="damage" data-screen-label="02 Why a claim">
      <div className="page-wrap">
        <div className="scene-intro">
          <div>
            <div className="eyebrow-num"><span className="dot"></span>01 · Why a claim</div>
            <h2>We don't recommend<br />filing unless it's real.</h2>
          </div>
          <p className="lede">
            Today's inspection met that bar. Every adequate-damage call we make is built on the same
            disciplined coverage: eight zones on the home, three photo scales per finding,
            one written inspection report sent to your carrier <i>before</i> their adjuster arrives.
          </p>
        </div>

        {/* Coverage diagram + zone list */}
        <div className="coverage">
          <div className="coverage-diagram">
            <HouseDiagram />
            <div className="coverage-caption">Inspection coverage map · 8 zones documented on every property</div>
          </div>
          <div className="coverage-zones">
            <div className="coverage-zones-head">
              <div className="label">Standard coverage</div>
              <h4 style={{ margin: "6px 0 0", fontSize: 22 }}>Every zone, every inspection.</h4>
            </div>
            <ol>
              {ZONES.map((z) =>
              <li key={z.n}>
                  <span className="zn">{z.n}</span>
                  <div>
                    <h5>{z.title}</h5>
                    <p>{z.body}</p>
                  </div>
                </li>
              )}
            </ol>
          </div>
        </div>
        <div className="method-strip">
          <div className="method-head">
            <div className="label">Photo methodology</div>
            <h3 style={{ margin: "8px 0 0", fontSize: "clamp(24px, 2.4vw, 36px)" }}>
              Three scales. One finding. Every time.
            </h3>
            <p style={{ marginTop: 12 }}>
              Adjusters need to see hail damage at multiple scales to verify it. We don't make them work for it.
            </p>
          </div>
          <div className="method-cards">
            {METHODOLOGY.map((m, i) =>
            <div className="method-card" key={m.tier}>
                <div className="method-card-frame">
                  {m.photo ?
                <img className="method-photo" src={m.photo} alt={m.tier + " example"} /> :

                <div className={`method-illus method-illus-${i}`}>
                      <div className="crosshair"></div>
                    </div>
                }
                  <span className="tier-tag">{`0${i + 1} · ${m.tier}`}</span>
                </div>
                <div className="method-card-body">
                  <div className="scale">Scale · {m.scale}</div>
                  <p>{m.body}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

}

/* ============================================================
   CLAIM PROCESS
   ============================================================ */
function ClaimProcess() {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <section className="scene cream-deep" id="claim" data-screen-label="03 Claim Process">
      <div className="page-wrap">
        <div className="scene-intro">
          <div>
            <div className="eyebrow-num"><span className="dot"></span>02 · The Process</div>
            <h2>Six steps,<br />start to finish.</h2>
          </div>
          <p className="lede">
            Navigating an insurance claim sounds complicated. It isn't, when someone's done it 750+ times.
            Here's the entire path from today's inspection to depreciation funds in your account —
            tap a step to expand the detail.
          </p>
        </div>

        <div className="timeline">
          {TIMELINE.map((s, i) =>
          <div
            key={i}
            className={`tl-step ${openIdx === i ? "active" : ""}`}
            onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
            role="button"
            aria-expanded={openIdx === i}>
            
              <div className="tl-num">{String(i + 1).padStart(2, "0")}</div>
              <div className="tl-body">
                <div className="meta">{s.eb}</div>
                <h4>{s.title}</h4>
                <p>{s.short}</p>
                <div className="detail">
                  <div className="detail-inner">{s.detail}</div>
                </div>
              </div>
              <div className="tl-toggle">
                <span>{openIdx === i ? "Hide" : "Detail"}</span>
                <span className="chev"><Icon name="chevDown" size={14} /></span>
              </div>
            </div>
          )}
        </div>

        {/* Supplements callout moved to live after Production — see <Supplements /> */}
      </div>
    </section>);

}

/* ============================================================
   SUPPLEMENTS — lives between Production & Credibility now,
   framing supplements as ongoing advocacy after the work is done.
   ============================================================ */
function Supplements() {
  return (
    <section className="scene" id="supplements" data-screen-label="07 Supplements">
      <div className="page-wrap">
        <div className="supp-callout">
          <div>
            <div className="eyebrow-num" style={{ color: "var(--burnished-gold)" }}>
              <span className="dot" style={{ background: "var(--burnished-gold)" }}></span>Why supplements matter
            </div>
            <h3>The first estimate is rarely the final estimate.</h3>
            <p>
              Adjusters work fast and they're human — line items get missed, especially exterior items
              (paint, gutters, garage doors, screens) that aren't on the roof itself.
              You don't need to gather competing estimates. <b>You need a contractor thorough enough to catch what was overlooked</b>,
              and willing to put it back in front of the carrier in writing.
            </p>
          </div>
          <div>
            <div className="supp-stat">
              ~$8K
              <span className="lbl">Avg. supplement recovered per claim</span>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

/* ============================================================
   FINANCING — addresses the deductible-shock hesitation
   ============================================================ */
function Financing() {
  return (
    <section className="scene" id="financing" data-screen-label="04 Financing">
      <div className="page-wrap">
        <div className="scene-intro">
          <div>
            <div className="eyebrow-num"><span className="dot"></span>03 · Financing</div>
            <h2>A high deductible<br />shouldn't stop you.</h2>
          </div>
          <p className="lede">
            We hear it at almost every kitchen table: “My deductible just went up — I can't write that check
            today.” That's exactly why we built financing into how we work. Filing a claim and getting the roof
            you need shouldn't come down to what's in checking this month.
          </p>
        </div>

        <div className="fin-block">
          <div className="fin-offer">
            <div className="fin-badge"><Icon name="creditCard" size={14} /> Our standard offer for insurance projects</div>
            <h3>18 months,<br /><span className="gg">same as cash.</span></h3>
            <p className="fin-lede">
              Break your deductible into eighteen manageable monthly payments.
              Pay it off any time inside the window — zero interest, no penalty.
            </p>
            <ul className="fin-list">
              <li><span className="check"><Icon name="check" size={14} color="var(--onyx)" /></span><span><b>0% interest</b> when paid within the 18-month window.</span></li>
              <li><span className="check"><Icon name="check" size={14} color="var(--onyx)" /></span><span><b>No prepayment penalty</b> — pay it off the day depreciation releases if you want to.</span></li>
              <li><span className="check"><Icon name="check" size={14} color="var(--onyx)" /></span><span><b>Soft-pull pre-qualification</b> — checking your rate doesn't touch your credit score.</span></li>
              <li><span className="check"><Icon name="check" size={14} color="var(--onyx)" /></span><span><b>Same-day decisions</b> in most cases. We handle the paperwork with you.</span></li>
            </ul>
          </div>

          <div className="fin-math">
            <div className="fin-math-head">
              <div className="label">Example breakdown</div>
              <h4>What 18 months looks like.</h4>
            </div>
            <div className="fin-math-table">
              <div className="fin-row">
                <div className="lbl">Your deductible</div>
                <div className="val">$3,000</div>
              </div>
              <div className="fin-divider"><span>÷</span> 18 months <span className="sub">· 0% interest</span></div>
              <div className="fin-row total">
                <div className="lbl">Monthly payment</div>
                <div className="val gold">$167<small>/mo</small></div>
              </div>
            </div>
            <div className="fin-tiles" aria-hidden="true">
              {Array.from({ length: 18 }).map((_, i) =>
              <div className="fin-tile" key={i}>{String(i + 1).padStart(2, "0")}</div>
              )}
            </div>
            <p className="fin-note">Example only. Actual deductible varies by carrier and policy; actual terms subject to credit approval.</p>
          </div>
        </div>
      </div>
    </section>);

}

/* ============================================================
   WHY IDEAL — three differentiators
   ============================================================ */
function WhyIdeal() {
  return (
    <section className="scene" id="why" data-screen-label="04 Why Ideal">
      <div className="page-wrap">
        <div className="scene-intro">
          <div>
            <div className="eyebrow-num"><span className="dot"></span>03 · Why Ideal</div>
            <h2>Three things<br />set us apart.</h2>
          </div>
          <p className="lede">
            Premium without pretense. We charge what the job is worth and we put the team, the system,
            and the documentation behind it to back that up. Here's what that means, specifically.
          </p>
        </div>

        {DIFFERENTIATORS.map((d) =>
        <div className="diff-block" key={d.n}>
            <div className={`diff-photo${d.nameplate ? " has-nameplate" : ""}`}>
              {d.video ?
            <video src={d.video} autoPlay loop muted playsInline /> :

            <img src={d.photo} alt="" />
            }
              <div className="pin"><span className="dot"></span>{d.pin}</div>
              {d.nameplate &&
            <div className="diff-nameplate">
                  <div className="np-name">{d.nameplate.name}</div>
                  <div className="np-credit">{d.nameplate.credit}</div>
                </div>
            }
            </div>
            <div className="diff-content">
              <div className="eb"><span className="n">{d.n}</span><span>{d.eb}</span></div>
              <h3>{d.title}</h3>
              <p className="body">{d.body}</p>
              <div className="diff-vs">
                <div className="them">
                  <div className="h">Most contractors</div>
                  <p>{d.them.p}</p>
                </div>
                <div className="us">
                  <div className="h">Ideal Pros</div>
                  <p>{d.us.p}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>);

}

/* ============================================================
   TEAM
   ============================================================ */
function Team() {
  return (
    <section className="scene cream-deep" id="team" data-screen-label="05 Your Team">
      <div className="page-wrap">
        <div className="scene-intro">
          <div>
            <div className="eyebrow-num"><span className="dot"></span>04 · Your Team</div>
            <h2>You won't be<br />passed around.</h2>
          </div>
          <p className="lede">
            Each role below is a different person on staff — not one stretched-thin salesperson
            wearing four hats. Everyone has a phone number and a job to do.
          </p>
        </div>

        <div className="team-grid">
          {TEAM.map((m) =>
          <div className="team-card" key={m.role}>
              <div className={m.photo ? "avatar avatar-photo" : "avatar"}>
                {m.photo ? <img src={m.photo} alt={m.name} /> : m.initials}
              </div>
              <div className="role">{m.role}</div>
              <h4>{m.name}</h4>
              <p>{m.body}</p>
            </div>
          )}
        </div>
      </div>
    </section>);

}

/* ============================================================
   PRODUCTION ORDER
   ============================================================ */
function Production() {
  return (
    <section className="scene" id="process" data-screen-label="06 Production">
      <div className="page-wrap">
        <div className="scene-intro">
          <div>
            <div className="eyebrow-num"><span className="dot"></span>05 · Production</div>
            <h2>Roof first,<br />then exteriors.</h2>
          </div>
          <p className="lede">
            Trades are handled in order, by the crew that specializes in them.
            Nothing gets done out of sequence — and the painters never have to work around
            a roof crew still throwing shingles.
          </p>
        </div>

        <div className="prod-rail">
          {PRODUCTION.map((p, i) =>
          <div className="prod-step" key={i}>
              <div className="step-n">{p.n}<span className="arrow"></span></div>
              <h4>{p.title}</h4>
              <p>{p.body}</p>
            </div>
          )}
        </div>
      </div>
    </section>);

}

/* ============================================================
   CREDIBILITY
   ============================================================ */
function Credibility() {
  return (
    <section className="scene dark" data-screen-label="07 Credibility">
      <div className="page-wrap">
        <div className="scene-intro">
          <div>
            <div className="eyebrow-num" style={{ color: "var(--burnished-gold)" }}>
              <span className="dot" style={{ background: "var(--burnished-gold)" }}></span>06 · Credentials
            </div>
            <h2 style={{ color: "var(--cream-stone)" }}>
              Earned, not<br />advertised.
            </h2>
          </div>
          <p className="lede" style={{ color: "rgba(244,238,227,.72)" }}>
            We don't lead with these on the website. But you should know what's behind the company
            before you put your roof in our hands.
          </p>
        </div>

        <div className="creds">
          {CREDS.map((c) =>
          <div className="cred" key={c.label}>
              <div className="num">
                {c.num}{c.suffix && <small>{c.suffix}</small>}
              </div>
              <h5>{c.label}</h5>
              <p>{c.body}</p>
            </div>
          )}
        </div>
      </div>
    </section>);

}

/* ============================================================
   FINALE — Next steps + signature
   ============================================================ */
function Finale({ t }) {
  return (
    <section className="scene finale" id="next" data-screen-label="08 Next Steps">
      <div className="page-wrap">
        <div className="finale-grid">
          <div>
            <div className="eyebrow-num"><span className="dot"></span>07 · Next Steps</div>
            <h2>What to do<br />next.</h2>
            <p className="lede" style={{ marginTop: 8 }}>
              Three small actions and the rest of the process starts moving.
              We'll be right here as soon as you have your claim number.
            </p>

            <ul className="check-list">
              <li>
                <span className="check"><Icon name="check" size={14} color="var(--onyx)" /></span>
                <span><b>Call your insurance.</b> Open a claim for hail damage on the date of loss we discussed. We'll help you get it started.</span>
              </li>
              <li>
                <span className="check"><Icon name="check" size={14} color="var(--onyx)" /></span>
                <span><b>Send us your claim number.</b> Once you have it, we attach our inspection report and estimate to your file with the carrier.</span>
              </li>
              <li>
                <span className="check"><Icon name="check" size={14} color="var(--onyx)" /></span>
                <span><b>Wait for the adjuster.</b> They'll call to schedule. You don't need us on site for their visit — they already have everything from us.</span>
              </li>
            </ul>

          </div>

          <div className="signature-card">
            <div className="pen">A note from the owner</div>
            <h4>You picked a contractor at the kitchen table. We don't take that lightly.</h4>
            <p>
              From the inspection today to the day your project closes out, you have my direct line.
              If anything ever feels off — answers are slow, a crew member isn't matching what we promised,
              the carrier goes quiet — call me before you call anyone else. We'll handle it.
            </p>
            <div className="sig-img"><img src="assets/signature.svg" alt="Jake Fairbanks signature" /></div>
            <div className="sig-line">
              Jake Fairbanks
              <span>Owner &amp; Founder · Ideal Roof &amp; Exterior Pros</span>
            </div>
            <div className="contact">
              <div><Icon name="phone" size={14} />   720 · 744 · 0925</div>
              <div><Icon name="mail" size={14} /> &nbsp; <a href="mailto:jake@myidealpros.com">jake@myidealpros.com</a></div>
              <div><Icon name="fileText" size={14} />   License #LIC00254349 · Insured</div>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

/* ============================================================
   FOOTER
   ============================================================ */
function PageFooter() {
  return (
    <footer className="page-footer">
      <div className="page-wrap row">
        <img src="../assets/logo-light.svg" alt="Ideal Pros" className="logo-mark" />
        <p>© 2026 Ideal Roof &amp; Exterior Pros · Denver, Colorado</p>
        <p className="lic">License #LIC00254349</p>
      </div>
    </footer>);

}

/* ============================================================
   APP
   ============================================================ */
function App() {
  const tweaks = TWEAK_DEFAULTS;
  const [activeId, setActiveId] = useState("damage");

  // Scroll-spy: track which section is in view
  useEffect(() => {
    const ids = SECTIONS.map((s) => s.id);
    const observers = [];
    const ratios = new Map(ids.map((id) => [id, 0]));
    const handler = (entries) => {
      entries.forEach((e) => ratios.set(e.target.id, e.intersectionRatio));
      let best = "damage";
      let bestR = 0;
      ratios.forEach((r, id) => {if (r > bestR) {bestR = r;best = id;}});
      if (bestR > 0.05) setActiveId(best);
    };
    const io = new IntersectionObserver(handler, {
      rootMargin: "-80px 0px -50% 0px",
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
    });
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {io.observe(el);observers.push(el);}
    });
    return () => io.disconnect();
  }, []);

  const jumpTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 64;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      <ScrollProgress />
      <TopBar activeId={activeId} onJump={jumpTo} />
      <main>
        <Hero t={tweaks} />
        <WhyClaim />
        <ClaimProcess />
        <Financing />
        <WhyIdeal />
        <Team />
        <Production />
        <Supplements />
        <Credibility />
        <Finale t={tweaks} />
      </main>
      <PageFooter />
    </>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);