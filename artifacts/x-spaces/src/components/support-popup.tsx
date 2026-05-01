import { useEffect, useState } from "react";

const STORAGE_KEY = "xcoms_support_popup_seen";
const DELAY_MS = 3000; // TESTING — change back to 3 * 60 * 1000 before launch

export function SupportPopup() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // TESTING: session guard removed — restore before launch
    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setClosing(true);
    sessionStorage.setItem(STORAGE_KEY, "1");
    setTimeout(() => setVisible(false), 400);
  };

  const fund = () => {
    window.open("https://venmo.com/u/Rima-Sukhadia", "_blank", "noopener,noreferrer");
    dismiss();
  };

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes popup-in {
          from { opacity: 0; transform: translateX(-50%) translateY(calc(-50% + 24px)) scale(0.96); }
          to   { opacity: 1; transform: translateX(-50%) translateY(-50%) scale(1); }
        }
        @keyframes popup-out {
          from { opacity: 1; transform: translateX(-50%) translateY(-50%) scale(1); }
          to   { opacity: 0; transform: translateX(-50%) translateY(calc(-50% + 24px)) scale(0.96); }
        }
        .support-popup {
          animation: popup-in 0.4s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        .support-popup.closing {
          animation: popup-out 0.35s ease forwards;
        }
        .fund-btn:hover {
          background: hsl(195 100% 50% / 0.18) !important;
          box-shadow: 0 0 28px hsl(195 100% 50% / 0.5) !important;
        }
        .dismiss-btn:hover {
          color: rgba(255,255,255,0.5) !important;
        }
      `}</style>

      {/* Backdrop — tap anywhere outside to dismiss */}
      <div
        onClick={dismiss}
        onTouchEnd={dismiss}
        style={{
          position: "fixed", inset: 0, zIndex: 90,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          cursor: "pointer",
        }}
      />

      {/* Panel */}
      <div
        className={`support-popup${closing ? " closing" : ""}`}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translateX(-50%) translateY(-50%)",
          zIndex: 100,
          width: "min(420px, calc(100vw - 32px))",
          background: "linear-gradient(135deg, hsl(222 60% 8%) 0%, hsl(222 60% 6%) 100%)",
          border: "1px solid hsl(195 100% 50% / 0.25)",
          borderRadius: 20,
          padding: "2rem 1.75rem 1.75rem",
          boxShadow: "0 0 60px hsl(195 100% 50% / 0.12), 0 24px 60px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          textAlign: "center",
        }}
      >
        {/* Dismiss X */}
        <button
          className="dismiss-btn"
          onClick={dismiss}
          style={{
            position: "absolute", top: 14, right: 16,
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.25)", fontSize: 18, lineHeight: 1,
            transition: "color 0.2s",
          }}
          aria-label="Dismiss"
        >✕</button>

        {/* Starfleet badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          margin: "0 auto",
          fontFamily: "monospace", fontSize: "0.6rem", letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "hsl(195 100% 50%)",
          border: "1px solid hsl(195 100% 50% / 0.3)",
          borderRadius: 99, padding: "0.3rem 0.9rem",
          boxShadow: "0 0 14px hsl(195 100% 50% / 0.15)",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "hsl(195 100% 50%)", boxShadow: "0 0 8px hsl(195 100% 50%)", flexShrink: 0 }} />
          XFLEET OPERATIONS
        </div>

        {/* Heading */}
        <div>
          <p style={{
            fontFamily: "monospace", fontWeight: 900,
            fontSize: "clamp(1.1rem, 4vw, 1.4rem)",
            letterSpacing: "0.05em", textTransform: "uppercase",
            color: "white", lineHeight: 1.2, marginBottom: "0.5rem",
          }}>
            Enjoying the<br />
            <span style={{
              background: "linear-gradient(90deg, hsl(195 100% 65%), hsl(290 90% 70%))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>open channel?</span>
          </p>
          <p style={{
            fontFamily: "monospace", fontSize: "0.78rem",
            color: "rgba(255,255,255,0.45)", lineHeight: 1.6,
          }}>
            This vessel runs on dilithium crystals<br />
            and caffeine. Help keep the shields up.
          </p>
        </div>

        {/* Donate button */}
        <button
          className="fund-btn"
          onClick={fund}
          style={{
            width: "100%",
            padding: "0.85rem 1.5rem",
            borderRadius: 12,
            border: "1px solid hsl(195 100% 50% / 0.4)",
            background: "hsl(195 100% 50% / 0.1)",
            color: "hsl(195 100% 70%)",
            fontFamily: "monospace", fontWeight: 700,
            fontSize: "0.85rem", letterSpacing: "0.15em",
            textTransform: "uppercase",
            cursor: "pointer",
            boxShadow: "0 0 18px hsl(195 100% 50% / 0.2)",
            transition: "all 0.2s",
          }}
        >
          ⚡ FUND THE MISSION ⚡
        </button>

        {/* Dismiss link */}
        <button
          className="dismiss-btn"
          onClick={dismiss}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "monospace", fontSize: "0.65rem",
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
            transition: "color 0.2s",
          }}
        >
          Continue mission without funding
        </button>
      </div>
    </>
  );
}
