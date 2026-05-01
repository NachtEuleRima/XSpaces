import { useState } from "react";
import { useUsername } from "@/hooks/use-username";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export function UsernameCapture() {
  const { username, saveUsername, isPending } = useUsername();
  const [inputVal, setInputVal] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  if (username) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.9 }}
          className="fixed bottom-4 right-4 z-50 p-[2px] rounded-lg bg-gradient-to-r from-primary via-accent to-secondary animate-neon-pulse"
        >
          <div className="bg-card p-4 rounded-md shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-primary tracking-widest uppercase">IDENTIFY YOURSELF</h3>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  X
                </button>
              </div>
              <p className="text-xs text-muted-foreground">The algorithm demands your handle.</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-bold">@</span>
                  <Input 
                    placeholder="techbro69" 
                    className="pl-8 bg-black/50 border-primary/50 focus-visible:ring-primary text-primary font-mono placeholder:text-primary/30"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && inputVal) {
                        saveUsername(inputVal);
                      }
                    }}
                  />
                </div>
                <Button 
                  onClick={() => inputVal && saveUsername(inputVal)}
                  disabled={!inputVal || isPending}
                  className="bg-primary text-primary-foreground hover:bg-primary/80 font-bold tracking-wider"
                >
                  {isPending ? "SYNCING..." : "ENTER"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
