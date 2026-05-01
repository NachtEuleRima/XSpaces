import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    if (!val) return;
    const ok = await saveUsername(val, spaceId);
    if (ok) {
      onOpenChange(false);
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-2 border-primary bg-black/95 shadow-[0_0_50px_rgba(255,0,128,0.3)] text-center p-8 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black text-primary uppercase tracking-widest mb-2 animate-neon-flicker">
            HALT
          </DialogTitle>
          <DialogDescription className="text-foreground/80 font-mono text-sm">
            You cannot enter the chaos anonymously. Provide your X handle to proceed to the stage.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-accent font-bold">@</span>
            <Input
              autoFocus
              className="h-16 pl-12 text-2xl bg-white/5 border-accent focus-visible:ring-accent text-accent font-mono placeholder:text-accent/30 text-center uppercase"
              placeholder="HANDLE"
              value={val}
              onChange={(e) => setVal(e.target.value)}
            />
          </div>
          <Button 
            type="submit" 
            disabled={!val || isPending}
            className="h-14 text-lg font-black tracking-[0.2em] bg-accent text-accent-foreground hover:bg-accent/80 shadow-[0_0_20px_rgba(0,255,255,0.5)] uppercase transition-all hover:scale-105 active:scale-95"
          >
            {isPending ? "VERIFYING..." : "ENTER THE SPACE"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
