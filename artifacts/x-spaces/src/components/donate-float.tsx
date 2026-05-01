import { useEffect, useRef, useState } from "react";

const VENMO_URL = "https://venmo.com/u/Rima-Sukhadia";

export function DonateFloat() {
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);

    const onScroll = () => {
      setIsScrolling(true);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => setIsScrolling(false), 800);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      mq.removeEventListener("change", onChange);
      window.removeEventListener("scroll", onScroll);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, []);

  const size = isMobile ? 40 : 52;
  const fontSize = isMobile ? 18 : 24;

  return (
    <>
      <style>{`
        @keyframes donate-float {
          0%, 100% { transform: translateY(0px) rotate(-4deg); }
          50%       { transform: translateY(-8px) rotate(4deg); }
        }
        @keyframes heart-ping {
          0%   { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .donate-fab {
          animation: donate-float 3.5s ease-in-out infinite;
        }
        .donate-fab:hover {
          filter: drop-shadow(0 0 18px hsl(290 90% 62% / 0.9)) !important;
        }
        .heart-ping {
          animation: heart-ping 1.4s ease-out infinite;
        }
      `}</style>

      {/* Outer wrapper — caller controls fixed/sticky placement via a parent */}
      <div
        style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Hover tooltip — desktop only */}
        {!isMobile && hovered && (
          <div style={{
            position: "absolute",
            top: "50%",
            right: "calc(100% + 10px)",
            transform: "translateY(-50%)",
            whiteSpace: "nowrap",
            background: "hsl(222 60% 7%)",
            border: "1px solid hsl(290 90% 62% / 0.35)",
            borderRadius: 8,
            padding: "0.35rem 0.75rem",
            fontFamily: "monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "hsl(290 90% 75%)",
            boxShadow: "0 0 16px hsl(290 90% 62% / 0.2)",
            pointerEvents: "none",
          }}>
            Fund the mission
          </div>
        )}

        {/* Scroll-triggered tooltip — mobile only */}
        {isMobile && isScrolling && (
          <div style={{
            position: "absolute",
            top: "50%",
            right: "calc(100% + 10px)",
            transform: "translateY(-50%)",
            whiteSpace: "nowrap",
            background: "hsl(222 60% 7%)",
            border: "1px solid hsl(290 90% 62% / 0.35)",
            borderRadius: 8,
            padding: "0.35rem 0.75rem",
            fontFamily: "monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "hsl(290 90% 75%)",
            boxShadow: "0 0 16px hsl(290 90% 62% / 0.2)",
            pointerEvents: "none",
          }}>
            Fund the mission
          </div>
        )}

        {/* FAB */}
        <button
          className="donate-fab"
          onClick={() => window.open(VENMO_URL, "_blank", "noopener,noreferrer")}
          aria-label="Support — Fund the mission on Venmo"
          style={{
            position: "relative",
            width: size,
            height: size,
            borderRadius: "50%",
            border: "1px solid hsl(290 90% 62% / 0.45)",
            background: "linear-gradient(135deg, hsl(222 60% 9%), hsl(290 90% 10%))",
            boxShadow: "0 0 22px hsl(290 90% 62% / 0.3), inset 0 0 12px hsl(290 90% 62% / 0.05)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize,
            filter: "drop-shadow(0 0 10px hsl(290 90% 62% / 0.5))",
            transition: "filter 0.2s",
          }}
        >
          🖖
          <span style={{
            position: "absolute",
            top: 2,
            right: 2,
            width: 14,
            height: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span
              className="heart-ping"
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "hsl(290 90% 62% / 0.35)",
              }}
            />
            <span style={{ fontSize: 9, lineHeight: 1, position: "relative", zIndex: 1 }}>💜</span>
          </span>
        </button>
      </div>
    </>
  );
}
