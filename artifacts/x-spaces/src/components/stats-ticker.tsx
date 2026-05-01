import { useGetSpaceStats, useGetVisitorCount, getGetSpaceStatsQueryKey, getGetVisitorCountQueryKey } from "@workspace/api-client-react";

export function StatsTicker() {
  const { data: stats } = useGetSpaceStats({ query: { queryKey: getGetSpaceStatsQueryKey(), refetchInterval: 30000 } });
  const { data: visitors } = useGetVisitorCount({ query: { queryKey: getGetVisitorCountQueryKey(), refetchInterval: 30000 } });

  const loaded = stats !== undefined && visitors !== undefined;

  const items = [
    { label: "ACTIVE CHANNELS", value: stats?.totalSpaces ?? 0, highlight: false },
    { label: "ON AIR", value: stats?.liveCount ?? 0, highlight: true },
    { label: "INCOMING", value: stats?.upcomingCount ?? 0, highlight: false },
    { label: "CREW ABOARD", value: stats?.totalListeners ?? 0, highlight: false },
    { label: "UNIQUE CREW", value: visitors?.count ?? 0, highlight: false },
  ];

  // 4 copies so track is always much wider than viewport.
  // Animation moves -50% = exactly 2 copies, reset is always off-screen.
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
      {/* Only animate once data is loaded so track width is stable */}
      <div className={loaded ? "ticker-track" : ""} style={{ display: "flex", whiteSpace: "nowrap", alignItems: "center" }}>
        {looped.map((item, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <span style={{ color: "hsl(195 100% 50% / 0.4)", marginRight: "0.75rem" }}>{item.label}:</span>
            <span
              style={{
                fontWeight: item.highlight ? 900 : 700,
                color: item.highlight ? "hsl(195 100% 65%)" : "hsl(195 100% 50%)",
                textShadow: item.highlight ? "0 0 12px hsl(195 100% 50% / 0.8)" : "none",
                minWidth: "4ch",
                display: "inline-block",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {item.value.toLocaleString()}
            </span>
            <span style={{ margin: "0 2rem", color: "hsl(195 100% 50% / 0.2)" }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
