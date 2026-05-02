import { motion } from 'framer-motion';

export function Scene3() {
  return (
    <motion.div className="absolute inset-0 flex items-center justify-center bg-bg-dark/80"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center px-12">
        <motion.div
          className="text-[7vw] font-black uppercase tracking-tighter"
          initial={{ letterSpacing: '0.5em', opacity: 0 }}
          animate={{ letterSpacing: '0em', opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <span className="text-text-primary">for </span>
          <motion.span 
            className="text-primary"
            animate={{ 
              color: ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-primary)'],
              textShadow: [
                '0 0 20px var(--color-primary)',
                '0 0 40px var(--color-secondary)',
                '0 0 20px var(--color-primary)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            X Spaces.
          </motion.span>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-[20%] w-[40vw] h-[1px] bg-gradient-to-r from-transparent via-secondary to-transparent"
        animate={{ 
          scaleX: [0, 1, 0],
          opacity: [0, 1, 0]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
