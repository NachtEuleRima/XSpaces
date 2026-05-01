import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUsername } from "@/hooks/use-username";

const X_LOGO = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
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

  const finish = useCallback(() => {
    setExiting(true);
    setTimeout(onDone, 600);
  }, [onDone]);

  const handleXMessage = useCallback(async (e: MessageEvent) => {
    if (e.data?.type === "x-auth-success" && e.data.username) {
      setXPending(true);
      setXError(null);
      localStorage.setItem("xcoms_auth_method", "x");
      await saveUsername(e.data.username);
      finish();
    } else if (e.data?.type === "x-auth-error") {
      setXError(e.data.error ?? "Sign-in failed — please try again");
      setXPending(false);
    }
  }, [saveUsername, finish]);

  useEffect(() => {
    window.addEventListener("message", handleXMessage);
    return () => window.removeEventListener("message", handleXMessage);
  }, [handleXMessage]);

  const handleXSignIn = () => {
    setXError(null);
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
                    XCOMS
                  </span>
                  <span className="text-3xl tracking-tight" style={{ color: "hsl(290 90% 62%)", textShadow: "0 0 30px hsl(290 90% 62% / 0.5)" }}>
                    .SPACE
                  </span>
                </div>
                <p className="text-xs font-mono tracking-[0.3em] text-foreground/40 uppercase mt-1">
                  Hailing Frequencies Open
                </p>
              </div>

              {/* Divider */}
              <div className="w-full h-px" style={{ background: "linear-gradient(to right, transparent, hsl(195 100% 50% / 0.2), transparent)" }} />

              {/* Identity prompt */}
              <div className="text-center">
                <h2 className="text-xl font-black uppercase tracking-[0.15em] mb-1" style={{ color: "hsl(195 100% 65%)" }}>
                  State Your Designation
                </h2>
                <p className="text-sm font-mono text-foreground/50 leading-relaxed">
                  Identify yourself to personalize your quadrant — spaces from people you follow will appear first.
                </p>
              </div>

              {/* Sign in with X */}
              <button
                type="button"
                onClick={handleXSignIn}
                disabled={xPending || isPending}
                className="w-full h-13 py-3.5 rounded-xl font-black tracking-[0.12em] uppercase text-sm transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                style={{
                  background: xPending ? "hsl(210 20% 96% / 0.12)" : "hsl(210 20% 96%)",
                  color: xPending ? "hsl(210 20% 96% / 0.5)" : "hsl(222 47% 6%)",
                  border: "1px solid hsl(210 20% 96% / 0.2)",
                }}
                onMouseEnter={e => { if (!xPending && !isPending) (e.currentTarget as HTMLButtonElement).style.background = "hsl(195 100% 90%)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = xPending ? "hsl(210 20% 96% / 0.12)" : "hsl(210 20% 96%)"; }}
              >
                {X_LOGO}
                {xPending ? "Awaiting Authorization..." : "Sign in with X"}
              </button>

              {xError && (
                <p className="text-xs font-mono text-center -mt-2" style={{ color: "hsl(0 80% 65%)" }}>{xError}</p>
              )}

              {/* Divider */}
              <div className="flex items-center gap-3 w-full">
                <div className="flex-1 h-px" style={{ background: "hsl(195 100% 50% / 0.12)" }} />
                <span className="text-[10px] font-mono tracking-[0.3em] text-foreground/25 uppercase">or</span>
                <div className="flex-1 h-px" style={{ background: "hsl(195 100% 50% / 0.12)" }} />
              </div>

              {/* Manual callsign */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold font-mono text-lg" style={{ color: "hsl(195 100% 50%)" }}>@</span>
                  <input
                    className="w-full h-12 pl-10 pr-4 font-mono rounded-xl outline-none transition-all text-center uppercase tracking-widest text-base"
                    style={{
                      background: "hsl(222 40% 9%)",
                      border: "1px solid hsl(195 100% 50% / 0.25)",
                      color: "hsl(195 100% 70%)",
                    }}
                    placeholder="YOUR CALLSIGN"
                    value={val}
                    onChange={e => setVal(e.target.value)}
                    onFocus={e => {
                      (e.target as HTMLInputElement).style.borderColor = "hsl(195 100% 50% / 0.6)";
                      (e.target as HTMLInputElement).style.boxShadow = "0 0 20px hsl(195 100% 50% / 0.15)";
                    }}
                    onBlur={e => {
                      (e.target as HTMLInputElement).style.borderColor = "hsl(195 100% 50% / 0.25)";
                      (e.target as HTMLInputElement).style.boxShadow = "none";
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!val.trim() || isPending || xPending}
                  className="w-full h-12 rounded-xl font-black tracking-[0.2em] uppercase text-sm transition-all disabled:opacity-40"
                  style={{
                    background: "linear-gradient(135deg, hsl(195 100% 50% / 0.18), hsl(290 90% 62% / 0.12))",
                    border: "1px solid hsl(195 100% 50% / 0.4)",
                    color: "hsl(195 100% 65%)",
                  }}
                  onMouseEnter={e => { if (!isPending) (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, hsl(195 100% 50% / 0.28), hsl(290 90% 62% / 0.2))"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, hsl(195 100% 50% / 0.18), hsl(290 90% 62% / 0.12))"; }}
                >
                  {isPending ? "Transmitting..." : "Open Channel"}
                </button>
              </form>

              {/* Skip */}
              <button
                type="button"
                onClick={finish}
                className="text-[10px] font-mono tracking-[0.2em] text-foreground/25 hover:text-foreground/40 uppercase transition-colors"
              >
                Skip — browse without personalization
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
