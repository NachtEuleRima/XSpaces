import { motion } from 'framer-motion';

export function Scene5() {
  return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-dark"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center px-12 relative z-10">
        <motion.div
          className="text-[4.5vw] font-bold text-text-primary"
          initial={{ opacity: 0, filter: 'blur(20px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1 }}
        >
          before the <motion.span 
            className="text-secondary"
            animate={{ opacity: [1, 0.3, 1, 0.8, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            style={{ textShadow: '0 0 20px var(--color-secondary)' }}
          >
            signal
          </motion.span> fades.
        </motion.div>
        
        <motion.div
          className="mt-8 text-[2vw] text-primary tracking-[0.5em] uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          XCOMS.SPACE
        </motion.div>
      </div>

      {/* Fade out interference pattern */}
      <motion.div 
        className="absolute inset-0 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
        }}
        initial={{ opacity: 0.15 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 4, delay: 1 }}
      />
    </motion.div>
  );
}
