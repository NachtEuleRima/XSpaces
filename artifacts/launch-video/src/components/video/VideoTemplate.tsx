import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';

export const SCENE_DURATIONS: Record<string, number> = {
  init: 3000,
  line1a: 4000,
  line1b: 4000,
  line2a: 4000,
  line2b: 5000,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  init: Scene1,
  line1a: Scene2,
  line1b: Scene3,
  line2a: Scene4,
  line2b: Scene5,
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
  const sceneIndex = Object.keys(SCENE_DURATIONS).indexOf(baseSceneKey);
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-bg-dark text-text-primary font-mono">
      {/* Persistent background layers */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 229, 245, 0.2) 2px, rgba(0, 229, 245, 0.2) 4px)',
        backgroundSize: '100% 4px'
      }} />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(0, 229, 245, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 245, 0.3) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Floating neon orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none mix-blend-screen">
        <motion.div className="absolute w-[60vw] h-[60vw] rounded-full blur-[100px] opacity-20"
          style={{ background: 'radial-gradient(circle, var(--color-primary), transparent 70%)' }}
          animate={{
            x: ['-10vw', '40vw', '-10vw'],
            y: ['10vh', '50vh', '10vh'],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="absolute w-[50vw] h-[50vw] rounded-full blur-[100px] opacity-20"
          style={{ background: 'radial-gradient(circle, var(--color-secondary), transparent 70%)' }}
          animate={{
            x: ['50vw', '10vw', '50vw'],
            y: ['50vh', '-10vh', '50vh'],
            scale: [1.2, 1, 1.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <AnimatePresence initial={false} mode="wait">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>

      {/* suppress unused sceneIndex lint warning */}
      <span style={{ display: 'none' }}>{sceneIndex}</span>
    </div>
  );
}
