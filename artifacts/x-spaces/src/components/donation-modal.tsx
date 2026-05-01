import { useState } from "react";

const AMOUNTS = [4.2, 6.9, 42, 69];
const VENMO_URL = "https://venmo.com/u/Rima-Sukhadia";

function VenmoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }}>
      <path d="M19.09 1.01C19.7 2.04 19.97 3.1 19.97 4.44c0 4.27-3.65 9.82-6.61 13.72H6.74L4.03 2.14l6.1-.58 1.35 10.85c1.27-2.1 2.83-5.4 2.83-7.65 0-1.23-.21-2.07-.55-2.76l5.33-.99z"/>
    </svg>
  );
}

function ApplePayIcon() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1 }}>
      {/* Apple logo */}
      <svg viewBox="0 0 814 1000" fill="currentColor" style={{ width: 13, height: 16 }}>
        <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.3-166.8-106.6C112.4 756 64 651.2 64 551.1c0-190.5 124.2-291.2 246.1-291.2 66.2 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
      </svg>
      <span>Pay</span>
    </span>
  );
}

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 20, height: 20 }}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

interface DonationModalProps {
  onClose: () => void;
}

export function DonationModal({ onClose }: DonationModalProps) {
  const [amount, setAmount] = useState(4.2);
  const [custom, setCustom] = useState("");
  const [method, setMethod] = useState<"venmo" | "apple" | "card">("venmo");

  const finalAmount = custom ? parseFloat(custom) || 0 : amount;
  const isApple = /iPhone|iPad|iPod|Mac/i.test(navigator.userAgent);

  const handleFund = () => {
    if (method === "venmo") {
      const note = encodeURIComponent("Fund the Mission ⚡ XCOMS.Space");
      window.open(`${VENMO_URL}?txn=pay&amount=${finalAmount}&note=${note}`, "_blank", "noopener,noreferrer");
      onClose();
    }
  };

  const methods = [
    { id: "venmo" as const, label: "Venmo", icon: <VenmoIcon />, color: "hsl(210 100% 60%)" },
    ...(isApple ? [{ id: "apple" as const, label: "Apple Pay", icon: <ApplePayIcon />, color: "white" }] : []),
    { id: "card" as const, label: "Credit / Debit Card", icon: <CardIcon />, color: "hsl(290 90% 70%)" },
  ];

  return (
    <>
      <style>{`
        @keyframes dm-in {
          from { opacity: 0; transform: translateX(-50%) translateY(calc(-50% + 20px)) scale(0.96); }
          to   { opacity: 1; transform: translateX(-50%) translateY(-50%) scale(1); }
        }
        .dm-panel { animation: dm-in 0.35s cubic-bezier(0.16,1,0.3,1) forwards; }
        .dm-method-btn:hover { opacity: 1 !important; }
        .dm-fund-btn:hover { background: linear-gradient(135deg, hsl(195 100% 50% / 0.28), hsl(290 90% 62% / 0.2)) !important; }
        .dm-amount-btn:hover { border-color: hsl(195 100% 50% / 0.4) !important; color: hsl(195 100% 65%) !important; }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        onTouchEnd={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 110,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      />

      {/* Panel */}
      <div
        className="dm-panel"
        style={{
          position: "fixed",
          top: "50%", left: "50%",
          transform: "translateX(-50%) translateY(-50%)",
          zIndex: 120,
          width: "min(420px, calc(100vw - 24px))",
          background: "linear-gradient(160deg, hsl(222 55% 8%) 0%, hsl(222 50% 6%) 100%)",
          border: "1px solid hsl(195 100% 50% / 0.15)",
          borderRadius: 20,
          padding: "1.75rem 1.5rem 1.5rem",
          boxShadow: "0 0 80px hsl(195 100% 50% / 0.07), 0 32px 64px rgba(0,0,0,0.6)",
          display: "flex", flexDirection: "column", gap: "1.25rem",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 14, right: 16,
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.25)", fontSize: 18, lineHeight: 1,
          }}
          aria-label="Close"
        >✕</button>

        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontFamily: "monospace", fontSize: "0.55rem", letterSpacing: "0.3em",
            textTransform: "uppercase", color: "hsl(195 100% 55%)",
            border: "1px solid hsl(195 100% 50% / 0.25)",
            borderRadius: 99, padding: "0.25rem 0.7rem", marginBottom: "0.8rem",
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "hsl(195 100% 55%)", boxShadow: "0 0 6px hsl(195 100% 55%)" }} />
            XFLEET OPERATIONS
          </div>
          <p style={{ fontSize: "1.3rem", fontWeight: 800, color: "white", letterSpacing: "-0.02em", margin: 0, lineHeight: 1.2 }}>
            Fund the Mission
          </p>
          <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.38)", marginTop: "0.35rem", fontFamily: "monospace", lineHeight: 1.5 }}>
            Keep the open channel alive
          </p>
        </div>

        {/* Amount picker */}
        <div>
          <p style={{ fontSize: "0.58rem", fontFamily: "monospace", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: "0.5rem" }}>
            Select amount
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 7, marginBottom: 7 }}>
            {AMOUNTS.map(a => (
              <button
                key={a}
                className="dm-amount-btn"
                onClick={() => { setAmount(a); setCustom(""); }}
                style={{
                  padding: "0.55rem 0",
                  borderRadius: 10,
                  border: `1px solid ${!custom && amount === a ? "hsl(195 100% 50% / 0.6)" : "hsl(195 100% 50% / 0.1)"}`,
                  background: !custom && amount === a ? "hsl(195 100% 50% / 0.12)" : "transparent",
                  color: !custom && amount === a ? "hsl(195 100% 65%)" : "rgba(255,255,255,0.4)",
                  fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
                  transition: "all 0.15s",
                  boxShadow: !custom && amount === a ? "0 0 14px hsl(195 100% 50% / 0.18)" : "none",
                }}
              >
                ${a}
              </button>
            ))}
          </div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", fontSize: "0.85rem", fontWeight: 600 }}>$</span>
            <input
              type="number"
              placeholder="Custom amount"
              value={custom}
              onChange={e => setCustom(e.target.value)}
              onFocus={() => setAmount(0)}
              style={{
                width: "100%", boxSizing: "border-box",
                padding: "0.6rem 0.75rem 0.6rem 1.6rem",
                borderRadius: 10,
                border: `1px solid ${custom ? "hsl(195 100% 50% / 0.35)" : "hsl(195 100% 50% / 0.1)"}`,
                background: "hsl(222 40% 9%)",
                color: "white", fontSize: "0.85rem", outline: "none",
                fontFamily: "monospace", transition: "border 0.15s",
              }}
            />
          </div>
        </div>

        {/* Payment methods */}
        <div>
          <p style={{ fontSize: "0.58rem", fontFamily: "monospace", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: "0.5rem" }}>
            Pay with
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {methods.map(({ id, label, icon, color }) => (
              <button
                key={id}
                className="dm-method-btn"
                onClick={() => setMethod(id)}
                style={{
                  display: "flex", alignItems: "center", gap: 11,
                  padding: "0.7rem 0.9rem",
                  borderRadius: 12,
                  border: method === id ? `1px solid ${color}55` : "1px solid hsl(195 100% 50% / 0.09)",
                  background: method === id ? `${color}10` : "transparent",
                  color: method === id ? color : "rgba(255,255,255,0.42)",
                  cursor: "pointer", textAlign: "left", width: "100%",
                  transition: "all 0.15s",
                  boxShadow: method === id ? `0 0 16px ${color}18` : "none",
                  opacity: id !== "venmo" && method !== id ? 0.65 : 1,
                }}
              >
                <span style={{ opacity: method === id ? 1 : 0.6, display: "flex", alignItems: "center" }}>{icon}</span>
                <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{label}</span>
                {id !== "venmo" && (
                  <span style={{ marginLeft: "auto", fontSize: "0.55rem", fontFamily: "monospace", letterSpacing: "0.1em", opacity: 0.5, textTransform: "uppercase" }}>
                    Soon
                  </span>
                )}
                <span style={{
                  marginLeft: id === "venmo" ? "auto" : "0",
                  width: 15, height: 15, borderRadius: "50%",
                  border: method === id ? `5px solid ${color}` : "2px solid rgba(255,255,255,0.2)",
                  background: "transparent", flexShrink: 0, transition: "all 0.15s",
                }} />
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          className="dm-fund-btn"
          onClick={handleFund}
          style={{
            width: "100%", padding: "0.85rem",
            borderRadius: 12,
            border: "1px solid hsl(195 100% 50% / 0.4)",
            background: "linear-gradient(135deg, hsl(195 100% 50% / 0.18), hsl(290 90% 62% / 0.12))",
            color: "hsl(195 100% 70%)",
            fontFamily: "monospace", fontWeight: 700, fontSize: "0.82rem",
            letterSpacing: "0.15em", textTransform: "uppercase",
            cursor: "pointer",
            boxShadow: "0 0 24px hsl(195 100% 50% / 0.15)",
            transition: "background 0.2s",
          }}
        >
          ⚡ Send ${finalAmount || "—"} via {method === "venmo" ? "Venmo" : method === "apple" ? "Apple Pay" : "Card"}
        </button>

        <p style={{ textAlign: "center", fontSize: "0.58rem", fontFamily: "monospace", color: "rgba(255,255,255,0.18)", letterSpacing: "0.1em" }}>
          Secured · No account needed for Venmo link
        </p>
      </div>
    </>
  );
}
