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

interface XUser {
  id: string;
  username: string;
  name: string;
  avatar: string | null;
}

export function WelcomeSplash({ onDone }: WelcomeSplashProps) {
  const { saveUsername, isPending } = useUsername();
  const [val, setVal] = useState("");
  const [xPending, setXPending] = useState(false);
  const [xError, setXError] = useState<string | null>(null);
  const [exiting, setExiting] = useState(false);
  const [suggestion, setSuggestion] = useState<XUser | null>(null);
  const [searching, setSearching] = useState(false);
  const popupRef = useRef<Window | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);


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

  useEffect(() => {
    const q = val.trim().replace(/^@/, "");
    if (q.length < 2) { setSuggestion(null); setSearching(false); return; }
    setSearching(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const r = await fetch(`/api/users/search?q=${encodeURIComponent(q)}`);
        const data = await r.json() as { user: XUser | null };
        setSuggestion(data.user);
      } catch { setSuggestion(null); }
      setSearching(false);
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [val]);

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

  const acceptSuggestion = useCallback(async (user: XUser) => {
    setVal(user.username);
    setSuggestion(null);
    localStorage.setItem("xcoms_auth_method", "manual");
    await saveUsername(user.username);
    finish();
  }, [saveUsername, finish]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestion) { acceptSuggestion(suggestion); return; }
    if (!val.trim()) return;
    localStorage.setItem("xcoms_auth_method", "manual");
    const ok = await saveUsername(val.trim().replace(/^@/, ""));
    if (ok) finish();
  };

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "hsl(222 47% 4%)" }}
        >
          {/* Ambient glows */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full opacity-10"
              style={{ background: "radial-gradient(ellipse, hsl(195 100% 50%), transparent 70%)" }} />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] rounded-full opacity-8"
              style={{ background: "radial-gradient(ellipse, hsl(290 90% 62%), transparent 70%)" }} />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative w-full max-w-md"
            style={{
              background: "hsl(222 47% 6%)",
              border: "1px solid hsl(195 100% 50% / 0.35)",
              borderRadius: "1.25rem",
              boxShadow: "0 0 0 1px hsl(195 100% 50% / 0.08), 0 30px 100px hsl(195 100% 50% / 0.12), 0 0 160px hsl(290 90% 62% / 0.08)",
            }}
          >
            {/* Top beam */}
            <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-[1.25rem]"
              style={{ background: "linear-gradient(to right, transparent, hsl(195 100% 50% / 0.9), hsl(290 90% 62% / 0.6), transparent)" }} />

            <div className="p-8 flex flex-col items-center gap-6">
              {/* Branding */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex flex-col items-center leading-none font-black uppercase">
                  <span className="text-5xl tracking-tight" style={{ color: "hsl(195 100% 55%)", textShadow: "0 0 40px hsl(195 100% 50% / 0.5)" }}>
                    X
                  </span>
                  <span className="text-3xl tracking-tight" style={{ color: "hsl(290 90% 62%)", textShadow: "0 0 30px hsl(290 90% 62% / 0.5)" }}>
                    Spaces
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px" style={{ background: "linear-gradient(to right, transparent, hsl(195 100% 50% / 0.2), transparent)" }} />

              {/* Identity prompt */}
              <div className="text-center">
                <h2 className="text-xl font-black uppercase tracking-[0.15em] mb-1" style={{ color: "hsl(195 100% 65%)" }}>
                  State Your Designation
                </h2>
                <p className="text-sm font-mono text-foreground/50 leading-relaxed">
                  Identify yourself to personalize your quadrant.
                </p>
              </div>

              {/* Sign in with X */}
              <button
                type="button"
                onClick={handleXSignIn}
                disabled={xPending || isPending}
                className="w-full h-12 rounded-lg font-black tracking-[0.12em] uppercase text-sm transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, hsl(195 100% 50% / 0.2), hsl(290 90% 62% / 0.15))",
                  color: (xPending || isPending) ? "hsl(195 100% 65% / 0.5)" : "hsl(195 100% 65%)",
                  border: "1px solid hsl(195 100% 50% / 0.5)",
                  boxShadow: "0 0 20px hsl(195 100% 50% / 0.15)",
                }}
                onMouseEnter={e => {
                  if (!xPending && !isPending)
                    (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, hsl(195 100% 50% / 0.3), hsl(290 90% 62% / 0.25))";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, hsl(195 100% 50% / 0.2), hsl(290 90% 62% / 0.15))";
                }}
              >
                {xPending ? "AWAITING CONFIRMATION..." : (
                  <span className="flex items-center gap-2">
                    Sign in with {X_LOGO}
                  </span>
                )}
              </button>

              {xError && (
                <p className="text-xs font-mono text-center -mt-2" style={{ color: "hsl(0 80% 65%)" }}>{xError}</p>
              )}

              {/* Divider */}
              <div className="flex items-center gap-3 w-full">
                <div className="flex-1 h-px" style={{ background: "hsl(195 100% 50% / 0.12)" }} />
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-[10px] font-mono tracking-[0.2em] text-foreground/30 uppercase whitespace-nowrap">or</span>
                  <span className="text-[10px] font-mono tracking-[0.2em] text-foreground/30 uppercase whitespace-nowrap">type username</span>
                </div>
                <div className="flex-1 h-px" style={{ background: "hsl(195 100% 50% / 0.12)" }} />
              </div>

              {/* Manual callsign */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold font-mono text-lg" style={{ color: "hsl(195 100% 50%)" }}>@</span>
                  {searching && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: "hsl(195 100% 50% / 0.5)", fontSize: 11, fontFamily: "monospace" }}>…</span>
                  )}
                  <input
                    className="callsign-input w-full h-12 pl-10 pr-4 font-mono rounded-xl outline-none transition-all uppercase tracking-widest text-base"
                    style={{
                      background: "hsl(222 40% 9%)",
                      border: `1px solid ${suggestion ? "hsl(195 100% 50% / 0.55)" : "hsl(195 100% 50% / 0.25)"}`,
                      color: "hsl(195 100% 70%)",
                      borderBottomLeftRadius: suggestion ? 0 : undefined,
                      borderBottomRightRadius: suggestion ? 0 : undefined,
                    }}
                    placeholder="ENTER YOUR CALLSIGN"
                    value={val}
                    onChange={e => { setVal(e.target.value); setSuggestion(null); }}
                    onKeyDown={e => {
                      if (suggestion && (e.key === "Tab" || e.key === "ArrowRight" || e.key === "Enter")) {
                        e.preventDefault();
                        acceptSuggestion(suggestion);
                      }
                    }}
                    onFocus={e => {
                      (e.target as HTMLInputElement).style.borderColor = "hsl(195 100% 50% / 0.6)";
                      (e.target as HTMLInputElement).style.boxShadow = "0 0 20px hsl(195 100% 50% / 0.15)";
                    }}
                    onBlur={e => {
                      (e.target as HTMLInputElement).style.borderColor = suggestion ? "hsl(195 100% 50% / 0.55)" : "hsl(195 100% 50% / 0.25)";
                      (e.target as HTMLInputElement).style.boxShadow = "none";
                    }}
                  />
                  {/* Suggestion card */}
                  {suggestion && (
                    <button
                      type="button"
                      onMouseDown={() => acceptSuggestion(suggestion)}
                      style={{
                        position: "absolute", top: "100%", left: 0, right: 0,
                        background: "hsl(222 45% 11%)",
                        border: "1px solid hsl(195 100% 50% / 0.55)",
                        borderTop: "none",
                        borderBottomLeftRadius: 12, borderBottomRightRadius: 12,
                        padding: "0.6rem 0.9rem",
                        display: "flex", alignItems: "center", gap: 10,
                        cursor: "pointer", width: "100%", textAlign: "left",
                        boxShadow: "0 12px 32px hsl(195 100% 50% / 0.1)",
                        zIndex: 10,
                      }}
                    >
                      {suggestion.avatar
                        ? <img src={suggestion.avatar} alt="" style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid hsl(195 100% 50% / 0.3)", flexShrink: 0 }} />
                        : <div style={{ width: 32, height: 32, borderRadius: "50%", background: "hsl(195 100% 50% / 0.15)", flexShrink: 0 }} />
                      }
                      <div style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
                        <span style={{ fontFamily: "monospace", fontSize: "0.78rem", fontWeight: 700, color: "hsl(195 100% 70%)", letterSpacing: "0.05em" }}>@{suggestion.username}</span>
                        <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{suggestion.name}</span>
                      </div>
                      <span style={{ marginLeft: "auto", fontSize: "0.6rem", fontFamily: "monospace", letterSpacing: "0.15em", textTransform: "uppercase", color: "hsl(195 100% 55%)", flexShrink: 0 }}>it's me</span>
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!val.trim() || isPending || xPending}
                  className="w-full h-12 rounded-xl font-black tracking-[0.2em] uppercase text-sm transition-all disabled:opacity-40"
                  style={{
                    background: "linear-gradient(135deg, hsl(290 80% 45%), hsl(270 70% 38%))",
                    border: "1px solid hsl(290 90% 62% / 0.5)",
                    color: "hsl(290 100% 92%)",
                    boxShadow: "0 0 18px hsl(290 90% 55% / 0.3)",
                  }}
                  onMouseEnter={e => { if (!isPending) { (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, hsl(290 80% 52%), hsl(270 70% 45%))"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 28px hsl(290 90% 55% / 0.5)"; } }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, hsl(290 80% 45%), hsl(270 70% 38%))"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 18px hsl(290 90% 55% / 0.3)"; }}
                >
                  {isPending ? "Transmitting..." : "Open Channel"}
                </button>
              </form>

              {/* Skip */}
              <button
                type="button"
                onClick={() => { localStorage.setItem("xcoms_auth_method", "skip"); finish(); }}
                className="text-[10px] font-mono tracking-[0.2em] uppercase transition-all"
                style={{ color: "hsl(195 80% 65%)", textShadow: "0 0 10px hsl(195 100% 50% / 0.4)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "hsl(0 0% 100%)"; (e.currentTarget as HTMLButtonElement).style.textShadow = "0 0 20px hsl(195 100% 50% / 0.9), 0 0 40px hsl(195 100% 50% / 0.5)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "hsl(195 80% 65%)"; (e.currentTarget as HTMLButtonElement).style.textShadow = "0 0 10px hsl(195 100% 50% / 0.4)"; }}
              >
                Skip — browse without quantum signature
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
