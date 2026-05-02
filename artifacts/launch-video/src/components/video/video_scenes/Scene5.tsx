import { motion } from 'framer-motion';

export function Scene5() {
  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center px-12 relative z-10">
        <motion.div
          className="text-[4vw] font-display uppercase tracking-widest text-text-primary"
          initial={{ opacity: 0, filter: 'blur(20px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1 }}
        >
          before the <motion.span 
            className="text-secondary"
            animate={{ opacity: [1, 0.2, 1, 0.7, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          >
            signal
          </motion.span> fades.
        </motion.div>
      </div>

      <motion.div 
        className="absolute inset-0 bg-white mix-blend-overlay pointer-events-none"
        animate={{ opacity: [0, 0.1, 0, 0.2, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
}
