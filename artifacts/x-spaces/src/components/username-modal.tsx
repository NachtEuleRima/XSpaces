import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useUsername } from "@/hooks/use-username";

interface UsernameModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  spaceId?: number;
}

export function UsernameModal({ open, onOpenChange, onSuccess, spaceId }: UsernameModalProps) {
  const { saveUsername, isPending } = useUsername();
  const [val, setVal] = useState("");

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
              <span style={{ fontSize: "20px", color: "hsl(195 100% 60%)" }}>X</span>
            </div>
          </div>
          <DialogTitle
            className="text-2xl font-black uppercase tracking-[0.15em] mb-2"
            style={{ color: "hsl(195 100% 65%)" }}
          >
            BEFORE YOU ENTER
          </DialogTitle>
          <DialogDescription className="text-foreground/60 font-mono text-sm leading-relaxed">
            Drop your X handle to join the space. We save it so we remember you next time.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="relative">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold font-mono"
              style={{ color: "hsl(195 100% 50%)" }}
            >
              @
            </span>
            <input
              autoFocus
              className="w-full h-14 pl-10 pr-4 text-lg font-mono rounded-lg outline-none transition-all text-center uppercase tracking-widest"
              style={{
                background: "hsl(222 40% 10%)",
                border: "1px solid hsl(195 100% 50% / 0.3)",
                color: "hsl(195 100% 70%)",
              }}
              placeholder="YOURHANDLE"
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
            disabled={!val.trim() || isPending}
            className="w-full h-12 rounded-lg font-black tracking-[0.2em] uppercase text-sm transition-all disabled:opacity-40"
            style={{
              background: "linear-gradient(135deg, hsl(195 100% 50% / 0.2), hsl(290 90% 62% / 0.15))",
              border: "1px solid hsl(195 100% 50% / 0.5)",
              color: "hsl(195 100% 65%)",
              boxShadow: "0 0 20px hsl(195 100% 50% / 0.15)",
            }}
            onMouseEnter={e => {
              if (!isPending) {
                (e.target as HTMLButtonElement).style.background = "linear-gradient(135deg, hsl(195 100% 50% / 0.3), hsl(290 90% 62% / 0.25))";
                (e.target as HTMLButtonElement).style.boxShadow = "0 0 30px hsl(195 100% 50% / 0.25)";
              }
            }}
            onMouseLeave={e => {
              (e.target as HTMLButtonElement).style.background = "linear-gradient(135deg, hsl(195 100% 50% / 0.2), hsl(290 90% 62% / 0.15))";
              (e.target as HTMLButtonElement).style.boxShadow = "0 0 20px hsl(195 100% 50% / 0.15)";
            }}
          >
            {isPending ? "SYNCING..." : "ENTER THE SPACE"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
