import { useGetSpaceStats, useGetVisitorCount } from "@workspace/api-client-react";
import { motion } from "framer-motion";

export function StatsTicker() {
  const { data: stats } = useGetSpaceStats({ query: { refetchInterval: 30000 } });
  const { data: visitors } = useGetVisitorCount({ query: { refetchInterval: 30000 } });

  const items = [
    { label: "TOTAL SPACES", value: stats?.totalSpaces ?? 0, highlight: false },
    { label: "LIVE NOW", value: stats?.liveCount ?? 0, highlight: true },
    { label: "UPCOMING", value: stats?.upcomingCount ?? 0, highlight: false },
    { label: "TOTAL LISTENERS", value: stats?.totalListeners ?? 0, highlight: false },
    { label: "UNIQUE ATTENDEES", value: visitors?.count ?? 0, highlight: false },
  ];

  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div
      className="w-full overflow-hidden py-3 font-mono text-xs tracking-[0.2em] uppercase relative z-10"
      style={{
        background: "linear-gradient(to right, hsl(195 100% 50% / 0.08), hsl(290 90% 62% / 0.08))",
        borderTop: "1px solid hsl(195 100% 50% / 0.2)",
        borderBottom: "1px solid hsl(195 100% 50% / 0.2)",
      }}
    >
      <div
        className="flex whitespace-nowrap gap-16 items-center"
        style={{ animation: "ticker 30s linear infinite" }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-3 shrink-0">
            <span className="text-foreground/40">{item.label}:</span>
            <span
              className={item.highlight ? "font-black" : "font-bold"}
              style={{
                color: item.highlight ? "hsl(195 100% 65%)" : "hsl(195 100% 50%)",
                textShadow: item.highlight ? "0 0 12px hsl(195 100% 50% / 0.8)" : "none",
              }}
            >
              {item.value.toLocaleString()}
            </span>
            <span className="text-foreground/20 mx-4">—</span>
          </span>
        ))}
      </div>
    </div>
  );
}
