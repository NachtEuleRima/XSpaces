import { useGetSpaceStats, useGetVisitorCount } from "@workspace/api-client-react";
import { motion } from "framer-motion";

export function StatsTicker() {
  const { data: stats } = useGetSpaceStats({ query: { refetchInterval: 30000 } });
  const { data: visitors } = useGetVisitorCount({ query: { refetchInterval: 30000 } });

  const items = [
    { label: "ACTIVE CHANNELS", value: stats?.totalSpaces ?? 0, highlight: false },
    { label: "ON AIR", value: stats?.liveCount ?? 0, highlight: true },
    { label: "INCOMING", value: stats?.upcomingCount ?? 0, highlight: false },
    { label: "CREW ABOARD", value: stats?.totalListeners ?? 0, highlight: false },
    { label: "UNIQUE CREW", value: visitors?.count ?? 0, highlight: false },
  ];

  // Quadruple for extra-smooth seamless loop
  const looped = [...items, ...items, ...items, ...items];

  return (
    <div
      className="w-full overflow-hidden py-3 font-mono text-xs tracking-[0.2em] uppercase relative z-10"
      style={{
        background: "linear-gradient(to right, hsl(195 100% 50% / 0.08), hsl(290 90% 62% / 0.08))",
        borderTop: "1px solid hsl(195 100% 50% / 0.2)",
        borderBottom: "1px solid hsl(195 100% 50% / 0.2)",
        maskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
      }}
    >
      <motion.div
        className="flex whitespace-nowrap items-center"
        animate={{ x: ["0%", "-25%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {looped.map((item, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span className="text-foreground/40 mr-3">{item.label}:</span>
            <span
              className={item.highlight ? "font-black" : "font-bold"}
              style={{
                color: item.highlight ? "hsl(195 100% 65%)" : "hsl(195 100% 50%)",
                textShadow: item.highlight ? "0 0 12px hsl(195 100% 50% / 0.8)" : "none",
              }}
            >
              {item.value.toLocaleString()}
            </span>
            <span className="mx-8 text-foreground/20">◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
