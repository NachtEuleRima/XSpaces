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
  const { saveUsername } = useUsername();
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
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                background: "hsl(195 100% 50% / 0.1)",
                border: "1px solid hsl(195 100% 50% / 0.4)",
                boxShadow: "0 0 20px hsl(195 100% 50% / 0.2)",
              }}
            >
              {/* Starfleet delta arrowhead */}
              <svg viewBox="0 0 80 96" fill="none" style={{ width: 28, height: 34 }}>
                <path
                  d="M40 4 L76 92 L40 74 L4 92 Z"
                  fill="hsl(195 100% 55% / 0.2)"
                  stroke="hsl(195 100% 60%)"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <path
                  d="M40 20 L64 82 L40 68 L16 82 Z"
                  fill="hsl(195 100% 60% / 0.15)"
                />
              </svg>
            </div>
          </div>
          <DialogTitle
            className="text-2xl font-black uppercase tracking-[0.15em] mb-2"
            style={{ color: "hsl(195 100% 65%)" }}
          >
            STATE YOUR DESIGNATION
          </DialogTitle>
          <DialogDescription className="text-foreground/60 font-mono text-sm leading-relaxed">
            Identify yourself to Starfleet Command · Your callsign will be logged on this vessel
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">

          {/* ── Sign in with X ── */}
          <button
            type="button"
            onClick={handleXSignIn}
            disabled={xPending}
            className="w-full h-12 rounded-lg font-black tracking-[0.12em] uppercase text-sm transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
            style={{
              background: xPending ? "hsl(210 20% 96% / 0.12)" : "hsl(210 20% 96%)",
              color: xPending ? "hsl(210 20% 96% / 0.5)" : "hsl(222 47% 6%)",
              border: "1px solid hsl(210 20% 96% / 0.3)",
            }}
            onMouseEnter={e => {
              if (!xPending)
                (e.currentTarget as HTMLButtonElement).style.background = "hsl(195 100% 90%)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = xPending ? "hsl(210 20% 96% / 0.12)" : "hsl(210 20% 96%)";
            }}
          >
            {X_LOGO}
            {xPending ? "AWAITING CONFIRMATION..." : "AUTHORIZE WITH X"}
          </button>

          {xError && (
            <p className="text-xs font-mono text-center" style={{ color: "hsl(0 80% 65%)" }}>
              {xError}
            </p>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}
