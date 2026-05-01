import { useGetSpaceStats, useGetVisitorCount } from "@workspace/api-client-react";
import { motion } from "framer-motion";

export function StatsTicker() {
  const { data: stats } = useGetSpaceStats({ query: { refetchInterval: 30000 }});
  const { data: visitors } = useGetVisitorCount({ query: { refetchInterval: 30000 }});

  return (
    <div className="w-full bg-primary/10 border-y border-primary/30 overflow-hidden py-3 font-mono text-sm tracking-widest uppercase relative shadow-[0_0_20px_rgba(255,0,128,0.2)]">
      <motion.div 
        animate={{ x: ["0%", "-100%"] }}
        transition={{ ease: "linear", duration: 20, repeat: Infinity }}
        className="flex whitespace-nowrap gap-16 text-primary items-center"
      >
        <TickerItem label="TOTAL SPACES" value={stats?.totalSpaces || 0} />
        <TickerItem label="LIVE NOW" value={stats?.liveCount || 0} highlight />
        <TickerItem label="UPCOMING" value={stats?.upcomingCount || 0} />
        <TickerItem label="TOTAL LISTENERS" value={stats?.totalListeners || 0} />
        <TickerItem label="UNIQUE DEGENS" value={visitors?.count || 0} />
        
        <TickerItem label="TOTAL SPACES" value={stats?.totalSpaces || 0} />
        <TickerItem label="LIVE NOW" value={stats?.liveCount || 0} highlight />
        <TickerItem label="UPCOMING" value={stats?.upcomingCount || 0} />
        <TickerItem label="TOTAL LISTENERS" value={stats?.totalListeners || 0} />
        <TickerItem label="UNIQUE DEGENS" value={visitors?.count || 0} />
      </motion.div>
    </div>
  );
}

function TickerItem({ label, value, highlight }: { label: string, value: number, highlight?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className="opacity-70">{label}:</span>
      <span className={`font-black ${highlight ? 'text-white animate-pulse' : 'text-primary'}`}>
        {value.toLocaleString()}
      </span>
      <span className="mx-8 text-primary/30">///</span>
    </span>
  );
}
