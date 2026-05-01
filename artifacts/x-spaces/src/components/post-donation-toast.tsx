import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function PostDonationToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && sessionStorage.getItem("xcoms_payment_pending")) {
        sessionStorage.removeItem("xcoms_payment_pending");
        setVisible(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          style={{
            position: "fixed",
            bottom: "5rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 200,
            pointerEvents: "none",
          }}
        >
          <style>{`
            @keyframes xcoms-heartbeat {
              0%, 100% { transform: scale(1); }
              14% { transform: scale(1.18); }
              28% { transform: scale(1); }
              42% { transform: scale(1.12); }
              56% { transform: scale(1); }
            }
            .xcoms-spock { animation: xcoms-heartbeat 1.6s ease-in-out infinite; display: inline-block; }
          `}</style>
          <div
            style={{
              background: "linear-gradient(135deg, hsl(222 55% 8%), hsl(222 50% 6%))",
              border: "1px solid hsl(195 100% 50% / 0.35)",
              borderRadius: 20,
              padding: "1rem 1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              boxShadow: "0 0 0 1px hsl(195 100% 50% / 0.08), 0 8px 40px hsl(195 100% 50% / 0.18), 0 0 80px hsl(290 90% 62% / 0.1)",
              whiteSpace: "nowrap",
            }}
          >
            {/* Top beam */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 1,
              borderRadius: "20px 20px 0 0",
              background: "linear-gradient(to right, transparent, hsl(195 100% 50% / 0.8), hsl(290 90% 62% / 0.5), transparent)",
            }} />

            <span className="xcoms-spock" style={{ fontSize: "1.6rem", lineHeight: 1 }}>🖖</span>

            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{
                fontFamily: "monospace", fontWeight: 800, fontSize: "0.78rem",
                letterSpacing: "0.08em", textTransform: "uppercase",
                background: "linear-gradient(90deg, hsl(195 100% 65%), hsl(290 90% 70%))",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                Live long and prosper
              </span>
              <span style={{
                fontFamily: "monospace", fontSize: "0.62rem",
                color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em",
              }}>
                May your spaces always be live 🚀
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
