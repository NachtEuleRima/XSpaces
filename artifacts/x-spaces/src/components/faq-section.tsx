import { useState } from "react";

const FAQS = [
  {
    q: "What is XCOMS.Space?",
    a: "XCOMS.Space is a live mission control for X Spaces — a tracker that shows you who's broadcasting right now and what's coming up next across the quadrant.",
  },
  {
    q: "How do I sign in?",
    a: "Tap SIGN IN WITH X on the splash screen to authorize via your X account, or enter your X username manually as a callsign. Either path gets you personalized intel on your followed accounts.",
  },
  {
    q: "What does signing in actually do?",
    a: "When you sign in, XCOMS tunes its sensors to your aliens — surfacing Spaces from people you like and follow at the top of the feed, separated from the wider quadrant.",
  },
  {
    q: "How do I send feedback?",
    a: "Hit the Trek officer icon (FEEDBACK) in the top-left corner of the main page. A secure channel opens — drop your message and beam it to the bridge.",
  },
  {
    q: "How do I support the mission?",
    a: "Tap the 🖖 Vulcan salute button on the left side of the screen to open the donation panel. Every contribution keeps the warp engines running.",
  },
  {
    q: "How often does the feed update?",
    a: "Live Spaces refresh every few seconds. Upcoming Spaces sync on a regular schedule so you never miss a scheduled transmission.",
  },
  {
    q: "Can I use XCOMS without an X account?",
    a: "Yes — tap SKIP on the splash screen to browse without a quantum signature. You'll see the full live feed; you just won't get personalized filtering based on who you follow.",
  },
  {
    q: "How do I sign out?",
    a: "Scroll to the very bottom of the page. You'll find a SIGN OUT button there to clear your callsign and return to open frequencies.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? FAQS : FAQS.slice(0, 2);

  return (
    <section style={{
      position: "relative",
      zIndex: 10,
      padding: "0 1.5rem 3rem",
      maxWidth: 480,
      margin: "0 auto",
      width: "100%",
    }}>
      <style>{`
        .faq-item {
          border: 1px solid rgba(0,229,245,0.15);
          border-radius: 12px;
          overflow: hidden;
          transition: border-color 0.2s;
          background: rgba(0,229,245,0.02);
        }
        .faq-item.faq-open {
          border-color: rgba(0,229,245,0.35);
          box-shadow: 0 0 18px rgba(0,229,245,0.08);
        }
        .faq-btn {
          width: 100%;
          background: none;
          border: none;
          padding: 0.85rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          cursor: pointer;
          text-align: left;
        }
        .faq-q {
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: hsl(195 100% 65%);
        }
        .faq-chevron {
          font-size: 0.55rem;
          color: rgba(0,229,245,0.5);
          transition: transform 0.2s;
          flex-shrink: 0;
        }
        .faq-chevron.faq-chevron-open {
          transform: rotate(180deg);
        }
        .faq-answer {
          padding: 0 1rem 0.9rem;
          font-family: monospace;
          font-size: 0.68rem;
          line-height: 1.8;
          letter-spacing: 0.04em;
          color: rgba(255,255,255,0.45);
          border-top: 1px solid rgba(0,229,245,0.08);
          padding-top: 0.75rem;
        }
      `}</style>

      {/* Header */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "2rem", marginBottom: "1.25rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{
            fontSize: "1.5rem",
            color: "#c084fc",
            textShadow: "0 0 4px #c084fc, 0 0 11px #c084fc, 0 0 19px #c084fc",
          }}>?</span>
          <span style={{
            fontSize: "clamp(1.25rem, 4vw, 1.75rem)",
            fontWeight: 900,
            fontFamily: "monospace",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#00e5f5",
            WebkitTextStroke: "1px rgba(210,140,10,0.7)",
            textShadow: "0 0 4px #00e5f5, 0 0 11px #00e5f5, 0 0 19px #00e5f5, 0 0 40px #00b8c4",
          }}>
            MISSION BRIEF
          </span>
          <span style={{
            fontSize: "1.5rem",
            color: "#c084fc",
            textShadow: "0 0 4px #c084fc, 0 0 11px #c084fc, 0 0 19px #c084fc",
          }}>?</span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem" }}>
          Frequently asked questions from the crew
        </p>
      </div>

      {/* Accordion */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {visible.map((faq, i) => (
          <div key={i} className={`faq-item${open === i ? " faq-open" : ""}`}>
            <button
              className="faq-btn"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              <span className="faq-q">{faq.q}</span>
              <span className={`faq-chevron${open === i ? " faq-chevron-open" : ""}`}>▼</span>
            </button>
            {open === i && (
              <div className="faq-answer">{faq.a}</div>
            )}
          </div>
        ))}

        <button
          onClick={() => { setShowAll(v => !v); if (showAll) setOpen(null); }}
          style={{
            marginTop: "0.75rem",
            width: "100%",
            background: "none",
            border: "1px solid rgba(0,229,245,0.2)",
            borderRadius: 10,
            padding: "0.55rem 1rem",
            fontFamily: "monospace",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(0,229,245,0.55)",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(0,229,245,0.5)")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(0,229,245,0.2)")}
        >
          {showAll ? "▲ Show less" : `▼ Show ${FAQS.length - 2} more`}
        </button>
      </div>
    </section>
  );
}
