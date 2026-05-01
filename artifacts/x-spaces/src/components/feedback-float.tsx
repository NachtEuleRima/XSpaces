import { useState } from "react";

function FeedbackTooltip() {
  return (
    <div style={{
      position: "absolute",
      top: "50%",
      right: "calc(100% + 10px)",
      transform: "translateY(-50%)",
      background: "hsl(222 60% 7%)",
      border: "1px solid hsl(195 100% 50% / 0.35)",
      borderRadius: 6,
      padding: "0.25rem 0.6rem",
      fontFamily: "monospace",
      fontSize: "0.5rem",
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      color: "hsl(195 100% 70%)",
      boxShadow: "0 0 14px hsl(195 100% 50% / 0.25)",
      pointerEvents: "none",
      lineHeight: 1.65,
      textAlign: "center",
      whiteSpace: "nowrap",
    }}>
      <div>Hail</div>
      <div style={{ opacity: 0.55 }}>bridge</div>
    </div>
  );
}

/* Starfleet combadge — the classic TNG-era delta communication badge */
function CombadgeIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cbOuter" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="hsl(42 90% 65%)" />
          <stop offset="100%" stopColor="hsl(35 80% 45%)" />
        </linearGradient>
        <linearGradient id="cbDelta" x1="8" y1="4" x2="24" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="hsl(195 100% 80%)" />
          <stop offset="100%" stopColor="hsl(220 90% 60%)" />
        </linearGradient>
        <filter id="cbGlow">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Outer badge oval — gold */}
      <ellipse cx="16" cy="17" rx="13" ry="11.5"
        fill="url(#cbOuter)"
        stroke="hsl(42 90% 75%)"
        strokeWidth="0.6"
        filter="url(#cbGlow)"
        opacity="0.95"
      />

      {/* Outer badge rim shadow */}
      <ellipse cx="16" cy="17" rx="11.5" ry="10"
        fill="hsl(222 60% 8%)"
        opacity="0.85"
      />

      {/* Delta / arrowhead pointing up — cyan */}
      <path
        d="M16 5 L26.5 24 L16 20 L5.5 24 Z"
        fill="url(#cbDelta)"
        filter="url(#cbGlow)"
        opacity="0.97"
      />

      {/* Inner delta cutout — dark centre */}
      <path
        d="M16 9.5 L22.5 22 L16 18.5 L9.5 22 Z"
        fill="hsl(222 60% 8%)"
        opacity="0.7"
      />

      {/* Pip / comm-signal dot at delta tip */}
      <circle cx="16" cy="7.5" r="1.4"
        fill="hsl(195 100% 85%)"
        filter="url(#cbGlow)"
      />

      {/* Horizontal rule separating delta from badge lower section */}
      <line x1="6.5" y1="24.5" x2="25.5" y2="24.5"
        stroke="hsl(42 90% 65%)"
        strokeWidth="0.7"
        opacity="0.6"
      />

      {/* Lower section — small oval detail */}
      <ellipse cx="16" cy="27" rx="5.5" ry="1.6"
        fill="hsl(42 90% 60%)"
        opacity="0.55"
      />
    </svg>
  );
}

export function FeedbackFloat() {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <style>{`
        @keyframes cb-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          40%       { transform: translateY(-7px) rotate(1.5deg); }
          70%       { transform: translateY(-3px) rotate(-1deg); }
        }
        @keyframes cb-ping {
          0%   { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        @keyframes cb-ping2 {
          0%   { transform: scale(1); opacity: 0.45; }
          100% { transform: scale(2.1); opacity: 0; }
        }
        .cb-fab {
          animation: cb-float 4.5s ease-in-out infinite;
        }
        .cb-fab:hover { filter: drop-shadow(0 0 14px hsl(195 100% 60% / 0.95)) drop-shadow(0 0 28px hsl(42 90% 60% / 0.5)) !important; }
        .cb-ping  { animation: cb-ping  2.4s ease-out infinite; }
        .cb-ping2 { animation: cb-ping2 2.4s ease-out 1.2s infinite; }
        .feedback-wrapper {
          position: fixed; right: 16px; top: 59%;
          transform: translateY(-50%); z-index: 80;
          display: inline-flex; align-items: center;
        }
        @media (min-width: 768px) { .feedback-wrapper { top: 65%; } }
      `}</style>

      <div
        className="feedback-wrapper"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {hovered && <FeedbackTooltip />}

        <button
          className="cb-fab"
          onClick={() => window.dispatchEvent(new Event("xcoms:feedback"))}
          aria-label="Hail the bridge crew — send feedback"
          style={{
            position: "relative",
            width: 50,
            height: 50,
            borderRadius: "50%",
            border: "1px solid hsl(42 90% 55% / 0.55)",
            background: "radial-gradient(circle at 35% 35%, hsl(222 60% 14%), hsl(222 60% 7%))",
            boxShadow: "0 0 20px hsl(42 90% 55% / 0.2), 0 0 40px hsl(195 100% 50% / 0.1), inset 0 0 14px hsl(42 90% 55% / 0.06)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            filter: "drop-shadow(0 0 8px hsl(195 100% 55% / 0.5)) drop-shadow(0 0 6px hsl(42 90% 60% / 0.35))",
            transition: "filter 0.2s",
            padding: 0,
          }}
        >
          <CombadgeIcon />

          {/* Signal ripple rings */}
          <span className="cb-ping" style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "1px solid hsl(195 100% 55% / 0.5)",
            pointerEvents: "none",
          }} />
          <span className="cb-ping2" style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "1px solid hsl(42 90% 60% / 0.35)",
            pointerEvents: "none",
          }} />
        </button>
      </div>
    </>
  );
}
