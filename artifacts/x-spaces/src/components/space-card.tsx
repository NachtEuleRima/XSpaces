import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Space, SpaceParticipant } from "@workspace/api-client-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { UsernameModal } from "./username-modal";
import { useUsername } from "@/hooks/use-username";

export function SpaceCard({ space }: { space: Space }) {
  const isLive = space.status === "live";
  const isUpcoming = space.status === "upcoming";
  const [modalOpen, setModalOpen] = useState(false);
  const { username } = useUsername();

  const handleActionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!username) {
      setModalOpen(true);
    } else {
      window.location.href = space.spaceUrl;
    }
  };

  const handleModalSuccess = () => {
    window.location.href = space.spaceUrl;
  };

  const ringColor = isLive ? "ring-primary" : "ring-accent";
  const glowShadow = isLive ? "shadow-[0_0_30px_-5px_rgba(255,0,128,0.5)]" : "shadow-[0_0_15px_-5px_rgba(0,255,255,0.3)]";

  return (
    <>
      <Link href={`/space/${space.id}`}>
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className={`block group relative rounded-xl border-2 ${isLive ? 'border-primary animate-neon-pulse' : 'border-accent/50'} bg-card p-6 ${glowShadow} overflow-hidden cursor-pointer`}
        >
          {isLive && (
            <div className="absolute top-0 right-0 p-4">
              <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest animate-pulse">
                <span className="h-2 w-2 rounded-full bg-primary" />
                LIVE
              </div>
            </div>
          )}

          {isUpcoming && space.scheduledAt && (
            <div className="absolute top-0 right-0 p-4">
              <div className="text-accent font-mono text-xs opacity-70">
                {new Date(space.scheduledAt).toLocaleString()}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                {space.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2 font-mono">
                {space.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {space.topicTags.map(tag => (
                <Badge key={tag} variant="outline" className={`bg-transparent border-${isLive ? 'primary' : 'accent'}/50 text-${isLive ? 'primary' : 'accent'} uppercase text-xs tracking-wider`}>
                  #{tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-2">
              <div className="flex -space-x-4">
                <ParticipantAvatar participant={space.host} size="lg" ringColor={ringColor} />
                {space.coHosts.slice(0, 2).map((p, i) => (
                  <ParticipantAvatar key={i} participant={p} size="md" ringColor={ringColor} />
                ))}
                {space.speakers.slice(0, 3).map((p, i) => (
                  <ParticipantAvatar key={i} participant={p} size="sm" ringColor={ringColor} />
                ))}
              </div>
              <div className="text-xs font-mono text-muted-foreground">
                <span className="text-foreground font-bold">{space.listenerCount.toLocaleString()}</span> LISTENING
              </div>
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleActionClick}
                className={`w-full font-bold tracking-widest uppercase ${isLive ? 'bg-primary text-primary-foreground hover:bg-primary/80' : 'bg-accent text-accent-foreground hover:bg-accent/80'}`}
              >
                {isLive ? "JOIN THE CHAOS" : "SET REMINDER"}
              </Button>
            </div>
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

function ParticipantAvatar({ participant, size, ringColor }: { participant: SpaceParticipant, size: "sm" | "md" | "lg", ringColor: string }) {
  const sizeClasses = {
    sm: "h-8 w-8 z-10",
    md: "h-10 w-10 z-20",
    lg: "h-14 w-14 z-30"
  };

  return (
    <Avatar className={`${sizeClasses[size]} ring-2 ${ringColor} bg-background`}>
      <AvatarImage src={participant.avatarUrl || undefined} alt={participant.displayName} />
      <AvatarFallback className="font-mono text-xs font-bold uppercase bg-background text-foreground">
        {participant.username.slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
}
