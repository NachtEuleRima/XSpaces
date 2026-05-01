const CYAN = "hsl(195 100% 50%)";
const PURPLE = "hsl(290 90% 62%)";

function SupportCard({
  icon, title, lines, href, cta, color,
}: {
  icon: string;
  title: string;
  lines: string[];
  href?: string;
  cta?: string;
  color: string;
}) {
  return (
    <div
      style={{
        border: `1px solid ${color}25`,
        borderRadius: 16,
        padding: "1.75rem",
        background: `linear-gradient(135deg, ${color}06 0%, transparent 60%)`,
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      <div style={{ fontSize: 28 }}>{icon}</div>
      <div
        style={{
          fontFamily: "monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color,
          textShadow: `0 0 10px ${color}80`,
          fontWeight: 700,
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        {lines.map((line, i) => (
          <p key={i} style={{ fontSize: "0.78rem", color: "hsl(195 15% 70%)", lineHeight: 1.5 }}>
            {line}
          </p>
        ))}
      </div>
      {href && cta && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginTop: "0.5rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            fontFamily: "monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color,
            textDecoration: "none",
            border: `1px solid ${color}30`,
            borderRadius: 6,
            padding: "0.4rem 0.75rem",
            background: `${color}08`,
            width: "fit-content",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = `${color}18`;
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 0 14px ${color}30`;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = `${color}08`;
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
          }}
        >
          ◀ {cta} ▶
        </a>
      )}
    </div>
  );
}

export function TechSupport() {
  return (
    <section style={{ position: "relative", zIndex: 10, padding: "6rem 1.5rem 5rem" }}>

      {/* Section divider */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "3.5rem" }}>
        <div style={{ height: 1, flex: 1, background: `linear-gradient(to right, transparent, ${CYAN}40)` }} />
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span
            style={{
              width: 8, height: 8, borderRadius: "50%",
              background: CYAN, boxShadow: `0 0 10px ${CYAN}`,
            }}
          />
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: CYAN,
            }}
          >
            STARFLEET TECHNICAL SUPPORT
          </span>
        </div>
        <div style={{ height: 1, flex: 1, background: `linear-gradient(to left, transparent, ${CYAN}40)` }} />
      </div>

      {/* Tagline */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <p
          style={{
            fontFamily: "monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "hsl(195 15% 55%)",
          }}
        >
          All channels monitored. Hailing frequencies open.
        </p>
      </div>

      {/* Cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.25rem",
          maxWidth: 960,
          margin: "0 auto",
        }}
      >
        <SupportCard
          icon="📡"
          color={CYAN}
          title="Mission Control"
          lines={[
            "XCOMS.Space is an independent Star Trek–themed tracker for X Spaces.",
            "Built and operated by @RimaSukhadia.",
          ]}
          href="https://x.com/RimaSukhadia"
          cta="Hail the Commander"
        />
        <SupportCard
          icon="⚠️"
          color={PURPLE}
          title="Report a Malfunction"
          lines={[
            "Missing space? Wrong data? Anomaly detected in sector 7?",
            "Send a direct transmission and we'll investigate.",
          ]}
          href="https://x.com/RimaSukhadia"
          cta="Send Distress Signal"
        />
        <SupportCard
          icon="🛸"
          color={CYAN}
          title="How It Works"
          lines={[
            "We monitor X Spaces from accounts you follow in real-time.",
            "Log in with your handle to personalize YOUR QUADRANT.",
            "Data refreshes every 30 seconds.",
          ]}
        />
        <SupportCard
          icon="🔒"
          color={PURPLE}
          title="Privacy Protocols"
          lines={[
            "We only read public X Space data and public following lists.",
            "Your handle is stored locally on your device only.",
            "No accounts, no tracking, no tribbles.",
          ]}
        />
      </div>

      {/* Bottom signature */}
      <div style={{ textAlign: "center", marginTop: "4rem" }}>
        <p
          style={{
            fontFamily: "monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "hsl(195 15% 30%)",
          }}
        >
          XCOMS.Space — Stardate {new Date().getFullYear()}.{String(Math.floor((Date.now() / 86400000) % 365)).padStart(3, "0")} — Built with ♥ for the X Spaces community
        </p>
      </div>
    </section>
  );
}
