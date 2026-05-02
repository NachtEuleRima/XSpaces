import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useVideoPlayer } from '@/lib/video';
import { useStarTrekAudio } from '@/lib/audio/useStarTrekAudio';
import { Scene1 } from './video_scenes/Scene1';
import { SceneStardate } from './video_scenes/SceneStardate';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';

export const SCENE_DURATIONS: Record<string, number> = {
  intro: 4000,
  stardate: 5000,
  mission: 4000,
  xspaces: 4000,
  broadcasting: 4000,
  fades: 5000,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  intro: Scene1,
  stardate: SceneStardate,
  mission: Scene2,
  xspaces: Scene3,
  broadcasting: Scene4,
  fades: Scene5,
};

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentScene, currentSceneKey } = useVideoPlayer({ durations, loop });
  const { muted, toggleMute } = useStarTrekAudio();

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '') as keyof typeof SCENE_DURATIONS;
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-text-primary font-body">
      {/* Background space image */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/nebula.png)` }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 1, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />

      {/* Moving stars overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0,0,0,0)), radial-gradient(2px 2px at 90px 40px, #ffffff, rgba(0,0,0,0))', backgroundSize: '200px 200px' }}
          animate={{ backgroundPosition: ['0px 0px', '200px 200px'] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* LCARS top + bottom accent bars only — no side framing */}
      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between py-[2vh] px-[3vw]">
        <div className="flex w-full h-[4px] items-center gap-[1vw]">
          <motion.div className="h-full bg-secondary rounded-full"
            initial={{ width: 0 }} animate={{ width: '18vw' }} transition={{ duration: 0.6, ease: "circOut" }} />
          <motion.div className="h-full bg-primary rounded-full flex-1"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, ease: "circOut", delay: 0.2 }} style={{ originX: 0 }} />
          <motion.div className="h-full bg-accent rounded-full"
            initial={{ width: 0 }} animate={{ width: '8vw' }} transition={{ duration: 0.5, ease: "circOut", delay: 0.4 }} />
        </div>
        <div className="flex w-full h-[4px] items-center gap-[1vw]">
          <motion.div className="h-full bg-primary rounded-full"
            initial={{ width: 0 }} animate={{ width: '8vw' }} transition={{ duration: 0.5, ease: "circOut", delay: 0.5 }} />
          <motion.div className="h-full bg-secondary rounded-full flex-1"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, ease: "circOut", delay: 0.6 }} style={{ originX: 0 }} />
          <motion.div className="h-full bg-accent rounded-full"
            initial={{ width: 0 }} animate={{ width: '14vw' }} transition={{ duration: 0.6, ease: "circOut", delay: 0.7 }} />
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          {SceneComponent && <SceneComponent key={currentSceneKey} />}
        </AnimatePresence>
      </div>

      {/* Mute toggle */}
      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 z-30 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 text-white/50 hover:text-white hover:bg-black/60 transition-colors"
        title={muted ? 'Unmute' : 'Mute'}
        aria-label={muted ? 'Unmute audio' : 'Mute audio'}
      >
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

      {/* Watermark */}
      <div className="absolute bottom-10 right-4 z-20 pointer-events-none">
        <img
          src={`${import.meta.env.BASE_URL}watermark.png`}
          alt="@RimaSukhadia"
          className="w-[180px] opacity-60"
          style={{ imageRendering: 'auto' }}
        />
      </div>
    </div>
  );
}
