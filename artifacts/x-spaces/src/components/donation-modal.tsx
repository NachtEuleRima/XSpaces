import { useState, useEffect, useRef, useCallback } from "react";

const AMOUNTS = [4.2, 6.9, 42, 69];
const VENMO_URL = "https://venmo.com/u/Rima-Sukhadia";
const CASHAPP_URL = "https://cash.app/$RSukhi";
const PAYPAL_URL = "https://www.paypal.com/qrcodes/p2pqrc/Y6FMFFN58N6RW";

function VenmoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }}>
      <path d="M19.09 1.01C19.7 2.04 19.97 3.1 19.97 4.44c0 4.27-3.65 9.82-6.61 13.72H6.74L4.03 2.14l6.1-.58 1.35 10.85c1.27-2.1 2.83-5.4 2.83-7.65 0-1.23-.21-2.07-.55-2.76l5.33-.99z"/>
    </svg>
  );
}

function CashAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1.688 17.418l-.34 1.267c-.03.11-.13.187-.244.187h-1.522a.254.254 0 0 1-.245-.32l.322-1.204a4.51 4.51 0 0 1-2.574-1.09.254.254 0 0 1-.012-.366l1.005-1.005a.254.254 0 0 1 .339-.018c.55.46 1.246.733 1.986.733.86 0 1.373-.376 1.373-.963 0-.513-.32-.806-1.417-1.13-1.6-.476-2.674-1.1-2.674-2.61 0-1.22.862-2.148 2.27-2.47l.322-1.204a.254.254 0 0 1 .245-.187h1.522c.16 0 .276.154.245.312l-.316 1.18a4.424 4.424 0 0 1 2.04.897.254.254 0 0 1 .024.366l-.963.996a.254.254 0 0 1-.34.022 2.764 2.764 0 0 0-1.727-.587c-.77 0-1.22.34-1.22.862 0 .476.394.733 1.6 1.09 1.655.49 2.49 1.19 2.49 2.673-.002 1.274-.9 2.23-2.37 2.568z"/>
    </svg>
  );
}

function PayPalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }}>
      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
    </svg>
  );
}


const X_LOGO = (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16, display: "inline-block", verticalAlign: "middle" }}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

type Method = "venmo" | "cashapp" | "paypal";

interface DonationModalProps {
  onClose: () => void;
}

export function DonationModal({ onClose }: DonationModalProps) {
  const [amount, setAmount] = useState(4.2);
  const [custom, setCustom] = useState("");
  const [method, setMethod] = useState<Method>("venmo");
  const [showAuth, setShowAuth] = useState(false);
  const [xPending, setXPending] = useState(false);
  const [xError, setXError] = useState<string | null>(null);
  const popupRef = useRef<Window | null>(null);

  const finalAmount = custom ? parseFloat(custom) || 0 : amount;

  const proceedToPayment = useCallback((username?: string) => {
    const user = username ?? localStorage.getItem("xcoms_username") ?? undefined;
    fetch("/api/donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user, amount: finalAmount, method }),
    }).catch(() => {});

    if (method === "venmo") {
      const note = encodeURIComponent("Fund the Mission ⚡ XCOMS.Space");
      window.open(`${VENMO_URL}?txn=pay&amount=${finalAmount}&note=${note}`, "_blank", "noopener,noreferrer");
    } else if (method === "cashapp") {
      window.open(`${CASHAPP_URL}?amount=${finalAmount}`, "_blank", "noopener,noreferrer");
    } else if (method === "paypal") {
      window.open(PAYPAL_URL, "_blank", "noopener,noreferrer");
    }
    onClose();
  }, [finalAmount, method, onClose]);

  const handleFund = () => {
    const username = localStorage.getItem("xcoms_username");
    if (!username) {
      setShowAuth(true);
      return;
    }
    proceedToPayment(username);
  };

  const handleXSignIn = () => {
    setXError(null);
    const w = 600, h = 700;
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top = window.screenY + (window.outerHeight - h) / 2;
    const popup = window.open("/api/auth/x/login", "x-oauth", `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes`);
    if (!popup) { setXError("Popup blocked — please allow popups"); return; }
    popupRef.current = popup;
    setXPending(true);
    const poll = setInterval(() => {
      if (popup.closed) { clearInterval(poll); setXPending(false); }
    }, 500);
  };

  const handleXMessage = useCallback((e: MessageEvent) => {
    if (e.data?.type === "x-auth-success" && e.data.username) {
      const username = e.data.username.replace(/^@/, "").toLowerCase().trim();
      localStorage.setItem("xcoms_username", username);
      localStorage.setItem("xcoms_auth_method", "x");
      window.dispatchEvent(new CustomEvent("xcoms:auth-close"));
      setXPending(false);
      setShowAuth(false);
      // Return to the main modal view — user can review and hit Fund the Mission
    } else if (e.data?.type === "x-auth-error") {
      setXError(e.data.error ?? "Sign-in failed");
      setXPending(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("message", handleXMessage);
    return () => window.removeEventListener("message", handleXMessage);
  }, [handleXMessage]);

  const methods: { id: Method; label: string; icon: React.ReactNode; color: string }[] = [
    { id: "venmo",   label: "Venmo",    icon: <VenmoIcon />,   color: "hsl(210 100% 60%)" },
    { id: "cashapp", label: "Cash App", icon: <CashAppIcon />, color: "hsl(142 70% 45%)" },
    { id: "paypal",  label: "PayPal",   icon: <PayPalIcon />,  color: "hsl(214 89% 52%)" },
  ];

  const ctaLabel = method === "venmo"
    ? `Send $${finalAmount || "—"} via Venmo`
    : method === "cashapp"
    ? `Send $${finalAmount || "—"} via Cash App`
    : `Send $${finalAmount || "—"} via PayPal`;

  return (
    <>
      <style>{`
        @keyframes dm-in {
          from { opacity: 0; transform: translateX(-50%) translateY(calc(-50% + 20px)) scale(0.96); }
          to   { opacity: 1; transform: translateX(-50%) translateY(-50%) scale(1); }
        }
        .dm-panel { animation: dm-in 0.35s cubic-bezier(0.16,1,0.3,1) forwards; }
        .dm-fund-btn:hover { background: linear-gradient(135deg, hsl(195 100% 50% / 0.28), hsl(290 90% 62% / 0.2)) !important; }
        .dm-amount-btn:hover { border-color: hsl(195 100% 50% / 0.4) !important; color: hsl(195 100% 65%) !important; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
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
          maxHeight: "90vh",
          overflowY: "auto",
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

        {/* Auth gate step */}
        {showAuth && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", textAlign: "center", padding: "0.5rem 0" }}>
            <div style={{ fontFamily: "monospace", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "hsl(195 100% 55%)" }}>
              IDENTIFY BEFORE TRANSMITTING
            </div>
            <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "white", margin: 0, lineHeight: 1.3 }}>
              State your designation<br />
              <span style={{ background: "linear-gradient(90deg, hsl(195 100% 65%), hsl(290 90% 70%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                to proceed
              </span>
            </p>
            <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", fontFamily: "monospace", lineHeight: 1.6, margin: 0 }}>
              Your callsign will be logged<br />with your contribution
            </p>
            <button
              onClick={handleXSignIn}
              disabled={xPending}
              style={{
                width: "100%", padding: "0.85rem", borderRadius: 12,
                background: "linear-gradient(135deg, hsl(195 100% 50% / 0.2), hsl(290 90% 62% / 0.15))",
                border: "1px solid hsl(195 100% 50% / 0.5)",
                color: xPending ? "hsl(195 100% 65% / 0.4)" : "hsl(195 100% 70%)",
                fontFamily: "monospace", fontWeight: 700, fontSize: "0.82rem",
                letterSpacing: "0.12em", textTransform: "uppercase",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 0 20px hsl(195 100% 50% / 0.15)",
                opacity: xPending ? 0.6 : 1,
              }}
            >
              {xPending ? "AWAITING CONFIRMATION..." : <>AUTHORIZE WITH {X_LOGO}</>}
            </button>
            {xError && <p style={{ fontSize: "0.65rem", color: "hsl(0 80% 65%)", fontFamily: "monospace", margin: 0 }}>{xError}</p>}
            <button
              onClick={() => setShowAuth(false)}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}
            >
              ← back
            </button>
          </div>
        )}

        {!showAuth && <>
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
            Enjoying the{" "}
            <span style={{ background: "linear-gradient(90deg, hsl(195 100% 65%), hsl(290 90% 70%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              open channel?
            </span>
          </p>
          <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.38)", marginTop: "0.35rem", fontFamily: "monospace", lineHeight: 1.5 }}>
            This vessel runs on dilithium crystals<br />and caffeine. Help keep the shields up.
          </p>
        </div>
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
                onClick={() => setMethod(id)}
                style={{
                  display: "flex", alignItems: "center", gap: 11,
                  padding: "0.7rem 0.9rem",
                  borderRadius: 12,
                  border: method === id ? `1px solid ${color}55` : "1px solid hsl(195 100% 50% / 0.09)",
                  background: method === id ? `${color}12` : "transparent",
                  color: method === id ? color : "rgba(255,255,255,0.42)",
                  cursor: "pointer", textAlign: "left", width: "100%",
                  transition: "all 0.15s",
                  boxShadow: method === id ? `0 0 16px ${color}18` : "none",
                }}
              >
                <span style={{ opacity: method === id ? 1 : 0.6, display: "flex", alignItems: "center" }}>{icon}</span>
                <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{label}</span>

                <span style={{
                  marginLeft: "auto",
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
            ⚡ FUND THE MISSION ⚡
          </button>

        <p style={{ textAlign: "center", fontSize: "0.58rem", fontFamily: "monospace", color: "rgba(255,255,255,0.18)", letterSpacing: "0.1em", margin: 0 }}>
          Secured · Opens your payment app
        </p>
        </>}
      </div>
    </>
  );
}
