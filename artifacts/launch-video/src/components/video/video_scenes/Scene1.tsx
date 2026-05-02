import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1500),
      setTimeout(() => setPhase(4), 2000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-dark"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative z-10 text-center flex flex-col items-center gap-6">
        <motion.div 
          className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        <div className="font-mono text-2xl tracking-widest text-primary uppercase">
          <motion.span
            initial={{ opacity: 0 }}
            animate={phase >= 1 ? { opacity: [0, 1, 0.5, 1] } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            Establishing
          </motion.span>{' '}
          <motion.span
            initial={{ opacity: 0 }}
            animate={phase >= 2 ? { opacity: [0, 1, 0.5, 1] } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-secondary"
          >
            Subspace
          </motion.span>{' '}
          <motion.span
            initial={{ opacity: 0 }}
            animate={phase >= 3 ? { opacity: [0, 1, 0.5, 1] } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-accent"
          >
            Lock
          </motion.span>
        </div>

        <motion.div 
          className="h-1 bg-primary w-0"
          initial={{ width: 0 }}
          animate={phase >= 4 ? { width: '20vw' } : { width: 0 }}
          transition={{ duration: 0.8, ease: "circOut" }}
        />
      </div>
    </motion.div>
  );
}
