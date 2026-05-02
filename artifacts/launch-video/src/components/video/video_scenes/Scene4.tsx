import { motion } from 'framer-motion';

const words = "Know who's broadcasting".split(" ");

export function Scene4() {
  return (
    <motion.div className="absolute inset-0 flex items-center justify-center bg-bg-dark/80"
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center px-12 max-w-6xl w-full">
        <h2 className="text-[5vw] font-bold flex justify-center gap-6">
          {words.map((word, i) => (
            <div key={i} className="relative overflow-hidden">
              <motion.span
                className="inline-block"
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.6, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ 
                  color: i === 2 ? 'var(--color-accent)' : 'var(--color-text-primary)',
                  textShadow: i === 2 ? '0 0 20px var(--color-accent)' : 'none'
                }}
              >
                {word}
              </motion.span>
            </div>
          ))}
        </h2>
      </div>

      {/* Signal pulse circles */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-accent/30"
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: '100vw', height: '100vw', opacity: 0 }}
            transition={{ duration: 3, delay: i * 1, repeat: Infinity, ease: "easeOut" }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
