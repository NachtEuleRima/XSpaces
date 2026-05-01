import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { useGetSpace } from "@workspace/api-client-react";
import { getGetSpaceQueryKey } from "@workspace/api-client-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUsername } from "@/hooks/use-username";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Clock, Radio, Play } from "lucide-react";

export default function SpaceDetail() {
  const params = useParams();
  const id = Number(params.id);
  const { data: space, isLoading } = useGetSpace(id, { query: { enabled: !!id, queryKey: getGetSpaceQueryKey(id) } });
  
  const { username, saveUsername } = useUsername();

  const handleActionClick = () => {
    if (!space) return;
    if (username) saveUsername(username, space.id).catch(() => {});
    window.location.href = space.spaceUrl;
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center font-mono text-primary animate-pulse text-2xl uppercase tracking-widest">Loading...</div>;
  }

  if (!space) {
    return <div className="min-h-screen bg-background flex flex-col items-center justify-center font-mono text-destructive uppercase tracking-widest">
      <h1 className="text-4xl mb-4">404 - SPACE NOT FOUND</h1>
      <Link href="/" className="text-accent hover:underline">RETURN TO BASE</Link>
    </div>;
  }

  const isLive = space.status === "live";
  const themeColor = isLive ? "primary" : "accent";

  return (
    <div className="min-h-[100dvh] bg-background text-foreground relative overflow-x-hidden">
      {/* Noise and glow */}
      <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-50"></div>
      <div className={`fixed top-[10%] right-[-20%] w-[70%] h-[70%] bg-${themeColor}/10 blur-[150px] rounded-full pointer-events-none`}></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <Link href="/" className={`inline-flex items-center gap-2 text-muted-foreground hover:text-${themeColor} font-mono text-sm uppercase tracking-wider mb-8 transition-colors`}>
          <ArrowLeft size={16} /> BACK TO BRIDGE
        </Link>

        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border-2 border-${themeColor}/50 bg-card rounded-2xl p-8 md:p-12 shadow-[0_0_50px_rgba(var(--${themeColor}-rgb),0.1)] relative overflow-hidden`}
          >
            {isLive && (
              <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-neon-pulse"></div>
            )}

            <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <Badge variant="outline" className={`bg-${themeColor}/10 text-${themeColor} border-${themeColor}/50 px-4 py-1 text-sm tracking-widest uppercase`}>
                    {isLive ? <><Radio size={14} className="mr-2 animate-pulse" /> LIVE TRANSMISSION</> : <><Clock size={14} className="mr-2" /> INCOMING</>}
                  </Badge>
                  {space.scheduledAt && !isLive && (
                    <span className="font-mono text-sm text-muted-foreground">
                      {new Date(space.scheduledAt).toLocaleString()}
                    </span>
                  )}
                </div>

                <h1 className={`text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-6 leading-none drop-shadow-[0_0_20px_rgba(var(--${themeColor}-rgb),0.5)]`}>
                  {space.title}
                </h1>
                
                <p className="text-xl text-muted-foreground font-mono mb-8 leading-relaxed">
                  {space.description}
                </p>

                <div className="flex flex-wrap gap-3 mb-10">
                  {space.topicTags.map(tag => (
                    <span key={tag} className={`text-sm font-bold text-${themeColor} bg-${themeColor}/5 border border-${themeColor}/20 px-3 py-1 rounded-sm uppercase tracking-wider`}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-auto shrink-0 bg-black/40 border border-border rounded-xl p-6 flex flex-col items-center justify-center min-w-[250px]">
                <div className="text-center mb-6">
                  <div className={`text-5xl font-black text-${themeColor} mb-2`}>{space.listenerCount.toLocaleString()}</div>
                  <div className="font-mono text-xs text-muted-foreground tracking-widest uppercase flex items-center justify-center gap-2">
                    <Users size={14} /> DEGENS TUNED IN
                  </div>
                </div>
                
                <Button 
                  size="lg"
                  onClick={handleActionClick}
                  className={`w-full h-16 text-lg font-black tracking-widest uppercase bg-${themeColor} text-${themeColor}-foreground hover:bg-${themeColor}/80 shadow-[0_0_30px_rgba(var(--${themeColor}-rgb),0.4)] transition-all hover:scale-105 active:scale-95`}
                >
                  {isLive ? <><Play size={20} className="mr-2" /> JOIN SPACE</> : "SET REMINDER"}
                </Button>
              </div>
            </div>

            <div className="mt-12 pt-12 border-t border-border">
              <h3 className="text-xl font-black uppercase tracking-widest text-white mb-8 flex items-center gap-4">
                THE LINEUP
                <div className="h-px bg-border flex-1"></div>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Host */}
                <div className="flex items-center gap-4">
                  <Avatar className={`h-16 w-16 ring-2 ring-${themeColor}`}>
                    <AvatarImage src={space.host.avatarUrl || undefined} />
                    <AvatarFallback className="font-mono bg-black text-white">{space.host.username.slice(0,2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold text-white truncate max-w-[150px]">{space.host.displayName}</div>
                    <div className="font-mono text-xs text-muted-foreground">@{space.host.username}</div>
                    <div className={`text-[10px] font-bold text-${themeColor} uppercase tracking-widest mt-1`}>COMMANDER</div>
                  </div>
                </div>

                {/* Co-hosts */}
                {space.coHosts.map((p, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Avatar className={`h-14 w-14 ring-1 ring-${themeColor}/70`}>
                      <AvatarImage src={p.avatarUrl || undefined} />
                      <AvatarFallback className="font-mono bg-black text-white">{p.username.slice(0,2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold text-white/90 truncate max-w-[150px]">{p.displayName}</div>
                      <div className="font-mono text-xs text-muted-foreground">@{p.username}</div>
                      <div className={`text-[10px] font-bold text-${themeColor}/70 uppercase tracking-widest mt-1`}>FIRST OFFICER</div>
                    </div>
                  </div>
                ))}

                {/* Speakers */}
                {space.speakers.map((p, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Avatar className={`h-12 w-12 ring-1 ring-border opacity-80`}>
                      <AvatarImage src={p.avatarUrl || undefined} />
                      <AvatarFallback className="font-mono bg-black text-white">{p.username.slice(0,2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold text-white/70 truncate max-w-[150px]">{p.displayName}</div>
                      <div className="font-mono text-xs text-muted-foreground">@{p.username}</div>
                      <div className={`text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1`}>CREW</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        </div>
      </div>

    </div>
  );
}
