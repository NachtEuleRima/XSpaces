export function TechSupport() {
  const contacts = [
    { username: "RimaSukhadia", display: "📐_Cyber_Owl_🦉", role: "Chief Engineer — XFleet Tech Command" },
  ];

  return (
    <section
      style={{
        position: "relative",
        zIndex: 10,
        padding: "2rem 1.5rem 4rem",
        maxWidth: 480,
        margin: "0 auto",
        width: "100%",
      }}
    >
      <style>{`
        .ts-card:hover {
          border-color: rgba(0,229,245,0.6) !important;
          box-shadow: 0 0 32px rgba(0,255,255,0.35) !important;
        }
        @media (max-width: 767px) {
          .ts-card { padding: 0.65rem 0.85rem !important; gap: 0.65rem !important; border-radius: 12px !important; }
          .ts-avatar { width: 40px !important; height: 40px !important; }
          .ts-name { font-size: 0.8rem !important; }
          .ts-handle { font-size: 0.65rem !important; }
          .ts-role { font-size: 0.62rem !important; }
          .ts-hail { font-size: 0.6rem !important; }
        }
      `}</style>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "2rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>

        {/* Header */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{
            fontSize: "1.5rem",
            color: "#ea8e2a",
            textShadow: "0 0 4px #ea8e2a, 0 0 11px #ea8e2a, 0 0 19px #ea8e2a, 0 0 40px #c47020",
            animation: "neonFlickerGold 3s infinite",
          }}>⚡</span>
          <span style={{
            fontSize: "clamp(1.25rem, 4vw, 1.75rem)",
            fontWeight: 900,
            fontFamily: "monospace",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#00e5f5",
            textShadow: "0 0 4px #00e5f5, 0 0 11px #00e5f5, 0 0 19px #00e5f5, 0 0 40px #00b8c4, 0 0 80px #00b8c4, 0 3px 18px rgba(210, 140, 10, 0.55), 0 5px 40px rgba(180, 100, 0, 0.35)",
            animation: "neonFlicker 3s infinite",
          }}>
            TECH SUPPORT
          </span>
          <span style={{
            fontSize: "1.5rem",
            color: "#ea8e2a",
            textShadow: "0 0 4px #ea8e2a, 0 0 11px #ea8e2a, 0 0 19px #ea8e2a, 0 0 40px #c47020",
            animation: "neonFlickerGold 3s infinite",
          }}>⚡</span>
        </div>

        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
          Experiencing a system anomaly? Open a channel.
        </p>

        {/* Contact cards */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {contacts.map(({ username, display, role }) => (
            <a
              key={username}
              href="#"
              className="ts-card"
              onClick={(e) => {
                e.preventDefault();
                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                if (isMobile) { window.location.href = `twitter://user?screen_name=${username}`; }
                else { window.open(`https://x.com/${username}`, "_blank", "noopener,noreferrer"); }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1.25rem",
                borderRadius: 16,
                border: "1px solid rgba(0,229,245,0.3)",
                boxShadow: "0 0 18px rgba(0,255,255,0.15)",
                background: "#0d1117",
                textDecoration: "none",
                transition: "all 0.3s",
              }}
            >
              {/* Avatar */}
              <div className="ts-avatar" style={{
                width: 56, height: 56, borderRadius: "50%",
                border: "2px solid rgba(0,229,245,0.5)",
                boxShadow: "0 0 12px rgba(0,229,245,0.4)",
                overflow: "hidden",
                position: "relative",
                flexShrink: 0,
                background: "rgba(255,255,255,0.05)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <img
                  src={`https://unavatar.io/twitter/${username}`}
                  alt={username}
                  style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    (e.currentTarget.nextSibling as HTMLElement).style.display = "block";
                  }}
                />
                <svg viewBox="0 0 24 24" style={{ display: "none", width: 24, height: 24, fill: "rgba(255,255,255,0.3)" }} aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>

              {/* Text */}
              <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0, textAlign: "left" }}>
                <p className="ts-name" style={{ fontWeight: 700, color: "white", fontSize: "1rem", lineHeight: 1.2 }}>{display}</p>
                <p className="ts-handle" style={{ color: "#00e5f5", fontFamily: "monospace", fontSize: "0.75rem" }}>@{username}</p>
                <p className="ts-role" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", marginTop: 2 }}>{role}</p>
              </div>

              {/* Arrow */}
              <span className="ts-hail" style={{ color: "rgba(0,229,245,0.6)", fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.05em", fontSize: "0.7rem", marginLeft: "auto", flexShrink: 0, textAlign: "right" }}>
                Hail on X →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
