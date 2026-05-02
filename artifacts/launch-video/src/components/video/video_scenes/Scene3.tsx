import { motion } from 'framer-motion';

export function Scene3() {
  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center px-12 relative z-10">
        <motion.div
          className="text-[6vw] font-display uppercase tracking-tighter"
          initial={{ letterSpacing: '0.5em', opacity: 0 }}
          animate={{ letterSpacing: '0em', opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <span className="text-text-primary">for </span>
          <motion.span 
            className="text-accent"
            animate={{ 
              color: ['var(--color-accent)', 'var(--color-primary)', 'var(--color-accent)'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            X Spaces.
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}
