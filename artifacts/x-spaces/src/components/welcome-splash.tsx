import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUsername } from "@/hooks/use-username";

const X_LOGO = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface WelcomeSplashProps {
  onDone: () => void;
}

export function WelcomeSplash({ onDone }: WelcomeSplashProps) {
  const { saveUsername, isPending } = useUsername();
  const [val, setVal] = useState("");
  const [xPending, setXPending] = useState(false);
  const [xError, setXError] = useState<string | null>(null);
  const [exiting, setExiting] = useState(false);
  const popupRef = useRef<Window | null>(null);

  const finish = useCallback((openPending = false) => {
    setExiting(true);
    setTimeout(() => {
      onDone();
      if (openPending) {
        const pending = localStorage.getItem("xcoms_pending_url");
        if (pending) {
          localStorage.removeItem("xcoms_pending_url");
          window.open(pending, "_blank");
        }
      }
    }, 600);
  }, [onDone]);

  const handleXMessage = useCallback(async (e: MessageEvent) => {
    if (e.data?.type === "x-auth-success" && e.data.username) {
      setXPending(true);
      setXError(null);
      localStorage.setItem("xcoms_auth_method", "x");
      await saveUsername(e.data.username);
      finish(true);
    } else if (e.data?.type === "x-auth-error") {
      setXError(e.data.error ?? "Sign-in failed — please try again");
      setXPending(false);
    }
  }, [saveUsername, finish]);

  useEffect(() => {
    window.addEventListener("message", handleXMessage);
    return () => window.removeEventListener("message", handleXMessage);
  }, [handleXMessage]);

  // Handle redirect-mode return: ?xcoms_user=USERNAME or ?xcoms_auth_error=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirectUser = params.get("xcoms_user");
    const redirectError = params.get("xcoms_auth_error");
    if (redirectUser) {
      // Clean the URL first
      window.history.replaceState({}, "", window.location.pathname);
      setXPending(true);
      localStorage.setItem("xcoms_auth_method", "x");
      saveUsername(redirectUser).then(() => finish(true));
    } else if (redirectError) {
      window.history.replaceState({}, "", window.location.pathname);
      setXError(redirectError);
    }
  }, [saveUsername, finish]);

  const isMobile = () => /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 768;

  const handleXSignIn = () => {
    setXError(null);
    if (isMobile()) {
      window.location.href = "/api/auth/x/login?mode=redirect";
      return;
    }
    const w = 600, h = 700;
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top = window.screenY + (window.outerHeight - h) / 2;
    const popup = window.open("/api/auth/x/login", "x-oauth", `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes`);
    if (!popup) {
      setXError("Popup blocked — please allow popups and try again");
      return;
    }
    popupRef.current = popup;
    setXPending(true);
    const poll = setInterval(() => {
      if (popup.closed) { clearInterval(poll); setXPending(false); }
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!val.trim()) return;
    localStorage.setItem("xcoms_auth_method", "manual");
    const ok = await saveUsername(val.trim().replace(/^@/, ""));
    if (ok) finish();
  };

  const [authMode, setAuthMode] = useState<"x" | "callsign" | null>(null);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: "min(420px, calc(100vw - 24px))",
              background: "linear-gradient(160deg, hsl(222 55% 8%) 0%, hsl(222 50% 6%) 100%)",
              border: "1px solid hsl(195 100% 50% / 0.15)",
              borderRadius: 20,
              padding: "1.75rem 1.5rem 1.5rem",
              boxShadow: "0 0 80px hsl(195 100% 50% / 0.07), 0 32px 64px rgba(0,0,0,0.6)",
              display: "flex", flexDirection: "column", gap: "1.25rem",
            }}
          >
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
                XFLEET COMMAND
              </div>
              <div style={{ lineHeight: 1.1, marginBottom: "0.35rem" }}>
                <p style={{ fontSize: "2rem", fontWeight: 900, color: "hsl(195 100% 60%)", margin: 0, letterSpacing: "-0.03em", textShadow: "0 0 30px hsl(195 100% 50% / 0.5)" }}>X</p>
                <p style={{ fontSize: "1.3rem", fontWeight: 800, color: "white", margin: 0, letterSpacing: "-0.02em" }}>Spaces</p>
              </div>
              <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)", fontFamily: "monospace", letterSpacing: "0.08em", margin: 0 }}>
                Identify yourself to XFleet Command
              </p>
            </div>

            {/* Auth options */}
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {/* Sign in with X */}
              <button
                type="button"
                onClick={() => { setAuthMode("x"); handleXSignIn(); }}
                disabled={xPending || isPending}
                style={{
                  display: "flex", alignItems: "center", gap: 11,
                  padding: "0.7rem 0.9rem",
                  borderRadius: 12,
                  border: authMode === "x" ? "1px solid rgba(255,255,255,0.35)" : "1px solid hsl(195 100% 50% / 0.09)",
                  background: authMode === "x" ? "rgba(255,255,255,0.08)" : "transparent",
                  color: authMode === "x" ? "white" : "rgba(255,255,255,0.42)",
                  cursor: "pointer", textAlign: "left", width: "100%",
                  transition: "all 0.15s",
                  opacity: (isPending && authMode !== "x") ? 0.5 : 1,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", opacity: authMode === "x" ? 1 : 0.6 }}>{X_LOGO}</span>
                <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>
                  {xPending ? "Awaiting Authorization…" : "Sign in with X"}
                </span>
                <span style={{
                  marginLeft: "auto",
                  width: 15, height: 15, borderRadius: "50%",
                  border: authMode === "x" ? "5px solid white" : "2px solid rgba(255,255,255,0.2)",
                  flexShrink: 0, transition: "all 0.15s",
                }} />
              </button>

              {/* Enter callsign */}
              <button
                type="button"
                onClick={() => setAuthMode("callsign")}
                disabled={xPending}
                style={{
                  display: "flex", alignItems: "center", gap: 11,
                  padding: "0.7rem 0.9rem",
                  borderRadius: 12,
                  border: authMode === "callsign" ? "1px solid hsl(195 100% 50% / 0.55)" : "1px solid hsl(195 100% 50% / 0.09)",
                  background: authMode === "callsign" ? "hsl(195 100% 50% / 0.08)" : "transparent",
                  color: authMode === "callsign" ? "hsl(195 100% 65%)" : "rgba(255,255,255,0.42)",
                  cursor: "pointer", textAlign: "left", width: "100%",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", opacity: authMode === "callsign" ? 1 : 0.6, fontSize: 18 }}>@</span>
                <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>Enter callsign manually</span>
                <span style={{
                  marginLeft: "auto",
                  width: 15, height: 15, borderRadius: "50%",
                  border: authMode === "callsign" ? "5px solid hsl(195 100% 55%)" : "2px solid rgba(255,255,255,0.2)",
                  flexShrink: 0, transition: "all 0.15s",
                }} />
              </button>
            </div>

            {/* Callsign input — expands when selected */}
            <AnimatePresence>
              {authMode === "callsign" && (
                <motion.form
                  key="callsign-form"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: 8, overflow: "hidden" }}
                >
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontFamily: "monospace", fontWeight: 700, fontSize: "1rem", color: "hsl(195 100% 50%)" }}>@</span>
                    <input
                      autoFocus
                      style={{
                        width: "100%", boxSizing: "border-box",
                        padding: "0.65rem 0.85rem 0.65rem 2rem",
                        borderRadius: 10,
                        border: "1px solid hsl(195 100% 50% / 0.3)",
                        background: "hsl(222 40% 9%)",
                        color: "hsl(195 100% 70%)", fontSize: "0.9rem", outline: "none",
                        fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase",
                      }}
                      placeholder="YOUR CALLSIGN"
                      value={val}
                      onChange={e => setVal(e.target.value)}
                      onFocus={e => { (e.target as HTMLInputElement).style.borderColor = "hsl(195 100% 50% / 0.6)"; }}
                      onBlur={e => { (e.target as HTMLInputElement).style.borderColor = "hsl(195 100% 50% / 0.3)"; }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!val.trim() || isPending}
                    style={{
                      width: "100%", padding: "0.75rem",
                      borderRadius: 10,
                      border: "1px solid hsl(195 100% 50% / 0.4)",
                      background: "linear-gradient(135deg, hsl(195 100% 50% / 0.18), hsl(290 90% 62% / 0.12))",
                      color: "hsl(195 100% 70%)",
                      fontFamily: "monospace", fontWeight: 700, fontSize: "0.78rem",
                      letterSpacing: "0.15em", textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    ⚡ {isPending ? "Transmitting..." : "Open Channel"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {xError && (
              <p style={{ textAlign: "center", fontSize: "0.65rem", fontFamily: "monospace", color: "hsl(0 80% 65%)", margin: 0 }}>{xError}</p>
            )}

            {/* Skip */}
            <button
              type="button"
              onClick={() => { localStorage.setItem("xcoms_auth_method", "skip"); finish(); }}
              style={{
                background: "none", border: "none", cursor: "pointer",
                textAlign: "center", fontSize: "0.58rem", fontFamily: "monospace",
                color: "rgba(255,255,255,0.18)", letterSpacing: "0.15em", textTransform: "uppercase",
                transition: "color 0.15s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.35)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.18)"; }}
            >
              Skip — browse without personalization
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
