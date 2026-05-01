import { useGetLiveSpaces, useGetUpcomingSpaces } from "@workspace/api-client-react";
import { SpaceCard } from "@/components/space-card";
import { StatsTicker } from "@/components/stats-ticker";
import { UsernameCapture } from "@/components/username-capture";
import { motion } from "framer-motion";

export default function Home() {
  const { data: liveSpaces, isLoading: isLoadingLive } = useGetLiveSpaces({ query: { refetchInterval: 30000 } });
  const { data: upcomingSpaces, isLoading: isLoadingUpcoming } = useGetUpcomingSpaces({ query: { refetchInterval: 30000 } });

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col relative overflow-hidden">

      {/* Lightshow beam background — matches austinteslalight.show */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Deep navy radial center glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,hsl(222_60%_12%/0.8)_0%,transparent_70%)]" />

        {/* Cyan beam — left */}
        <div
          className="absolute top-0 left-[28%] w-[2px] h-[75%] origin-top"
          style={{
            background: "linear-gradient(to bottom, hsl(195 100% 50% / 0.7) 0%, hsl(195 100% 50% / 0.2) 50%, transparent 100%)",
            filter: "blur(5px)",
            boxShadow: "0 0 30px 8px hsl(195 100% 50% / 0.15)",
            animation: "beam-sweep 7s ease-in-out infinite alternate",
          }}
        />
        {/* Cyan beam spread */}
        <div
          className="absolute top-0 left-[27%] w-[3%] h-[60%] origin-top"
          style={{
            background: "linear-gradient(to bottom, hsl(195 100% 50% / 0.12) 0%, transparent 100%)",
            filter: "blur(20px)",
            animation: "beam-sweep 7s ease-in-out infinite alternate",
          }}
        />

        {/* Magenta beam — right */}
        <div
          className="absolute top-0 left-[66%] w-[2px] h-[75%] origin-top"
          style={{
            background: "linear-gradient(to bottom, hsl(290 90% 62% / 0.7) 0%, hsl(290 90% 62% / 0.2) 50%, transparent 100%)",
            filter: "blur(5px)",
            boxShadow: "0 0 30px 8px hsl(290 90% 62% / 0.15)",
            animation: "beam-sweep 9s ease-in-out infinite alternate-reverse",
          }}
        />
        {/* Magenta beam spread */}
        <div
          className="absolute top-0 left-[64%] w-[4%] h-[60%] origin-top"
          style={{
            background: "linear-gradient(to bottom, hsl(290 90% 62% / 0.12) 0%, transparent 100%)",
            filter: "blur(20px)",
            animation: "beam-sweep 9s ease-in-out infinite alternate-reverse",
          }}
        />

        {/* Extra center beam — cyan subtle */}
        <div
          className="absolute top-0 left-[48%] w-[1px] h-[55%] origin-top opacity-60"
          style={{
            background: "linear-gradient(to bottom, hsl(195 100% 70% / 0.5) 0%, transparent 100%)",
            filter: "blur(3px)",
            animation: "beam-sweep 11s ease-in-out infinite alternate",
          }}
        />

        {/* Ground glow */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-[radial-gradient(ellipse_70%_100%_at_50%_100%,hsl(195_100%_50%/0.06)_0%,transparent_70%)]" />
      </div>

      {/* Header */}
      <header className="pt-20 pb-10 px-6 text-center z-10 relative">
        {/* Event date badge — like the Austin site */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 border border-primary/40 rounded-full px-4 py-1.5 mb-8 text-xs font-mono tracking-[0.2em] text-primary uppercase"
          style={{ boxShadow: "0 0 20px hsl(195 100% 50% / 0.15)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          X SPACES // LIVE NOW
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-7xl md:text-9xl font-black tracking-[-0.02em] uppercase leading-none mb-2"
        >
          <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[hsl(195_100%_75%)] to-[hsl(195_100%_50%)]" style={{ textShadow: "none", filter: "drop-shadow(0 0 30px hsl(195 100% 50% / 0.4))" }}>
            XPACE
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[hsl(290_90%_80%)] to-[hsl(290_90%_62%)]" style={{ filter: "drop-shadow(0 0 30px hsl(290 90% 62% / 0.4))" }}>
            .LIVE
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-sm md:text-base tracking-[0.3em] text-foreground/60 uppercase font-medium mt-6"
        >
          THE ULTIMATE VENUE FOR DIGITAL LOUDMOUTHS
        </motion.p>
      </header>

      <StatsTicker />

      <main className="flex-1 container mx-auto px-6 py-16 z-10">

        {/* LIVE NOW section */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-10">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ boxShadow: "0 0 10px hsl(195 100% 50%)" }} />
              <h2 className="text-xs font-mono tracking-[0.3em] text-primary uppercase">
                MAIN STAGE — LIVE NOW
              </h2>
            </div>
            <div className="h-px bg-gradient-to-r from-primary/30 to-transparent flex-1" />
          </div>

          {isLoadingLive ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[320px] rounded-xl bg-card border border-primary/20 animate-pulse" />
              ))}
            </div>
          ) : liveSpaces?.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-primary/20 rounded-xl">
              <p className="font-mono text-primary/40 text-sm uppercase tracking-[0.2em]">Silence on the network.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveSpaces?.map((space, i) => (
                <motion.div
                  key={space.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <SpaceCard space={space} />
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* UPCOMING section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-10">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-secondary" style={{ boxShadow: "0 0 10px hsl(290 90% 62%)" }} />
              <h2 className="text-xs font-mono tracking-[0.3em] text-secondary uppercase">
                UPCOMING SPECTACLES
              </h2>
            </div>
            <div className="h-px bg-gradient-to-r from-secondary/30 to-transparent flex-1" />
          </div>

          {isLoadingUpcoming ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="h-[320px] rounded-xl bg-card border border-secondary/20 animate-pulse" />
              ))}
            </div>
          ) : upcomingSpaces?.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-secondary/20 rounded-xl">
              <p className="font-mono text-secondary/40 text-sm uppercase tracking-[0.2em]">Nothing scheduled. Create chaos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingSpaces?.map((space, i) => (
                <motion.div
                  key={space.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <SpaceCard space={space} />
                </motion.div>
              ))}
            </div>
          )}
        </section>

      </main>

      <UsernameCapture />
    </div>
  );
}
