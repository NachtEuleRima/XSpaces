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
      {/* Background noise and glow */}
      <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-50"></div>
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/20 blur-[120px] rounded-full pointer-events-none"></div>

      <header className="pt-16 pb-8 px-6 text-center z-10 relative">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-br from-primary via-white to-accent animate-neon-flicker pb-4"
        >
          XPACE.LIVE
        </motion.h1>
        <p className="font-mono text-accent tracking-widest text-sm md:text-base uppercase opacity-80">
          The ultimate venue for digital loudmouths.
        </p>
      </header>

      <StatsTicker />

      <main className="flex-1 container mx-auto px-6 py-12 z-10">
        
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-black uppercase tracking-widest text-primary drop-shadow-[0_0_10px_rgba(255,0,128,0.8)]">
              MAIN STAGE (LIVE NOW)
            </h2>
            <div className="h-px bg-primary/30 flex-1 relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary shadow-[0_0_15px_var(--primary)] animate-pulse"></div>
            </div>
          </div>

          {isLoadingLive ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-[300px] rounded-xl bg-card border-2 border-primary/20 animate-pulse"></div>)}
            </div>
          ) : liveSpaces?.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-primary/20 rounded-xl">
              <p className="font-mono text-primary/50 text-lg uppercase tracking-widest">Silence on the network.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveSpaces?.map((space) => (
                <SpaceCard key={space.id} space={space} />
              ))}
            </div>
          )}
        </section>

        <section className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-black uppercase tracking-widest text-accent drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
              UPCOMING SPECTACLES
            </h2>
            <div className="h-px bg-accent/30 flex-1"></div>
          </div>

          {isLoadingUpcoming ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[1, 2].map(i => <div key={i} className="h-[300px] rounded-xl bg-card border-2 border-accent/20 animate-pulse"></div>)}
             </div>
          ) : upcomingSpaces?.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-accent/20 rounded-xl">
              <p className="font-mono text-accent/50 text-lg uppercase tracking-widest">Nothing scheduled. Create chaos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingSpaces?.map((space) => (
                <SpaceCard key={space.id} space={space} />
              ))}
            </div>
          )}
        </section>

      </main>

      <UsernameCapture />
    </div>
  );
}
