import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useUsername } from "@/hooks/use-username";

interface UsernameModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  spaceId?: number;
}

const X_LOGO = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function UsernameModal({ open, onOpenChange, onSuccess, spaceId }: UsernameModalProps) {
  const { saveUsername, isPending } = useUsername();
  const [val, setVal] = useState("");
  const [xPending, setXPending] = useState(false);
  const [xError, setXError] = useState<string | null>(null);
  const popupRef = useRef<Window | null>(null);

  const handleXMessage = useCallback(async (e: MessageEvent) => {
    if (e.data?.type === "x-auth-success" && e.data.username) {
      setXPending(true);
      setXError(null);
      const ok = await saveUsername(e.data.username, spaceId);
      setXPending(false);
      if (ok) {
        onOpenChange(false);
        onSuccess();
      }
    } else if (e.data?.type === "x-auth-error") {
      setXError(e.data.error ?? "Sign-in failed");
      setXPending(false);
    }
  }, [saveUsername, spaceId, onOpenChange, onSuccess]);

  useEffect(() => {
    window.addEventListener("message", handleXMessage);
    return () => window.removeEventListener("message", handleXMessage);
  }, [handleXMessage]);

  // Close popup if modal closes
  useEffect(() => {
    if (!open) popupRef.current?.close();
  }, [open]);

  const handleXSignIn = () => {
    setXError(null);
    const w = 600;
    const h = 700;
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top = window.screenY + (window.outerHeight - h) / 2;
    const popup = window.open(
      "/api/auth/x/login",
      "x-oauth",
      `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes`,
    );
    if (!popup) {
      setXError("Popup was blocked — please allow popups for this site");
      return;
    }
    popupRef.current = popup;
    setXPending(true);

    // Poll to detect if user closed the popup without completing auth
    const poll = setInterval(() => {
      if (popup.closed) {
        clearInterval(poll);
        setXPending(false);
      }
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!val.trim()) return;
    const ok = await saveUsername(val.trim(), spaceId);
    if (ok) {
      onOpenChange(false);
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="text-center p-8 sm:max-w-[420px]"
        style={{
          background: "hsl(222 47% 6%)",
          border: "1px solid hsl(195 100% 50% / 0.4)",
          boxShadow: "0 0 0 1px hsl(195 100% 50% / 0.1), 0 25px 80px hsl(195 100% 50% / 0.15), 0 0 120px hsl(290 90% 62% / 0.08)",
        }}
      >
        {/* Top beam */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px] rounded-t-xl"
          style={{ background: "linear-gradient(to right, transparent, hsl(195 100% 50% / 0.9), hsl(290 90% 62% / 0.6), transparent)" }}
        />

        <DialogHeader className="mb-2">
          <div className="flex justify-center mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: "hsl(195 100% 50% / 0.1)",
                border: "1px solid hsl(195 100% 50% / 0.4)",
                boxShadow: "0 0 20px hsl(195 100% 50% / 0.2)",
              }}
            >
              <span style={{ fontSize: "20px", color: "hsl(195 100% 60%)" }}>✦</span>
            </div>
          </div>
          <DialogTitle
            className="text-2xl font-black uppercase tracking-[0.15em] mb-2"
            style={{ color: "hsl(195 100% 65%)" }}
          >
            STATE YOUR DESIGNATION
          </DialogTitle>
          <DialogDescription className="text-foreground/60 font-mono text-sm leading-relaxed">
            Identify yourself to Starfleet Command. Your callsign will be logged on this vessel.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">

          {/* ── Sign in with X ── */}
          <button
            type="button"
            onClick={handleXSignIn}
            disabled={xPending || isPending}
            className="w-full h-12 rounded-lg font-black tracking-[0.12em] uppercase text-sm transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
            style={{
              background: xPending ? "hsl(210 20% 96% / 0.12)" : "hsl(210 20% 96%)",
              color: xPending ? "hsl(210 20% 96% / 0.5)" : "hsl(222 47% 6%)",
              border: "1px solid hsl(210 20% 96% / 0.3)",
            }}
            onMouseEnter={e => {
              if (!xPending && !isPending)
                (e.currentTarget as HTMLButtonElement).style.background = "hsl(195 100% 90%)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = xPending ? "hsl(210 20% 96% / 0.12)" : "hsl(210 20% 96%)";
            }}
          >
            {X_LOGO}
            {xPending ? "AWAITING CONFIRMATION..." : "SIGN IN WITH X"}
          </button>

          {xError && (
            <p className="text-xs font-mono text-center" style={{ color: "hsl(0 80% 65%)" }}>
              {xError}
            </p>
          )}

          {/* ── Divider ── */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "hsl(195 100% 50% / 0.15)" }} />
            <span className="text-[10px] font-mono tracking-[0.3em] text-foreground/30 uppercase">or enter manually</span>
            <div className="flex-1 h-px" style={{ background: "hsl(195 100% 50% / 0.15)" }} />
          </div>

          {/* ── Manual callsign ── */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="relative">
              <span
                className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold font-mono"
                style={{ color: "hsl(195 100% 50%)" }}
              >
                @
              </span>
              <input
                className="w-full h-12 pl-10 pr-4 text-base font-mono rounded-lg outline-none transition-all text-center uppercase tracking-widest"
                style={{
                  background: "hsl(222 40% 10%)",
                  border: "1px solid hsl(195 100% 50% / 0.3)",
                  color: "hsl(195 100% 70%)",
                }}
                placeholder="CALLSIGN"
                value={val}
                onChange={(e) => setVal(e.target.value)}
                onFocus={e => {
                  (e.target as HTMLInputElement).style.borderColor = "hsl(195 100% 50% / 0.7)";
                  (e.target as HTMLInputElement).style.boxShadow = "0 0 20px hsl(195 100% 50% / 0.2)";
                }}
                onBlur={e => {
                  (e.target as HTMLInputElement).style.borderColor = "hsl(195 100% 50% / 0.3)";
                  (e.target as HTMLInputElement).style.boxShadow = "none";
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!val.trim() || isPending || xPending}
              className="w-full h-11 rounded-lg font-black tracking-[0.2em] uppercase text-sm transition-all disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg, hsl(195 100% 50% / 0.2), hsl(290 90% 62% / 0.15))",
                border: "1px solid hsl(195 100% 50% / 0.5)",
                color: "hsl(195 100% 65%)",
                boxShadow: "0 0 20px hsl(195 100% 50% / 0.15)",
              }}
              onMouseEnter={e => {
                if (!isPending) {
                  (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, hsl(195 100% 50% / 0.3), hsl(290 90% 62% / 0.25))";
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, hsl(195 100% 50% / 0.2), hsl(290 90% 62% / 0.15))";
              }}
            >
              {isPending ? "TRANSMITTING..." : "OPEN CHANNEL"}
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
