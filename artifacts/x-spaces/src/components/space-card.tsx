import { useState } from "react";
import { Link } from "wouter";
import { Space, SpaceParticipant } from "@workspace/api-client-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { UsernameModal } from "./username-modal";
import { useUsername } from "@/hooks/use-username";

export function SpaceCard({ space }: { space: Space }) {
  const isLive = space.status === "live";
  const [modalOpen, setModalOpen] = useState(false);
  const { username } = useUsername();

  const handleActionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!username) {
      setModalOpen(true);
    } else {
      window.open(space.spaceUrl, "_blank");
    }
  };

  const handleModalSuccess = () => {
    window.open(space.spaceUrl, "_blank");
  };

  // Cyan for live, magenta for upcoming
  const primaryColor = isLive
    ? "hsl(195 100% 50%)"
    : "hsl(290 90% 62%)";
  const primaryColorFaded = isLive
    ? "hsl(195 100% 50% / 0.15)"
    : "hsl(290 90% 62% / 0.15)";
  const primaryColorBorder = isLive
    ? "hsl(195 100% 50% / 0.35)"
    : "hsl(290 90% 62% / 0.35)";

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
              ? `0 0 0 1px ${primaryColorFaded}, 0 4px 30px hsl(195 100% 50% / 0.12), 0 0 60px hsl(195 100% 50% / 0.06)`
              : `0 0 0 1px ${primaryColorFaded}, 0 4px 20px hsl(290 90% 62% / 0.08)`,
            animation: isLive ? "neon-pulse 2.5s ease-in-out infinite" : "none",
          }}
        >
          {/* Top color bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: `linear-gradient(to right, transparent, ${primaryColor}, transparent)` }}
          />

          {/* Status badge */}
          <div className="absolute top-4 right-4 z-10">
            {isLive ? (
              <div
                className="flex items-center gap-1.5 text-xs font-mono tracking-[0.15em] font-bold uppercase px-2.5 py-1 rounded-full"
                style={{
                  color: "hsl(195 100% 65%)",
                  background: "hsl(195 100% 50% / 0.1)",
                  border: "1px solid hsl(195 100% 50% / 0.3)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: "hsl(195 100% 50%)", boxShadow: "0 0 6px hsl(195 100% 50%)" }}
                />
                LIVE
              </div>
            ) : space.scheduledAt ? (
              <div
                className="text-xs font-mono tracking-[0.1em] px-2.5 py-1 rounded-full"
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

          <div className="p-6 flex flex-col gap-5">
            {/* Title */}
            <div className="pr-16">
              <h2
                className="text-xl font-black uppercase tracking-tight leading-tight line-clamp-2 transition-colors"
                style={{ color: "hsl(210 20% 96%)" }}
              >
                {space.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2 font-mono leading-relaxed">
                {space.description}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {space.topicTags.map(tag => (
                <span
                  key={tag}
                  className="text-[10px] font-mono tracking-[0.15em] uppercase px-2.5 py-1 rounded-full"
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

            {/* Participants */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Host */}
                <ParticipantAvatar participant={space.host} size="lg" color={primaryColor} />
                {/* Co-hosts */}
                {space.coHosts.slice(0, 2).map((p, i) => (
                  <ParticipantAvatar key={i} participant={p} size="md" color={primaryColor} />
                ))}
                {/* Speakers */}
                {space.speakers.slice(0, 3).map((p, i) => (
                  <ParticipantAvatar key={i} participant={p} size="sm" color={primaryColor} />
                ))}
                {space.speakers.length > 3 && (
                  <span className="text-xs font-mono text-muted-foreground ml-1">
                    +{space.speakers.length - 3}
                  </span>
                )}
              </div>
              {isLive && (
                <div className="text-right">
                  <div
                    className="text-lg font-black tabular-nums"
                    style={{ color: primaryColor }}
                  >
                    {space.listenerCount.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-mono tracking-[0.15em] text-muted-foreground uppercase">
                    listening
                  </div>
                </div>
              )}
            </div>

            {/* CTA */}
            <button
              onClick={handleActionClick}
              className="w-full py-3 rounded-lg font-bold tracking-[0.15em] uppercase text-sm transition-all duration-200 mt-1"
              style={{
                background: isLive
                  ? "linear-gradient(135deg, hsl(195 100% 50% / 0.15), hsl(195 100% 50% / 0.08))"
                  : "linear-gradient(135deg, hsl(290 90% 62% / 0.15), hsl(290 90% 62% / 0.08))",
                border: `1px solid ${primaryColorBorder}`,
                color: primaryColor,
              }}
              onMouseEnter={e => {
                (e.target as HTMLButtonElement).style.background = isLive
                  ? "hsl(195 100% 50% / 0.25)"
                  : "hsl(290 90% 62% / 0.25)";
              }}
              onMouseLeave={e => {
                (e.target as HTMLButtonElement).style.background = isLive
                  ? "linear-gradient(135deg, hsl(195 100% 50% / 0.15), hsl(195 100% 50% / 0.08))"
                  : "linear-gradient(135deg, hsl(290 90% 62% / 0.15), hsl(290 90% 62% / 0.08))";
              }}
            >
              {isLive ? "JOIN THE SPACE" : "VIEW DETAILS"}
            </button>
          </div>
        </motion.div>
      </Link>
      <UsernameModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={handleModalSuccess}
        spaceId={space.id}
      />
    </>
  );
}

function ParticipantAvatar({
  participant,
  size,
  color,
}: {
  participant: SpaceParticipant;
  size: "sm" | "md" | "lg";
  color: string;
}) {
  const sizeClasses = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-11 w-11",
  };

  return (
    <Avatar
      className={`${sizeClasses[size]} shrink-0`}
      style={{
        ring: "2px solid " + color,
        outline: `2px solid ${color}`,
        outlineOffset: "1px",
        boxShadow: `0 0 8px ${color}40`,
      }}
    >
      <AvatarImage src={participant.avatarUrl || undefined} alt={participant.displayName} />
      <AvatarFallback
        className="font-mono text-xs font-bold uppercase"
        style={{
          background: "hsl(222 40% 12%)",
          color: color,
        }}
      >
        {participant.username.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
