import { useState } from "react";

/* Trek officer bust wearing a headset with mic boom */
function HeadsetOfficerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="faceGrad" x1="11" y1="5" x2="23" y2="17" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="hsl(195 100% 80%)" />
          <stop offset="100%" stopColor="hsl(220 80% 65%)" />
        </linearGradient>
        <linearGradient id="uniformGrad" x1="4" y1="20" x2="30" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="hsl(222 60% 22%)" />
          <stop offset="100%" stopColor="hsl(222 60% 12%)" />
        </linearGradient>
        <linearGradient id="deltaGrad" x1="14" y1="20" x2="20" y2="29" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="hsl(48 100% 78%)" />
          <stop offset="55%" stopColor="hsl(42 90% 58%)" />
          <stop offset="100%" stopColor="hsl(36 80% 42%)" />
        </linearGradient>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="0.8" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Starfleet uniform / shoulders */}
      <path d="M4 34 C4 25 9 21 17 21 C25 21 30 25 30 34" fill="url(#uniformGrad)" />
      {/* Uniform collar trim — gold */}
      <path d="M12 21 L17 26 L22 21" fill="none" stroke="hsl(42 90% 65%)" strokeWidth="1.1" strokeLinejoin="round"/>
      {/* Starfleet delta badge on chest — classic hollow arrowhead */}
      {/* Outer gold delta */}
      <path d="M17 20.5 L21.8 29 L17 26.8 L12.2 29 Z"
        fill="url(#deltaGrad)" filter="url(#softGlow)" />
      {/* Inner cutout — gives the hollow classic look */}
      <path d="M17 22.8 L20.2 28 L17 26 L13.8 28 Z"
        fill="hsl(222 60% 13%)" opacity="0.82" />
      {/* Shine highlight on left face of delta */}
      <path d="M17 21.5 L14.2 28 L17 26 Z"
        fill="hsl(48 100% 85%)" opacity="0.18" />

      {/* Head */}
      <circle cx="17" cy="12" r="6.5" fill="url(#faceGrad)" filter="url(#softGlow)" />
      {/* Face shadow / depth */}
      <circle cx="17" cy="12" r="5.5" fill="hsl(215 70% 60%)" opacity="0.25" />

      {/* Eyes — two small dots */}
      <circle cx="14.8" cy="11.5" r="0.8" fill="hsl(222 60% 12%)" opacity="0.7"/>
      <circle cx="19.2" cy="11.5" r="0.8" fill="hsl(222 60% 12%)" opacity="0.7"/>

      {/* Headset band arc over head */}
      <path d="M10 11.5 C10 5 24 5 24 11.5"
        stroke="hsl(290 85% 70%)" strokeWidth="1.5" fill="none" strokeLinecap="round"
        filter="url(#softGlow)"
      />
      {/* Left ear cup */}
      <rect x="8" y="10.5" width="4" height="5.5" rx="2"
        fill="hsl(290 85% 20%)" stroke="hsl(290 85% 70%)" strokeWidth="1"
      />
      {/* Right ear cup */}
      <rect x="22" y="10.5" width="4" height="5.5" rx="2"
        fill="hsl(290 85% 20%)" stroke="hsl(290 85% 70%)" strokeWidth="1"
      />

      {/* Mic boom — curves down from right ear cup */}
      <path d="M24 14.5 C26 16 25.5 18.5 23.5 19.5"
        stroke="hsl(195 100% 65%)" strokeWidth="1" fill="none" strokeLinecap="round"
        filter="url(#softGlow)"
      />
      {/* Mic capsule at boom tip */}
      <circle cx="23" cy="20" r="1.4"
        fill="hsl(195 100% 50%)" filter="url(#softGlow)"
      />
      {/* Mic active dot */}
      <circle cx="23" cy="20" r="0.6" fill="white" opacity="0.9"/>

      {/* Small sound-wave arcs left of mic — "listening/transmitting" */}
      <path d="M20.5 18 C21.2 19 21.2 21 20.5 22"
        stroke="hsl(195 100% 65% / 0.6)" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      <path d="M19 17 C20.2 18.5 20.2 21.5 19 23"
        stroke="hsl(195 100% 65% / 0.35)" strokeWidth="0.7" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

export function FeedbackFloat() {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <style>{`
        @keyframes cb-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes cb-ping {
          0%   { transform: scale(1); opacity: 0.65; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes cb-ping2 {
          0%   { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(2.0); opacity: 0; }
        }
        @keyframes mic-blink {
          0%, 80%, 100% { opacity: 1; }
          90% { opacity: 0.15; }
        }
        .cb-fab { animation: none; }
        .cb-fab:hover {
          filter: drop-shadow(0 0 16px hsl(195 100% 55% / 0.95)) drop-shadow(0 0 24px hsl(290 85% 65% / 0.5)) !important;
        }
        .cb-ping  { animation: cb-ping  2.6s ease-out infinite; }
        .cb-ping2 { animation: cb-ping2 2.6s ease-out 1.3s infinite; }
        .mic-dot  { animation: mic-blink 2s ease-in-out infinite; }
        .feedback-wrapper {
          position: fixed; left: 16px; top: 16px;
          z-index: 80;
          display: flex; flex-direction: column; align-items: center; gap: 5px;
        }

        .feedback-label {
          font-family: monospace;
          font-size: 0.42rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: hsl(195 100% 60% / 0.6);
          white-space: nowrap;
          pointer-events: none;
          transition: color 0.2s;
        }
        .feedback-wrapper:hover .feedback-label {
          color: hsl(195 100% 70% / 0.9);
        }

        .tooltip-bubble {
          position: absolute;
          top: 50%;
          left: calc(100% + 10px);
          transform: translateY(-50%);
          background: hsl(222 60% 7%);
          border: 1px solid hsl(195 100% 50% / 0.4);
          border-radius: 8px;
          padding: 0.35rem 0.65rem;
          font-family: monospace;
          font-size: 0.52rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: hsl(195 100% 72%);
          box-shadow: 0 0 16px hsl(195 100% 50% / 0.2);
          pointer-events: none;
          line-height: 1.7;
          text-align: center;
          white-space: nowrap;
        }
        .tooltip-bubble::after {
          content: '';
          position: absolute;
          top: 50%; left: -5px;
          transform: translateY(-50%);
          border: 4px solid transparent;
          border-right-color: hsl(195 100% 50% / 0.4);
        }
      `}</style>

      <div
        className="feedback-wrapper"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{ position: "relative" }}>
          {hovered && (
            <div className="tooltip-bubble">
              <div style={{ fontWeight: 800 }}>Open Channel</div>
              <div style={{ opacity: 0.5, fontSize: "0.46rem" }}>Send feedback</div>
            </div>
          )}

          <button
            className="cb-fab"
            onClick={() => window.dispatchEvent(new Event("xcoms:feedback"))}
            aria-label="Hail the bridge — send feedback"
            style={{
              position: "relative",
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "1.5px solid hsl(290 85% 65% / 0.5)",
              background: "radial-gradient(circle at 38% 35%, hsl(222 60% 16%), hsl(222 60% 7%))",
              boxShadow: "0 0 22px hsl(290 85% 55% / 0.2), 0 0 44px hsl(195 100% 50% / 0.08), inset 0 0 16px hsl(290 85% 55% / 0.06)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              filter: "drop-shadow(0 0 8px hsl(195 100% 55% / 0.5)) drop-shadow(0 0 5px hsl(290 85% 65% / 0.4))",
              transition: "filter 0.2s",
              padding: 0,
            }}
          >
            <HeadsetOfficerIcon />

            <span className="cb-ping" style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: "1px solid hsl(195 100% 55% / 0.5)",
              pointerEvents: "none",
            }} />
            <span className="cb-ping2" style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: "1px solid hsl(290 85% 65% / 0.35)",
              pointerEvents: "none",
            }} />
          </button>
        </div>

        {/* Always-visible label below button */}
        <span className="feedback-label">feedback</span>
      </div>
    </>
  );
}
