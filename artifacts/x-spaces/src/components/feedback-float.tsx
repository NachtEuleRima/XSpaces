import { useState, useEffect } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return isMobile;
}

function DeltaBadgeIcon() {
  return (
    <img
      src={`${BASE}/delta-badge-transparent.png`}
      alt="Starfleet delta badge"
      width={22}
      height={22}
      style={{ objectFit: "contain", filter: "drop-shadow(0 0 6px hsl(42 90% 65% / 0.7))" }}
    />
  );
}

export function FeedbackFloat() {
  const [hovered, setHovered] = useState(false);
  const isMobile = useIsMobile();
  const [autoShow, setAutoShow] = useState(false);

  useEffect(() => {
    if (!isMobile) return;
    const show = () => {
      setAutoShow(true);
      setTimeout(() => setAutoShow(false), 2000);
    };
    // First flash after 2s so it's not immediate on load
    const initial = setTimeout(show, 2000);
    const interval = setInterval(show, 5000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [isMobile]);

  const showTooltip = hovered || autoShow;

  return (
    <>
      <style>{`
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
        @keyframes tooltip-pop {
          0%   { opacity: 0; transform: translateY(-50%) translateX(-6px); }
          20%  { opacity: 1; transform: translateY(-50%) translateX(0); }
          80%  { opacity: 1; transform: translateY(-50%) translateX(0); }
          100% { opacity: 0; transform: translateY(-50%) translateX(-6px); }
        }
        .cb-fab { animation: none; }
        .cb-fab:hover {
          filter: drop-shadow(0 0 16px hsl(195 100% 55% / 0.95)) drop-shadow(0 0 24px hsl(290 85% 65% / 0.5)) !important;
        }
        .cb-ping  { animation: cb-ping  2.6s ease-out infinite; }
        .cb-ping2 { animation: cb-ping2 2.6s ease-out 1.3s infinite; }
        .mic-dot  { animation: mic-blink 2s ease-in-out infinite; }
        .feedback-wrapper {
          display: flex; flex-direction: column; align-items: center; gap: 5px;
          pointer-events: auto;
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
        .tooltip-bubble.hover-show {
          opacity: 1;
        }
        .tooltip-bubble.auto-show {
          animation: tooltip-pop 2s ease forwards;
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
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, pointerEvents: "auto" }}
      >
        <div style={{ position: "relative" }}>
          {showTooltip && (
            <div className={`tooltip-bubble ${hovered ? "hover-show" : "auto-show"}`}>
              <div>Hail</div>
              <div style={{ opacity: 0.65 }}>bridge</div>
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
            <DeltaBadgeIcon />

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
