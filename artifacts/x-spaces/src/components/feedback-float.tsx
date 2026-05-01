import { useState } from "react";

function FeedbackTooltip() {
  return (
    <div style={{
      position: "absolute",
      top: "50%",
      right: "calc(100% + 8px)",
      transform: "translateY(-50%)",
      background: "hsl(222 60% 7%)",
      border: "1px solid hsl(195 100% 50% / 0.35)",
      borderRadius: 6,
      padding: "0.25rem 0.5rem",
      fontFamily: "monospace",
      fontSize: "0.5rem",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "hsl(195 100% 70%)",
      boxShadow: "0 0 12px hsl(195 100% 50% / 0.2)",
      pointerEvents: "none",
      lineHeight: 1.6,
      textAlign: "center",
      whiteSpace: "nowrap",
    }}>
      <div>Hail</div>
      <div style={{ opacity: 0.65 }}>bridge</div>
    </div>
  );
}

export function FeedbackFloat() {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <style>{`
        @keyframes feedback-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes signal-ping {
          0%   { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .feedback-fab {
          animation: feedback-float 4s ease-in-out infinite;
        }
        .feedback-fab:hover {
          filter: drop-shadow(0 0 18px hsl(195 100% 55% / 0.9)) !important;
        }
        .signal-ping {
          animation: signal-ping 2s ease-out infinite;
        }
        .feedback-wrapper {
          position: fixed;
          right: 16px;
          top: 59%;
          transform: translateY(-50%);
          z-index: 80;
          display: inline-flex;
          align-items: center;
        }
        @media (min-width: 768px) {
          .feedback-wrapper { top: 65%; }
        }
      `}</style>

      <div
        className="feedback-wrapper"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {hovered && <FeedbackTooltip />}

        <button
          className="feedback-fab"
          onClick={() => window.dispatchEvent(new Event("xcoms:feedback"))}
          aria-label="Send feedback to the crew"
          style={{
            position: "relative",
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "1px solid hsl(195 100% 50% / 0.45)",
            background: "linear-gradient(135deg, hsl(222 60% 9%), hsl(195 100% 10%))",
            boxShadow: "0 0 22px hsl(195 100% 50% / 0.25), inset 0 0 12px hsl(195 100% 50% / 0.05)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            filter: "drop-shadow(0 0 10px hsl(195 100% 55% / 0.45))",
            transition: "filter 0.2s",
          }}
        >
          🎧
          <span style={{
            position: "absolute",
            top: 2,
            right: 2,
            width: 12,
            height: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span
              className="signal-ping"
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "hsl(195 100% 50% / 0.35)",
              }}
            />
            <span style={{ fontSize: 8, lineHeight: 1, position: "relative", zIndex: 1 }}>📡</span>
          </span>
        </button>
      </div>
    </>
  );
}
