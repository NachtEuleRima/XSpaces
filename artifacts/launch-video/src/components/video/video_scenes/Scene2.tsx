import { motion } from 'framer-motion';

const words = "Your personal mission control".split(" ");

export function Scene2() {
  return (
    <motion.div className="absolute inset-0 flex items-center justify-center bg-bg-dark/80"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center px-12 max-w-5xl">
        <h1 className="text-[5vw] font-bold leading-tight flex flex-wrap justify-center gap-4">
          {words.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)', color: 'var(--color-text-primary)' }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                filter: 'blur(0px)',
                color: [
                  'var(--color-primary)', 
                  'var(--color-secondary)', 
                  'var(--color-accent)', 
                  'var(--color-text-primary)'
                ]
              }}
              transition={{ 
                duration: 1, 
                delay: i * 0.4,
                color: { duration: 0.8, delay: i * 0.4 + 0.2, times: [0, 0.3, 0.6, 1] }
              }}
              style={{ textShadow: '0 0 20px currentColor' }}
            >
              {word}
            </motion.span>
          ))}
        </h1>
      </div>
      
      {/* Decorative scanning line */}
      <motion.div 
        className="absolute left-0 right-0 h-[2px] bg-primary/50 shadow-[0_0_15px_var(--color-primary)]"
        initial={{ top: '0%' }}
        animate={{ top: '100%' }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  );
}
