import { useState } from "react";

const AMOUNTS = [3, 5, 10, 25];

const VENMO_URL = "https://venmo.com/u/Rima-Sukhadia";

function VenmoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 22, height: 22 }}>
      <path d="M19.09 1.01C19.7 2.04 19.97 3.1 19.97 4.44c0 4.27-3.65 9.82-6.61 13.72H6.74L4.03 2.14l6.1-.58 1.35 10.85c1.27-2.1 2.83-5.4 2.83-7.65 0-1.23-.21-2.07-.55-2.76l5.33-.99z"/>
    </svg>
  );
}

function ApplePayIcon() {
  return (
    <svg viewBox="0 0 50 20" fill="currentColor" style={{ width: 44, height: 18 }}>
      <path d="M9.7 2.9c-.5.6-1.3 1.1-2.1 1-.1-.8.3-1.7.8-2.2.5-.6 1.4-1.1 2.1-1.1.1.9-.2 1.7-.8 2.3zm.8 1.3c-1.2-.1-2.2.7-2.8.7-.6 0-1.5-.6-2.4-.6-1.2 0-2.4.7-3 1.8-1.3 2.2-.3 5.5.9 7.3.6.9 1.3 1.8 2.2 1.8.9 0 1.2-.6 2.3-.6 1.1 0 1.4.6 2.3.6.9 0 1.5-.9 2.1-1.8.7-1 1-2 1-2s-1.9-.7-1.9-2.8c0-1.8 1.5-2.6 1.5-2.6s-.8-1.8-2.2-1.8zm7.9-3h3.2l-4.2 11.5H15l-1-3H10.9l-1 3H7.8L12 1.2h2.4l.7 2h2zm-.5 6.2l-1.3-3.7-1.3 3.7h2.6zm10.5-5.6c.7.7 1.1 1.7 1.1 2.9 0 1.3-.4 2.3-1.1 3-.7.7-1.6 1.1-2.8 1.1H24v4h-2V1.2h3.7c1.2 0 2.1.4 2.8 1.1zm-1.5 4.4c.4-.4.6-1 .6-1.7 0-.7-.2-1.2-.6-1.6-.4-.4-.9-.6-1.5-.6H24v4.5h1.4c.7 0 1.2-.2 1.5-.6zM38 7.3c.5.6.8 1.5.8 2.6v5.4h-1.9v-1.2c-.6.9-1.5 1.4-2.7 1.4-.9 0-1.6-.3-2.2-.8-.5-.5-.8-1.2-.8-2 0-.9.3-1.6 1-2.1.7-.5 1.6-.7 2.8-.7h1.8v-.1c0-.6-.2-1.1-.5-1.4-.3-.3-.8-.5-1.5-.5-.5 0-.9.1-1.4.3-.4.2-.8.4-1.1.7l-.8-1.5c.5-.4 1-.7 1.7-.9.6-.2 1.3-.3 2-.3 1.3 0 2.3.4 2.8 1.1zm-1.2 5.7v-1H35c-.6 0-1.1.1-1.4.4-.3.2-.5.6-.5 1 0 .4.1.7.4.9.3.2.6.3 1.1.3.6 0 1.1-.2 1.5-.5.4-.3.6-.7.7-1.1zm7.8-6.2L42.1 13l-2.4-6.2h-2.1l3.5 8.4-.2.5c-.2.5-.4.9-.7 1.1-.3.2-.6.3-1.1.3-.3 0-.5 0-.8-.1l-.3 1.7c.4.1.8.2 1.3.2.8 0 1.5-.2 2-.7.5-.4 1-1.1 1.4-2L46.7 6.8H44.6z"/>
    </svg>
  );
}

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 22, height: 22 }}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

export function DonationModal() {
  const [amount, setAmount] = useState(5);
  const [custom, setCustom] = useState("");
  const [method, setMethod] = useState<"venmo" | "apple" | "card">("venmo");

  const finalAmount = custom ? parseFloat(custom) || 0 : amount;

  const handleFund = () => {
    if (method === "venmo") {
      const note = encodeURIComponent("Fund the Mission ⚡ XCOMS.Space");
      window.open(`${VENMO_URL}?txn=pay&amount=${finalAmount}&note=${note}`, "_blank");
    } else if (method === "apple") {
      alert("Apple Pay requires merchant setup — coming soon!");
    } else {
      alert("Card payments coming soon!");
    }
  };

  const isApple = /iPhone|iPad|iPod|Mac/i.test(navigator.userAgent);

  return (
    <div style={{
      minHeight: "100vh",
      background: "hsl(222 47% 4%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      fontFamily: "'SF Pro Display', 'Inter', system-ui, sans-serif",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 420,
        background: "linear-gradient(160deg, hsl(222 55% 8%) 0%, hsl(222 50% 6%) 100%)",
        border: "1px solid hsl(195 100% 50% / 0.15)",
        borderRadius: 20,
        padding: "2rem 1.75rem 1.75rem",
        boxShadow: "0 0 80px hsl(195 100% 50% / 0.07), 0 32px 64px rgba(0,0,0,0.6)",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}>

        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontFamily: "monospace", fontSize: "0.55rem", letterSpacing: "0.3em",
            textTransform: "uppercase", color: "hsl(195 100% 55%)",
            border: "1px solid hsl(195 100% 50% / 0.25)",
            borderRadius: 99, padding: "0.28rem 0.75rem",
            marginBottom: "0.9rem",
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "hsl(195 100% 55%)", boxShadow: "0 0 6px hsl(195 100% 55%)" }} />
            XFLEET OPERATIONS
          </div>
          <p style={{ fontSize: "1.4rem", fontWeight: 800, color: "white", letterSpacing: "-0.02em", margin: 0, lineHeight: 1.2 }}>
            Fund the Mission
          </p>
          <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", marginTop: "0.4rem", fontFamily: "monospace", lineHeight: 1.5 }}>
            Keep the open channel alive
          </p>
        </div>

        {/* Amount picker */}
        <div>
          <p style={{ fontSize: "0.6rem", fontFamily: "monospace", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.6rem" }}>
            Select amount
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 8 }}>
            {AMOUNTS.map(a => (
              <button
                key={a}
                onClick={() => { setAmount(a); setCustom(""); }}
                style={{
                  padding: "0.6rem 0",
                  borderRadius: 10,
                  border: `1px solid ${!custom && amount === a ? "hsl(195 100% 50% / 0.6)" : "hsl(195 100% 50% / 0.12)"}`,
                  background: !custom && amount === a ? "hsl(195 100% 50% / 0.12)" : "transparent",
                  color: !custom && amount === a ? "hsl(195 100% 65%)" : "rgba(255,255,255,0.45)",
                  fontWeight: 700, fontSize: "0.95rem", cursor: "pointer",
                  transition: "all 0.15s",
                  boxShadow: !custom && amount === a ? "0 0 16px hsl(195 100% 50% / 0.2)" : "none",
                }}
              >
                ${a}
              </button>
            ))}
          </div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", fontSize: "0.9rem", fontWeight: 600 }}>$</span>
            <input
              type="number"
              placeholder="Custom amount"
              value={custom}
              onChange={e => setCustom(e.target.value)}
              onFocus={() => setAmount(0)}
              style={{
                width: "100%",
                padding: "0.65rem 0.75rem 0.65rem 1.75rem",
                borderRadius: 10,
                border: `1px solid ${custom ? "hsl(195 100% 50% / 0.4)" : "hsl(195 100% 50% / 0.1)"}`,
                background: "hsl(222 40% 9%)",
                color: "white", fontSize: "0.9rem",
                outline: "none", boxSizing: "border-box",
                fontFamily: "inherit",
                transition: "border 0.15s",
              }}
            />
          </div>
        </div>

        {/* Payment method */}
        <div>
          <p style={{ fontSize: "0.6rem", fontFamily: "monospace", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.6rem" }}>
            Pay with
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { id: "venmo", label: "Venmo", icon: <VenmoIcon />, color: "hsl(210 100% 60%)" },
              ...(isApple ? [{ id: "apple", label: "Apple Pay", icon: <ApplePayIcon />, color: "white" }] : []),
              { id: "card", label: "Credit / Debit Card", icon: <CardIcon />, color: "hsl(290 90% 70%)" },
            ].map(({ id, label, icon, color }) => (
              <button
                key={id}
                onClick={() => setMethod(id as typeof method)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "0.75rem 1rem",
                  borderRadius: 12,
                  border: method === id ? `1px solid ${color}55` : "1px solid hsl(195 100% 50% / 0.1)",
                  background: method === id ? `${color}12` : "transparent",
                  color: method === id ? color : "rgba(255,255,255,0.45)",
                  cursor: "pointer", textAlign: "left", width: "100%",
                  transition: "all 0.15s",
                  boxShadow: method === id ? `0 0 18px ${color}20` : "none",
                }}
              >
                <span style={{ opacity: method === id ? 1 : 0.5, display: "flex" }}>{icon}</span>
                <span style={{ fontWeight: 600, fontSize: "0.88rem" }}>{label}</span>
                <span style={{
                  marginLeft: "auto", width: 16, height: 16, borderRadius: "50%",
                  border: method === id ? `5px solid ${color}` : "2px solid rgba(255,255,255,0.2)",
                  background: "transparent", flexShrink: 0,
                  transition: "all 0.15s",
                }} />
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleFund}
          style={{
            width: "100%", padding: "0.9rem",
            borderRadius: 12,
            border: "1px solid hsl(195 100% 50% / 0.4)",
            background: "linear-gradient(135deg, hsl(195 100% 50% / 0.18), hsl(290 90% 62% / 0.12))",
            color: "hsl(195 100% 70%)",
            fontFamily: "monospace", fontWeight: 700, fontSize: "0.85rem",
            letterSpacing: "0.15em", textTransform: "uppercase",
            cursor: "pointer",
            boxShadow: "0 0 24px hsl(195 100% 50% / 0.18)",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, hsl(195 100% 50% / 0.28), hsl(290 90% 62% / 0.2))"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, hsl(195 100% 50% / 0.18), hsl(290 90% 62% / 0.12))"; }}
        >
          ⚡ Send ${finalAmount || "—"} via {method === "venmo" ? "Venmo" : method === "apple" ? "Apple Pay" : "Card"}
        </button>

        <p style={{ textAlign: "center", fontSize: "0.6rem", fontFamily: "monospace", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>
          Secured · No account needed for Venmo link
        </p>
      </div>
    </div>
  );
}
