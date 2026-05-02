import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';

export const SCENE_DURATIONS: Record<string, number> = {
  intro: 4000,
  mission: 4000,
  xspaces: 4000,
  broadcasting: 4000,
  fades: 5000,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  intro: Scene1,
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

      {/* LCARS Interface Overlay (Persistent) */}
      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-[2vw]">
        {/* Top bar */}
        <div className="flex w-full h-[5vh]">
          <motion.div className="w-[15vw] h-full bg-secondary rounded-l-full" 
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, ease: "circOut" }} style={{ originX: 0 }} />
          <motion.div className="w-[40vw] h-[2vh] bg-primary ml-[1vw] mt-[3vh]"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.7, ease: "circOut", delay: 0.2 }} style={{ originX: 0 }} />
          <div className="flex-1" />
          <motion.div className="w-[10vw] h-[2vh] bg-accent mt-[3vh] rounded-r-full"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, ease: "circOut", delay: 0.4 }} style={{ originX: 1 }} />
        </div>
        
        {/* Left sidebar */}
        <div className="absolute left-[2vw] top-[8vh] bottom-[8vh] w-[8vw] flex flex-col gap-[1vh]">
           <motion.div className="w-full bg-secondary rounded-tr-[3vw] flex-1"
             initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.8, ease: "circOut" }} style={{ originY: 0 }} />
           <motion.div className="w-full h-[5vh] bg-[#FFCC00]" 
             animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
           <motion.div className="w-full bg-primary flex-1"
             initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.8, ease: "circOut", delay: 0.3 }} style={{ originY: 1 }} />
           <motion.div className="w-full h-[15vh] bg-accent rounded-br-[3vw] flex items-end justify-center pb-2 text-black font-bold text-[1vw]"
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
             402-9
           </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="flex w-full h-[5vh] items-end ml-[9vw] pl-[1vw] pr-[9vw]">
          <motion.div className="w-[30vw] h-[2vh] bg-primary rounded-l-full"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6, ease: "circOut", delay: 0.5 }} style={{ originX: 0 }} />
          <motion.div className="w-[15vw] h-full bg-secondary ml-[1vw]"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.4, ease: "circOut", delay: 0.7 }} style={{ originX: 0 }} />
        </div>
      </div>

      <div className="absolute inset-0 ml-[12vw] mt-[8vh] mb-[8vh] mr-[2vw] overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          {SceneComponent && <SceneComponent key={currentSceneKey} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
