import { useGetLiveSpaces, useGetUpcomingSpaces, getGetLiveSpacesQueryKey, getGetUpcomingSpacesQueryKey, Space } from "@workspace/api-client-react";
import { SpaceCard } from "@/components/space-card";
import { StatsTicker } from "@/components/stats-ticker";
import { UsernameCapture } from "@/components/username-capture";
import { TechSupport } from "@/components/tech-support";
import { ScrollNav } from "@/components/scroll-nav";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useUsername } from "@/hooks/use-username";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

function SectionHeader({ color, label, pulse }: { color: string; label: string; pulse?: boolean }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <div className="flex items-center gap-3">
        <span
          className={`w-2 h-2 rounded-full ${pulse ? "animate-pulse" : ""}`}
          style={{
            background: color,
            boxShadow: `0 0 10px ${color}`,
          }}
        />
        <h2
          className="text-xs font-mono tracking-[0.3em] uppercase whitespace-nowrap"
          style={{ color }}
        >
          {label}
        </h2>
      </div>
      <div
        className="h-px flex-1"
        style={{ background: `linear-gradient(to right, ${color}40, transparent)` }}
      />
    </div>
  );
}

function SpaceGrid({ spaces, delay = 0 }: { spaces: Space[]; delay?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {spaces.map((space, i) => (
        <motion.div
          key={space.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + i * 0.06 }}
        >
          <SpaceCard space={space} />
        </motion.div>
      ))}
    </div>
  );
}

function MoreSpacesToggle({
  spaces,
  status,
}: {
  spaces: Space[];
  status: "live" | "upcoming";
}) {
  const [open, setOpen] = useState(false);
  if (spaces.length === 0) return null;

  const color = status === "live" ? "hsl(195 100% 50%)" : "hsl(290 90% 62%)";

  return (
    <div className="mt-8">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-3 group w-full"
      >
        <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${color}30)` }} />
        <span
          className="text-xs font-mono tracking-[0.25em] uppercase px-4 py-2 rounded-full border transition-all"
          style={{
            color,
            borderColor: `${color}40`,
            background: open ? `${color}10` : "transparent",
            boxShadow: open ? `0 0 20px ${color}20` : "none",
          }}
        >
          {open ? "▲ CLOSE CHANNEL" : "▼ HAIL MORE"} {status === "live" ? "SIGNALS" : "INCOMING"} ({spaces.length})
        </span>
        <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${color}30)` }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-8">
              <SpaceGrid spaces={spaces} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState({ color, message }: { color: string; message: string }) {
  return (
    <div
      className="text-center py-16 border border-dashed rounded-xl"
      style={{ borderColor: `${color}20` }}
    >
      <p
        className="font-mono text-sm uppercase tracking-[0.2em]"
        style={{ color: `${color}60` }}
      >
        {message}
      </p>
    </div>
  );
}

export default function Home() {
  const { username } = useUsername();
  const isMobile = useIsMobile();
  const featuredCount = isMobile ? 3 : 6;
  const params = username ? { viewerUsername: username } : undefined;

  const { data: liveSpaces, isLoading: isLoadingLive } = useGetLiveSpaces(params, { query: { queryKey: getGetLiveSpacesQueryKey(params), refetchInterval: 30000 } });
  const { data: upcomingSpaces, isLoading: isLoadingUpcoming } = useGetUpcomingSpaces(params, { query: { queryKey: getGetUpcomingSpacesQueryKey(params), refetchInterval: 30000 } });

  // Featured = spaces where someone you follow is speaking/cohosting (isMine), capped at limit.
  // If no personalization, fall back to top N of everything.
  // Everything else goes under HAIL MORE.
  const myLive = (liveSpaces ?? []).filter(s => s.isMine);
  const otherLive = (liveSpaces ?? []).filter(s => !s.isMine);
  const allLive = [...myLive, ...otherLive];
  const featuredLive = myLive.length > 0 ? myLive.slice(0, featuredCount) : allLive.slice(0, featuredCount);
  const hiddenLive = myLive.length > 0 ? [...myLive.slice(featuredCount), ...otherLive] : allLive.slice(featuredCount);

  const myUpcoming = (upcomingSpaces ?? []).filter(s => s.isMine);
  const otherUpcoming = (upcomingSpaces ?? []).filter(s => !s.isMine);
  const allUpcoming = [...myUpcoming, ...otherUpcoming];
  const featuredUpcoming = myUpcoming.length > 0 ? myUpcoming.slice(0, featuredCount) : allUpcoming.slice(0, featuredCount);
  const hiddenUpcoming = myUpcoming.length > 0 ? [...myUpcoming.slice(featuredCount), ...otherUpcoming] : allUpcoming.slice(featuredCount);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col relative overflow-hidden">

      {/* Lightshow beam background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,hsl(222_60%_12%/0.8)_0%,transparent_70%)]" />
        <div
          className="absolute top-0 left-[28%] w-[2px] h-[75%] origin-top"
          style={{
            background: "linear-gradient(to bottom, hsl(195 100% 50% / 0.7) 0%, hsl(195 100% 50% / 0.2) 50%, transparent 100%)",
            filter: "blur(5px)",
            boxShadow: "0 0 30px 8px hsl(195 100% 50% / 0.15)",
            animation: "beam-sweep 7s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute top-0 left-[27%] w-[3%] h-[60%] origin-top"
          style={{
            background: "linear-gradient(to bottom, hsl(195 100% 50% / 0.12) 0%, transparent 100%)",
            filter: "blur(20px)",
            animation: "beam-sweep 7s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute top-0 left-[66%] w-[2px] h-[75%] origin-top"
          style={{
            background: "linear-gradient(to bottom, hsl(290 90% 62% / 0.7) 0%, hsl(290 90% 62% / 0.2) 50%, transparent 100%)",
            filter: "blur(5px)",
            boxShadow: "0 0 30px 8px hsl(290 90% 62% / 0.15)",
            animation: "beam-sweep 9s ease-in-out infinite alternate-reverse",
          }}
        />
        <div
          className="absolute top-0 left-[64%] w-[4%] h-[60%] origin-top"
          style={{
            background: "linear-gradient(to bottom, hsl(290 90% 62% / 0.12) 0%, transparent 100%)",
            filter: "blur(20px)",
            animation: "beam-sweep 9s ease-in-out infinite alternate-reverse",
          }}
        />
        <div
          className="absolute top-0 left-[48%] w-[1px] h-[55%] origin-top opacity-60"
          style={{
            background: "linear-gradient(to bottom, hsl(195 100% 70% / 0.5) 0%, transparent 100%)",
            filter: "blur(3px)",
            animation: "beam-sweep 11s ease-in-out infinite alternate",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-[radial-gradient(ellipse_70%_100%_at_50%_100%,hsl(195_100%_50%/0.06)_0%,transparent_70%)]" />
      </div>

      {/* Header */}
      <header className="pt-20 pb-10 px-6 text-center z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div
            className="badge-float inline-flex items-center gap-2 border border-primary/40 rounded-full px-4 py-1.5 text-xs font-mono tracking-[0.2em] text-primary uppercase"
            style={{ boxShadow: "0 0 20px hsl(195 100% 50% / 0.15)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {(() => {
              const now = new Date();
              const dayOfYear = Math.floor(
                (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86_400_000
              );
              const stardate = `${now.getFullYear()}.${String(dayOfYear).padStart(3, "0")}`;
              return (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                  <span style={{ opacity: 0.55, fontSize: "0.9em" }}>XCOMS</span>
                  <span style={{ opacity: 0.3 }}>//</span>
                  <span style={{ opacity: 0.55, fontSize: "0.9em" }}>SD</span>
                  <span style={{ fontWeight: 800, letterSpacing: "0.08em" }}>{stardate}</span>
                </span>
              );
            })()}
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-7xl md:text-9xl font-black tracking-[-0.02em] uppercase leading-none mb-2"
        >
          <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[hsl(195_100%_75%)] to-[hsl(195_100%_50%)]" style={{ filter: "drop-shadow(0 0 30px hsl(195 100% 50% / 0.4))" }}>
            XCOMS
          </span>
          <span className="block text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-b from-[hsl(290_90%_80%)] to-[hsl(290_90%_62%)]" style={{ filter: "drop-shadow(0 0 30px hsl(290 90% 62% / 0.4))" }}>
            .Space
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-sm md:text-base tracking-[0.3em] text-foreground/60 uppercase font-medium mt-6"
        >
          HAILING FREQUENCIES OPEN
        </motion.p>
      </header>

      <StatsTicker />

      <main className="flex-1 container mx-auto px-6 pt-16 pb-0 z-10">

        {/* ── LIVE NOW ── */}
        <section className="mb-24">
          <SectionHeader color="hsl(195 100% 50%)" label="MAIN BRIDGE — LIVE TRANSMISSION" pulse />

          {isLoadingLive ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[320px] rounded-xl bg-card border border-primary/20 animate-pulse" />
              ))}
            </div>
          ) : allLive.length === 0 ? (
            <EmptyState color="hsl(195 100% 50%)" message="Silence on the network." />
          ) : (
            <>
              <SpaceGrid spaces={featuredLive} />
              {hiddenLive.length > 0 && (
                <MoreSpacesToggle spaces={hiddenLive} status="live" />
              )}
            </>
          )}
        </section>

        {/* ── UPCOMING ── */}
        <section className="mb-0">
          <SectionHeader color="hsl(290 90% 62%)" label="SCHEDULED TRANSMISSIONS" />

          {isLoadingUpcoming ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="h-[320px] rounded-xl bg-card border border-secondary/20 animate-pulse" />
              ))}
            </div>
          ) : allUpcoming.length === 0 ? (
            <EmptyState color="hsl(290 90% 62%)" message="No transmissions scheduled. The airwaves are silent." />
          ) : (
            <>
              <SpaceGrid spaces={featuredUpcoming} />
              {hiddenUpcoming.length > 0 && (
                <MoreSpacesToggle spaces={hiddenUpcoming} status="upcoming" />
              )}
            </>
          )}
        </section>

      </main>

      <TechSupport />

      {/* Auth action — bottom of page */}
      <div style={{ textAlign: "center", paddingBottom: "1.25rem", marginTop: "-1.25rem", position: "relative", zIndex: 40 }}>
        {localStorage.getItem("xcoms_auth_method") === "x" ? (
          <button
            onClick={() => {
              localStorage.removeItem("xcoms_username");
              localStorage.removeItem("xcoms_auth_method");
              window.dispatchEvent(new Event("xcoms:signout"));
            }}
            style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.25)", fontFamily: "monospace", fontSize: "0.65rem", padding: "4px 12px", borderRadius: 6, cursor: "pointer", letterSpacing: "0.1em" }}
          >
            SIGN OUT
          </button>
        ) : (
          <button
            onClick={() => {
              localStorage.removeItem("xcoms_username");
              localStorage.removeItem("xcoms_auth_method");
              window.dispatchEvent(new Event("xcoms:signout"));
            }}
            style={{ background: "none", border: "1px solid rgba(234,142,42,0.45)", color: "rgba(0,229,245,0.6)", fontFamily: "monospace", fontSize: "0.65rem", padding: "4px 12px", borderRadius: 6, cursor: "pointer", letterSpacing: "0.1em", boxShadow: "0 0 8px rgba(234,142,42,0.2)", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <svg viewBox="0 0 24 24" style={{ width: 11, height: 11, fill: "rgba(0,229,245,0.6)", flexShrink: 0 }} aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            SIGN IN
          </button>
        )}
      </div>

      <UsernameCapture />
      <ScrollNav />
    </div>
  );
}
