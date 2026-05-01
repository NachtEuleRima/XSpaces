import { Link } from "wouter";
import { Space, SpaceParticipant } from "@workspace/api-client-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useUsername } from "@/hooks/use-username";

const MAX_AVATARS = 5;

export function SpaceCard({ space }: { space: Space }) {
  const isLive = space.status === "live";
  const { username, saveUsername } = useUsername();

  const handleActionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Track the space visit fire-and-forget if identified
    if (username) {
      saveUsername(username, space.id).catch(() => {});
    }
    window.open(space.spaceUrl, "_blank");
  };


  const primaryColor = isLive ? "hsl(195 100% 50%)" : "hsl(290 90% 62%)";
  const primaryColorFaded = isLive ? "hsl(195 100% 50% / 0.12)" : "hsl(290 90% 62% / 0.12)";
  const primaryColorBorder = isLive ? "hsl(195 100% 50% / 0.3)" : "hsl(290 90% 62% / 0.3)";

  // Co-hosts + speakers only — host is already shown top-left
  // Deduplicate by username in case the API returns the same person in multiple roles
  const seen = new Set<string>();
  const allParticipants: SpaceParticipant[] = [...space.coHosts, ...space.speakers].filter(p => {
    if (!p || seen.has(p.username)) return false;
    seen.add(p.username);
    return true;
  });

  // Audience = total participants minus everyone on stage (host + co-hosts + speakers)
  const onStageCount = 1 + space.coHosts.length + space.speakers.length;
  const audienceCount = Math.max(0, space.listenerCount - onStageCount);

  const visibleAvatars = allParticipants.slice(0, MAX_AVATARS);
  const overflow = allParticipants.length - MAX_AVATARS;

  return (
    <>
      <Link href={`/space/${space.id}`}>
        <motion.div
          whileHover={{ scale: 1.02, translateY: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="block group relative rounded-xl bg-card overflow-hidden cursor-pointer h-full"
          style={{
            border: `1px solid ${primaryColorBorder}`,
            boxShadow: isLive
              ? `0 0 0 1px ${primaryColorFaded}, 0 4px 30px hsl(195 100% 50% / 0.1), 0 0 60px hsl(195 100% 50% / 0.05)`
              : `0 0 0 1px ${primaryColorFaded}, 0 4px 20px hsl(290 90% 62% / 0.06)`,
            animation: isLive ? "neon-pulse 2.5s ease-in-out infinite" : "none",
          }}
        >
          {/* Top accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: `linear-gradient(to right, transparent, ${primaryColor}, transparent)` }}
          />

          <div className="p-5 flex flex-col gap-4 h-full">

            {/* ── Row 1: host avatar (top-left) + title + badge ── */}
            <div className="flex gap-3 items-start">
              {/* Host avatar — prominent top-left bubble */}
              <div className="shrink-0">
                <Avatar
                  className="h-12 w-12"
                  style={{
                    boxShadow: `0 0 0 2px hsl(222 40% 10%), 0 0 12px ${primaryColor}55`,
                    outline: `2px solid ${primaryColorBorder}`,
                    outlineOffset: "1px",
                  }}
                >
                  <AvatarImage src={space.host?.avatarUrl || undefined} alt={space.host?.displayName} />
                  <AvatarFallback
                    className="font-mono text-sm font-bold uppercase"
                    style={{ background: "hsl(222 40% 12%)", color: primaryColor }}
                  >
                    {(space.host?.username ?? "?").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Right side: title + badge + host @username */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h2
                    className="text-base font-black uppercase tracking-tight leading-snug line-clamp-2 flex-1"
                    style={{ color: "hsl(210 20% 96%)" }}
                  >
                    {space.title}
                  </h2>
                  <div className="shrink-0">
                    {isLive ? (
                      <div
                        className="flex items-center gap-1.5 text-[10px] font-mono tracking-[0.15em] font-bold uppercase px-2 py-1 rounded-full whitespace-nowrap"
                        style={{
                          color: "hsl(195 100% 65%)",
                          background: "hsl(195 100% 50% / 0.1)",
                          border: "1px solid hsl(195 100% 50% / 0.3)",
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
                          style={{ background: "hsl(195 100% 50%)", boxShadow: "0 0 6px hsl(195 100% 50%)" }}
                        />
                        LIVE
                      </div>
                    ) : space.scheduledAt ? (
                      <div
                        className="text-[10px] font-mono tracking-[0.05em] px-2 py-1 rounded-full whitespace-nowrap"
                        style={{
                          color: "hsl(290 90% 75%)",
                          background: "hsl(290 90% 62% / 0.1)",
                          border: "1px solid hsl(290 90% 62% / 0.25)",
                        }}
                      >
                        {new Date(space.scheduledAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    ) : null}
                  </div>
                </div>
                <p
                  className="text-[10px] font-mono tracking-[0.1em] mt-1 truncate"
                  style={{ color: primaryColor, opacity: 0.65 }}
                >
                  CMD · @{space.host?.username ?? "unknown"}
                </p>
              </div>
            </div>

            {/* ── Row 3: tags ── */}
            {space.topicTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {space.topicTags.slice(0, 4).map(tag => (
                  <span
                    key={tag}
                    className="text-[9px] font-mono tracking-[0.12em] uppercase px-2 py-0.5 rounded-full"
                    style={{
                      color: primaryColor,
                      background: primaryColorFaded,
                      border: `1px solid ${primaryColorBorder}`,
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* ── Spacer pushes avatar row + CTA to bottom ── */}
            <div className="flex-1" />

            {/* ── Row 4: avatar stack + listener count ── */}
            <div className="flex items-center justify-between">
              {/* Overlapping avatar stack */}
              <div className="flex items-center">
                <div className="flex -space-x-2.5">
                  {visibleAvatars.map((p, i) => (
                    <ParticipantAvatar key={i} participant={p} color={primaryColor} index={i} total={visibleAvatars.length} />
                  ))}
                </div>
                {overflow > 0 && (
                  <span
                    className="ml-2 text-xs font-mono font-bold"
                    style={{ color: primaryColor, opacity: 0.7 }}
                  >
                    +{overflow}
                  </span>
                )}
              </div>

              {/* Audience count — participants minus on-stage speakers */}
              {isLive && audienceCount > 0 && (
                <div className="text-right">
                  <div
                    className="text-lg font-black tabular-nums leading-none"
                    style={{ color: primaryColor }}
                  >
                    {audienceCount.toLocaleString()}
                  </div>
                  <div className="text-[9px] font-mono tracking-[0.2em] text-muted-foreground uppercase mt-0.5">
                    on deck
                  </div>
                </div>
              )}
            </div>

            {/* ── CTA button ── */}
            <button
              onClick={handleActionClick}
              className="w-full py-2.5 rounded-lg font-bold tracking-[0.15em] uppercase text-xs transition-all duration-200"
              style={{
                background: primaryColorFaded,
                border: `1px solid ${primaryColorBorder}`,
                color: primaryColor,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = isLive
                  ? "hsl(195 100% 50% / 0.22)"
                  : "hsl(290 90% 62% / 0.22)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = primaryColorFaded;
              }}
            >
              {isLive ? "OPEN CHANNEL" : "VIEW DETAILS"}
            </button>
          </div>
        </motion.div>
      </Link>

    </>
  );
}

function ParticipantAvatar({
  participant,
  color,
  index,
  total,
}: {
  participant: SpaceParticipant;
  color: string;
  index: number;
  total: number;
}) {
  return (
    <Avatar
      className="h-8 w-8 shrink-0 ring-2"
      style={{
        boxShadow: index === 0
          ? `0 0 0 2px hsl(222 40% 10%), 0 0 8px ${color}50`
          : "0 0 0 2px hsl(222 40% 10%)",
        zIndex: total - index,
      }}
    >
      <AvatarImage src={participant.avatarUrl || undefined} alt={participant.displayName} />
      <AvatarFallback
        className="font-mono text-[10px] font-bold uppercase"
        style={{ background: "hsl(222 40% 12%)", color }}
      >
        {participant.username.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
