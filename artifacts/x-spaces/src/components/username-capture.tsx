import { useState } from "react";
import { useUsername } from "@/hooks/use-username";
import { motion, AnimatePresence } from "framer-motion";

export function UsernameCapture() {
  const { username, saveUsername, isPending } = useUsername();
  const [inputVal, setInputVal] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  // Hide if user already made an explicit choice on the splash (x, manual, or skip)
  if (username || localStorage.getItem("xcoms_auth_method")) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="fixed bottom-5 right-5 z-50 w-72"
          style={{
            background: "hsl(222 40% 8%)",
            border: "1px solid hsl(195 100% 50% / 0.4)",
            borderRadius: "12px",
            boxShadow: "0 0 0 1px hsl(195 100% 50% / 0.1), 0 8px 40px hsl(195 100% 50% / 0.15), 0 20px 60px hsl(222 47% 3% / 0.8)",
          }}
        >
          {/* Top cyan accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[1px] rounded-t-xl"
            style={{ background: "linear-gradient(to right, transparent, hsl(195 100% 50% / 0.8), transparent)" }}
          />

          <div className="p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: "hsl(195 100% 50%)", boxShadow: "0 0 6px hsl(195 100% 50%)" }}
                />
                <h3
                  className="text-xs font-mono tracking-[0.2em] font-bold uppercase"
                  style={{ color: "hsl(195 100% 60%)" }}
                >
                  IDENTIFY YOURSELF
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground text-xs w-5 h-5 flex items-center justify-center rounded transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-muted-foreground font-mono">
              The algorithm demands your handle.
            </p>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold font-mono"
                  style={{ color: "hsl(195 100% 50%)" }}
                >
                  @
                </span>
                <input
                  placeholder="yourhandle"
                  className="w-full h-9 pl-7 pr-3 text-sm font-mono rounded-md outline-none transition-all"
                  style={{
                    background: "hsl(222 40% 12%)",
                    border: "1px solid hsl(195 100% 50% / 0.3)",
                    color: "hsl(195 100% 70%)",
                  }}
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && inputVal.trim()) {
                      saveUsername(inputVal.trim());
                    }
                  }}
                  onFocus={e => {
                    (e.target as HTMLInputElement).style.borderColor = "hsl(195 100% 50% / 0.7)";
                    (e.target as HTMLInputElement).style.boxShadow = "0 0 10px hsl(195 100% 50% / 0.2)";
                  }}
                  onBlur={e => {
                    (e.target as HTMLInputElement).style.borderColor = "hsl(195 100% 50% / 0.3)";
                    (e.target as HTMLInputElement).style.boxShadow = "none";
                  }}
                />
              </div>
              <button
                onClick={() => inputVal.trim() && saveUsername(inputVal.trim())}
                disabled={!inputVal.trim() || isPending}
                className="px-3 h-9 rounded-md text-xs font-bold font-mono tracking-wider uppercase transition-all disabled:opacity-40"
                style={{
                  background: "hsl(195 100% 50% / 0.15)",
                  border: "1px solid hsl(195 100% 50% / 0.4)",
                  color: "hsl(195 100% 60%)",
                }}
                onMouseEnter={e => {
                  if (!isPending) (e.target as HTMLButtonElement).style.background = "hsl(195 100% 50% / 0.25)";
                }}
                onMouseLeave={e => {
                  (e.target as HTMLButtonElement).style.background = "hsl(195 100% 50% / 0.15)";
                }}
              >
                {isPending ? "..." : "ENTER"}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
