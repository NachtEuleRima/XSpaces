import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 3000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative z-10 text-center flex flex-col items-center gap-6">
        <motion.div 
          className="text-[1.5vw] text-accent tracking-[0.5em] uppercase font-mono mb-[2vh]"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        >
          System Initialize
        </motion.div>
        
        <motion.div
          className="font-display text-[4vw] tracking-widest text-primary uppercase flex gap-4"
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          animate={phase >= 2 ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          transition={{ duration: 1.5, ease: "circOut" }}
        >
          <span>STARDATE</span>
          <span className="text-secondary">{new Date().getFullYear() + 300}.1</span>
        </motion.div>

        <motion.div 
          className="h-[2px] bg-primary"
          initial={{ width: 0 }}
          animate={phase >= 3 ? { width: '30vw' } : { width: 0 }}
          transition={{ duration: 1, ease: "circOut" }}
        />
      </div>
    </motion.div>
  );
}
