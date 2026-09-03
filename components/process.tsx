import { SiteHeader, SiteFooter } from "@/components/site-nav";

type Shot = { src: string; caption: string };

function Shots({ shots }: { shots: Shot[] }) {
  return (
    <div className="shots">
      {shots.map((s) => (
        <figure className="shot" key={s.src}>
          {/* Job photography, not decoration — the alt text describes what the
              crew documented so it reads correctly to screen readers. */}
          <img src={s.src} alt={s.caption} loading="lazy" />
          <figcaption>{s.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}

const STAGES: {
  n: number;
  title: string;
  body: string;
  note?: string;
  shots: Shot[];
}[] = [
  {
    n: 1,
    title: "Inspection & Documentation",
    body:
      "Before anything is touched, we document the loss the way an adjuster needs to see it — the source of the water, every affected room, and the pre-loss condition of the finishes we are going to be responsible for putting back.",
    note: "Photographed on arrival, before any demolition. This is what supports your claim later.",
    shots: [
      { src: "/process/seq-bath-1-before.jpg", caption: "Pre-loss condition recorded" },
      { src: "/process/seq-roof-1-before.jpg", caption: "Aerial inspection before work starts" },
    ],
  },
  {
    n: 2,
    title: "Emergency Mitigation & Drying",
    body:
      "Air movers and dehumidifiers go in the same visit wherever we can. Containment goes up so dust and moisture stay in the work area and your family keeps the rest of the house. We monitor the drying until the readings say it is actually dry — not until the schedule says so.",
    shots: [
      { src: "/process/mitigate-drying.jpg", caption: "Drying equipment set the same day" },
      { src: "/process/mitigate-containment.jpg", caption: "Containment sealing the work area" },
    ],
  },
  {
    n: 3,
    title: "Controlled Demolition",
    body:
      "We remove what is wet and nothing more. Flood cuts stop at the moisture line, flooring comes up where the subfloor is compromised, and every removal is photographed so there is a record of why it came out.",
    note: "What is underneath is usually worse than what shows. That is why we open it up rather than dry over it.",
    shots: [
      { src: "/process/demo-floodcut.jpg", caption: "Flood cut at the moisture line" },
      { src: "/process/demo-subfloor.jpg", caption: "Damage found beneath the boards" },
      { src: "/process/demo-bath-tile.jpg", caption: "Tile opened to trace the leak" },
      { src: "/process/demo-bath-tub.jpg", caption: "Original tub coming out" },
    ],
  },
  {
    n: 4,
    title: "Treatment & Clearance",
    body:
      "Exposed framing and subfloor are cleaned and treated with an antimicrobial before a single piece of new material goes back. Nothing gets closed up until the cavity is dry, treated, and inspected.",
    shots: [
      { src: "/process/treat-antimicrobial.jpg", caption: "Antimicrobial applied to framing" },
      { src: "/process/treat-framing.jpg", caption: "Shower drain set in a cleared floor" },
    ],
  },
  {
    n: 5,
    title: "Structural & Roof Repairs",
    body:
      "Decking, framing, and flooring are repaired before finishes go on. On roofs that means tearing off to the deck, replacing anything soft, and rebuilding the system properly. On floors it means weaving new boards into the existing run so the repair disappears.",
    shots: [
      { src: "/process/repair-decking.jpg", caption: "Torn off to bare decking" },
      { src: "/process/repair-shingles.jpg", caption: "New roof system going on" },
      { src: "/process/repair-hardwood.jpg", caption: "New boards woven into the floor" },
    ],
  },
  {
    n: 6,
    title: "Rebuild & Final Walkthrough",
    body:
      "Finishes, flooring, paint, and trim go back to the carrier's scope — and we walk every room with you before we call it done. If something on the list is not right, it is not finished.",
    note: "We do not consider the job complete until you have walked it and agreed it is complete.",
    shots: [
      { src: "/process/rebuild-restroom.jpg", caption: "Restroom finished and back in service" },
      { src: "/process/rebuild-restroom-2.jpg", caption: "New vanity, tile, and fixtures" },
      { src: "/process/rebuild-living.jpg", caption: "Living areas back in service" },
      { src: "/process/rebuild-kitchen.jpg", caption: "Kitchen rebuilt and cleaned" },
      { src: "/process/rebuild-interior.jpg", caption: "New flooring and finished paint" },
    ],
  },
];

// A job runs Before -> Demo -> After. Where we have the middle frame we show all
// three, because the demo shot is what explains why the finished room looks the
// way it does. Two-frame jobs simply omit `demo`.
type Frame = { src: string; when: string };
const SEQUENCES: {
  meta: string;
  title: string;
  body: string;
  before: Frame;
  demo?: Frame;
  after: Frame;
}[] = [
  {
    meta: "Roof replacement · aerial",
    title: "Storm-damaged roof, replaced in under four weeks",
    body:
      "Drone documentation from the inspection through to the finished roof. The same home from the same approach: a worn, failing roof in January, stripped to the deck and dried in, and a complete new system by early February.",
    before: { src: "/process/seq-roof-1-before.jpg", when: "Inspection — January 14" },
    demo: { src: "/process/seq-roof-2-demo.jpg", when: "Stripped to deck — February 4" },
    after: { src: "/process/seq-roof-3-after.jpg", when: "Completed — February 9" },
  },
  {
    meta: "Bathroom · tub-to-shower conversion",
    title: "A damaged tub surround became a walk-in shower",
    body:
      "Water behind the tile meant the surround had to come out, so the homeowner asked us to take the tub with it and put in a walk-in shower. The room went back to bare framing, the drain was reset for the new pan, and it came back as an accessible shower with grab bars, new tile, and a new floor.",
    before: { src: "/process/seq-bath-1-before.jpg", when: "Before — original tub and tile" },
    demo: { src: "/process/seq-bath-2-demo.jpg", when: "Demo — tub out, back to framing" },
    after: { src: "/process/seq-bath-3-after.jpg", when: "Finished — walk-in shower" },
  },
  {
    meta: "Water damage · flooring replacement",
    title: "Water-damaged hardwood, replaced through the home",
    body:
      "The original hardwood had water under the finish and rot in the boards beneath it. The affected flooring came out room by room — the hallway worst of all — and once the subfloor was repaired and treated the home went back with new carpet. The demo and finished frames are the same hallway.",
    before: { src: "/process/seq-floor-1-before.jpg", when: "Before — original hardwood" },
    demo: { src: "/process/seq-floor-2-demo.jpg", when: "Demo — hallway boards out" },
    after: { src: "/process/seq-floor-3-after.jpg", when: "Finished — hallway carpeted" },
  },
  {
    meta: "Kitchen · flooring and rebuild",
    title: "A kitchen stripped to subfloor, put back complete",
    body:
      "Water took this kitchen floor down to bare subfloor. The room was dried, the substrate repaired, and it went back with new plank flooring — the same doorway and the same cabinet run, finished and cleaned before handover.",
    before: { src: "/process/seq-kitchen-1-before.jpg", when: "Before — stripped to subfloor" },
    after: { src: "/process/seq-kitchen-2-after.jpg", when: "Finished — new plank flooring" },
  },
  {
    meta: "Roof replacement · one day on site",
    title: "Tear-off in the morning, dried in by dusk",
    body:
      "A full residential tear-off and replacement start to finish in a single day. Left: the crew stripping the old roof to the deck. Right: the same house that evening with the new roof on and the site cleaned up.",
    before: { src: "/process/seq-street-1-before.jpg", when: "Tear-off underway" },
    after: { src: "/process/seq-street-2-after.jpg", when: "Same day, dried in" },
  },
];

function BaFrame({
  frame,
  tag,
  kind,
  title,
}: {
  frame: Frame;
  tag: string;
  kind: "before" | "demo" | "after";
  title: string;
}) {
  return (
    <div className="ba-frame">
      <span className={`ba-tag ${kind}`}>{tag}</span>
      <img src={frame.src} alt={`${tag} — ${title}`} loading="lazy" />
      <div className="ba-when">{frame.when}</div>
    </div>
  );
}

export function Process() {
  return (
    <div className="hlg-site">
      <SiteHeader anchorBase="/" />

      {/* ===== Hero ===== */}
      <section className="page-hero" id="top">
        <div className="wrap page-hero-inner">
          <p className="crumb">
            <a href="/">Home</a> &nbsp;/&nbsp; Our Process
          </p>
          <h1>
            Every Step,<br />
            <span className="accent">Documented.</span>
          </h1>
          <p>
            Restoration goes wrong when nobody can see what happened behind the
            drywall. Here is how a Hall Legacy Group job actually runs — the same
            six stages on every property, photographed on real work.
          </p>
        </div>
      </section>

      {/* ===== Stages ===== */}
      <section className="section">
        <div className="wrap">
          <div className="process-head">
            <span className="eyebrow dark">Start to Finish</span>
            <h2>
              Six Stages, <span className="accent">In Order.</span>
            </h2>
            <div className="rule"></div>
          </div>
          <div style={{ marginTop: 24 }}>
            {STAGES.map((s, i) => (
              <div className={i % 2 ? "stage flip" : "stage"} key={s.n}>
                <div className="stage-copy">
                  <span className="stage-num">{s.n}</span>
                  <h2>{s.title}</h2>
                  <p>{s.body}</p>
                  {s.note && <p className="note">{s.note}</p>}
                </div>
                <Shots shots={s.shots} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Before / Demo / After ===== */}
      <section className="ba section" id="before-after">
        <div className="wrap">
          <div className="process-head">
            <span className="eyebrow dark">Before, Demo &amp; After</span>
            <h2>
              The Same Property, <span className="accent">Put Back Right.</span>
            </h2>
            <div className="rule"></div>
          </div>
          <div className="ba-list">
            {SEQUENCES.map((s) => (
              <article className="ba-item" key={s.title}>
                <div className={s.demo ? "ba-pair three" : "ba-pair"}>
                  <BaFrame frame={s.before} tag="Before" kind="before" title={s.title} />
                  {s.demo && (
                    <BaFrame frame={s.demo} tag="Demo" kind="demo" title={s.title} />
                  )}
                  <BaFrame frame={s.after} tag="After" kind="after" title={s.title} />
                </div>
                <div className="ba-body">
                  <span className="ba-meta">{s.meta}</span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="contact section" id="cta">
        <div className="wrap" style={{ textAlign: "center", padding: "24px 0" }}>
          <span className="eyebrow" style={{ color: "var(--gold-soft)" }}>
            Start Here
          </span>
          <h2 style={{ margin: "22px 0 18px" }}>
            Let&apos;s Look at <span className="accent">Your Property.</span>
          </h2>
          <p className="lead" style={{ margin: "0 auto 34px", maxWidth: 620 }}>
            The inspection is free and there is no obligation. We will document
            what we find and tell you honestly whether you have a claim worth
            filing.
          </p>
          <a href="/#contact" className="btn btn-gold">
            Get a Free Inspection
          </a>
        </div>
      </section>

      <SiteFooter anchorBase="/" />
    </div>
  );
}
