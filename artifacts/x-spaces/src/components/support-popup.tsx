import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "xcoms_support_popup_seen";
const DELAY_MS = 5 * 1000; // 5s for preview — change back to 3 * 60 * 1000

function CommanderIcon() {
  return (
    <div style={{ position: "relative", width: 72, height: 72, margin: "0 auto" }}>
      <style>{`
        @keyframes ring-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.06); }
        }
        .cmd-ring { animation: ring-pulse 2.8s ease-in-out infinite; }
      `}</style>
      {/* Outer glow ring */}
      <div className="cmd-ring" style={{
        position: "absolute", inset: -4,
        borderRadius: "50%",
        background: "transparent",
        border: "1.5px solid hsl(195 100% 50% / 0.5)",
        boxShadow: "0 0 18px hsl(195 100% 50% / 0.4), inset 0 0 12px hsl(195 100% 50% / 0.08)",
      }} />
      {/* Main circle */}
      <div style={{
        width: 72, height: 72, borderRadius: "50%",
        background: "linear-gradient(145deg, hsl(222 60% 12%), hsl(222 55% 8%))",
        border: "1.5px solid hsl(195 100% 50% / 0.35)",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        boxShadow: "0 0 30px hsl(195 100% 50% / 0.15)",
      }}>
        {/* Commander SVG */}
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Head */}
          <circle cx="22" cy="15" r="7" fill="hsl(195 100% 65% / 0.2)" stroke="hsl(195 100% 65%)" strokeWidth="1.2"/>
          {/* Shoulders / uniform */}
          <path d="M8 38 C8 28 14 24 22 24 C30 24 36 28 36 38" fill="hsl(195 100% 50% / 0.15)" stroke="hsl(195 100% 60%)" strokeWidth="1.2"/>
          {/* Comm badge */}
          <path d="M20 31 L22 29 L24 31 L22 33 Z" fill="hsl(195 100% 70%)" opacity="0.9"/>
          {/* Headphone band */}
          <path d="M13 15 C13 8 31 8 31 15" stroke="hsl(290 90% 70%)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          {/* Left ear cup */}
          <rect x="10" y="14" width="5" height="8" rx="2.5" fill="hsl(290 90% 65% / 0.3)" stroke="hsl(290 90% 70%)" strokeWidth="1.2"/>
          {/* Right ear cup */}
          <rect x="29" y="14" width="5" height="8" rx="2.5" fill="hsl(290 90% 65% / 0.3)" stroke="hsl(290 90% 70%)" strokeWidth="1.2"/>
          {/* Sound waves left */}
          <path d="M8 16 C6 18 6 20 8 22" stroke="hsl(195 100% 60% / 0.5)" strokeWidth="1" fill="none" strokeLinecap="round"/>
          {/* Sound waves right */}
          <path d="M36 16 C38 18 38 20 36 22" stroke="hsl(195 100% 60% / 0.5)" strokeWidth="1" fill="none" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
}

type Status = "idle" | "submitting" | "done" | "error";

export function SupportPopup() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setClosing(true);
    sessionStorage.setItem(STORAGE_KEY, "1");
    setTimeout(() => setVisible(false), 400);
  };

  const submit = async () => {
    if (!text.trim() || status === "submitting") return;
    setStatus("submitting");
    const username = localStorage.getItem("xcoms_username") ?? null;
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, message: text.trim() }),
      });
      if (!res.ok) throw new Error("bad response");
      setStatus("done");
      setTimeout(dismiss, 2200);
    } catch {
      setStatus("error");
    }
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
        .support-popup { animation: popup-in 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }
        .support-popup.closing { animation: popup-out 0.35s ease forwards; }
        .xcoms-textarea {
          width: 100%; resize: none; outline: none;
          background: hsl(222 60% 6%);
          border: 1px solid hsl(195 100% 50% / 0.2);
          border-radius: 10px;
          padding: 0.75rem 0.9rem;
          color: hsl(195 100% 80%);
          font-family: monospace; font-size: 0.78rem; line-height: 1.6;
          letter-spacing: 0.03em;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .xcoms-textarea::placeholder { color: rgba(255,255,255,0.2); }
        .xcoms-textarea:focus {
          border-color: hsl(195 100% 50% / 0.5);
          box-shadow: 0 0 16px hsl(195 100% 50% / 0.1);
        }
        .xcoms-send-btn {
          width: 100%; padding: 0.8rem;
          border-radius: 10px;
          border: 1px solid hsl(195 100% 50% / 0.35);
          background: hsl(195 100% 50% / 0.1);
          color: hsl(195 100% 70%);
          font-family: monospace; font-weight: 700;
          font-size: 0.8rem; letter-spacing: 0.15em;
          text-transform: uppercase; cursor: pointer;
          transition: all 0.2s;
        }
        .xcoms-send-btn:hover:not(:disabled) {
          background: hsl(195 100% 50% / 0.18);
          box-shadow: 0 0 24px hsl(195 100% 50% / 0.4);
        }
        .xcoms-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .dismiss-btn:hover { color: rgba(255,255,255,0.5) !important; }
      `}</style>

      <div
        onClick={dismiss}
        onTouchEnd={dismiss}
        style={{
          position: "fixed", inset: 0, zIndex: 90,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
          cursor: "pointer",
        }}
      />

      <div
        className={`support-popup${closing ? " closing" : ""}`}
        style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translateX(-50%) translateY(-50%)",
          zIndex: 100,
          width: "min(400px, calc(100vw - 32px))",
          background: "linear-gradient(135deg, hsl(222 60% 8%) 0%, hsl(222 60% 6%) 100%)",
          border: "1px solid hsl(195 100% 50% / 0.25)",
          borderRadius: 20,
          padding: "2rem 1.75rem 1.5rem",
          boxShadow: "0 0 60px hsl(195 100% 50% / 0.12), 0 24px 60px rgba(0,0,0,0.6)",
          display: "flex", flexDirection: "column", gap: "1rem",
          textAlign: "center",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top beam */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          borderRadius: "20px 20px 0 0",
          background: "linear-gradient(to right, transparent, hsl(195 100% 50% / 0.6), hsl(290 90% 62% / 0.4), transparent)",
        }} />

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

        {status === "done" ? (
          <div style={{ padding: "1rem 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "2.5rem" }}>🖖</span>
            <p style={{
              fontFamily: "monospace", fontWeight: 800, fontSize: "1rem",
              letterSpacing: "0.08em", textTransform: "uppercase",
              background: "linear-gradient(90deg, hsl(195 100% 65%), hsl(290 90% 70%))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Transmission received</p>
            <p style={{ fontFamily: "monospace", fontSize: "0.68rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>
              Your signal has been logged at Command
            </p>
          </div>
        ) : (
          <>
            <CommanderIcon />

            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                fontFamily: "monospace", fontSize: "0.58rem", letterSpacing: "0.25em",
                textTransform: "uppercase", color: "hsl(195 100% 50%)",
                border: "1px solid hsl(195 100% 50% / 0.3)",
                borderRadius: 99, padding: "0.28rem 0.85rem",
                boxShadow: "0 0 14px hsl(195 100% 50% / 0.15)",
                marginBottom: "0.6rem",
              }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "hsl(195 100% 50%)", boxShadow: "0 0 8px hsl(195 100% 50%)", flexShrink: 0 }} />
                OPEN CHANNEL
              </div>
              <p style={{
                fontFamily: "monospace", fontWeight: 900,
                fontSize: "clamp(1rem, 4vw, 1.25rem)",
                letterSpacing: "0.05em", textTransform: "uppercase",
                color: "white", lineHeight: 1.25, marginBottom: "0.4rem",
              }}>
                Hail the<br />
                <span style={{
                  background: "linear-gradient(90deg, hsl(195 100% 65%), hsl(290 90% 70%))",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>bridge crew</span>
              </p>
              <p style={{
                fontFamily: "monospace", fontSize: "0.72rem",
                color: "rgba(255,255,255,0.35)", lineHeight: 1.6,
              }}>
                Your signal reaches Command directly.<br />
                Report anomalies, ideas, or tribbles.
              </p>
            </div>

            <textarea
              ref={textareaRef}
              className="xcoms-textarea"
              rows={3}
              maxLength={500}
              placeholder="Transmit your message to the crew..."
              value={text}
              onChange={e => { setText(e.target.value); if (status === "error") setStatus("idle"); }}
              disabled={status === "submitting"}
            />

            {status === "error" && (
              <p style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "hsl(0 80% 65%)", margin: "-0.4rem 0 0" }}>
                Transmission failed — try again, ensign
              </p>
            )}

            <button
              className="xcoms-send-btn"
              onClick={submit}
              disabled={!text.trim() || status === "submitting"}
            >
              {status === "submitting" ? "Transmitting…" : "⚡ Send Transmission ⚡"}
            </button>

            <button
              className="dismiss-btn"
              onClick={dismiss}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "monospace", fontSize: "0.6rem",
                letterSpacing: "0.2em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.2)", transition: "color 0.2s",
              }}
            >
              Continue mission
            </button>
          </>
        )}
      </div>
    </>
  );
}
