import { useEffect, useRef, useState } from "react";


function DonateTooltip() {
  return (
    <div style={{
      position: "absolute",
      top: "50%",
      left: "calc(100% + 8px)",
      transform: "translateY(-50%)",
      background: "hsl(222 60% 7%)",
      border: "1px solid hsl(290 90% 62% / 0.35)",
      borderRadius: 6,
      padding: "0.25rem 0.5rem",
      fontFamily: "monospace",
      fontSize: "0.5rem",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "hsl(290 90% 75%)",
      boxShadow: "0 0 12px hsl(290 90% 62% / 0.2)",
      pointerEvents: "none",
      lineHeight: 1.6,
      textAlign: "center",
    }}>
      <div>Fund</div>
      <div style={{ opacity: 0.65 }}>mission</div>
    </div>
  );
}

export function DonateFloat() {
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [isScrolling, setIsScrolling] = useState(false);
  const [overCard, setOverCard] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(() => !!(window as any).__xcomsModalOpen);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const open = () => setAuthModalOpen(true);
    const close = () => setAuthModalOpen(false);
    window.addEventListener("xcoms:auth-open", open);
    window.addEventListener("xcoms:auth-close", close);
    return () => {
      window.removeEventListener("xcoms:auth-open", open);
      window.removeEventListener("xcoms:auth-close", close);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);

    const checkOverCard = () => {
      // Button fixed position: left 16px, top 59vh, size ~40px
      const btnX = 16 + 20; // center x
      const btnY = window.innerHeight * 0.59; // center y
      const elements = document.elementsFromPoint(btnX, btnY);
      const hit = elements.some(el => el.closest("[data-space-card]"));
      setOverCard(hit);
    };

    const onScroll = () => {
      checkOverCard();
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

  if (authModalOpen) return null;

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
        .donate-wrapper {
          position: relative;
          display: inline-flex; align-items: center; pointer-events: auto;
        }
      `}</style>

      <div
        className="donate-wrapper"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Hover tooltip — desktop only */}
        {!isMobile && hovered && <DonateTooltip />}

        {/* Scroll-triggered tooltip — mobile only, hidden when over a space card */}
        {isMobile && isScrolling && !overCard && <DonateTooltip />}

        {/* FAB */}
        <button
          className="donate-fab"
          onClick={() => window.dispatchEvent(new Event("xcoms:donate"))}
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
