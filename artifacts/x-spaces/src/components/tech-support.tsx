import { motion } from "framer-motion";
import React from "react";

const openContact = (handle: string) => (e: React.MouseEvent) => {
  e.preventDefault();
  window.open(`https://x.com/messages/compose?recipient_id=${handle}`, "_blank", "noopener,noreferrer");
};

const contacts = [
  {
    username: "RimaSukhadia",
    display: "📐_Cyber_Owl_🦉",
    role: "Website & technical inquiries",
  },
  {
    username: "koby_pierce",
    display: "Koby Pierce",
    role: "NAS gift inquiries",
  },
];

export function TechSupport() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={{
        position: "relative",
        zIndex: 10,
        padding: "0 1.5rem 4rem",
        maxWidth: 560,
        margin: "0 auto",
        width: "100%",
      }}
    >
      <style>{`
        @keyframes neonFlickerGold {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            opacity: 1;
            text-shadow: 0 0 8px #ea8e2a, 0 0 20px #ea8e2a, 0 0 40px #ea8e2a;
          }
          20%, 24%, 55% {
            opacity: 0.4;
            text-shadow: none;
          }
        }
        .ts2-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem 1rem;
          border-radius: 24px;
          background: hsl(222 60% 6%);
          border: 1px solid rgba(0,229,245,0.2);
          text-decoration: none;
          transition: border-color 0.3s, box-shadow 0.3s;
          cursor: pointer;
        }
        .ts2-card:hover {
          border-color: rgba(234,142,42,0.5);
          box-shadow: 0 0 24px rgba(234,142,42,0.15);
        }
        .ts2-card:hover .ts2-cta {
          color: #ea8e2a;
        }
        .ts2-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          border: 2px solid rgba(0,229,245,0.35);
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: border-color 0.3s;
        }
        .ts2-card:hover .ts2-avatar {
          border-color: rgba(234,142,42,0.5);
        }
        .ts2-cta {
          font-size: 0.7rem;
          font-family: monospace;
          color: rgba(0,229,245,0.5);
          letter-spacing: 0.05em;
          transition: color 0.3s;
        }
        @media (max-width: 767px) {
          .ts2-avatar { width: 48px; height: 48px; }
        }
      `}</style>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "2rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "clamp(1.25rem, 4vw, 1.75rem)",
              fontWeight: 900,
              fontFamily: "monospace",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#ea8e2a",
              animation: "neonFlickerGold 3s infinite",
            }}
          >
            ⚡ TECH SUPPORT ⚡
          </span>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem", marginTop: "0.5rem" }}>
            Have a question? Reach out below.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
          {contacts.map(({ username, display, role }) => (
            <a
              key={username}
              href="#"
              className="ts2-card"
              onClick={openContact(username)}
            >
              <div className="ts2-avatar">
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
              <div style={{ textAlign: "center" }}>
                <p style={{ fontWeight: 700, color: "white", fontSize: "0.95rem", lineHeight: 1.3 }}>{display}</p>
                <p style={{ color: "#00e5f5", fontFamily: "monospace", fontSize: "0.72rem", marginTop: "0.2rem" }}>@{username}</p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", marginTop: "0.4rem" }}>{role}</p>
              </div>
              <span className="ts2-cta">Message on X →</span>
            </a>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
