import { motion } from 'framer-motion';

const words = "Know who's broadcasting".split(" ");

export function Scene4() {
  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center px-12 max-w-6xl w-full relative z-10">
        <h2 className="text-[4.5vw] font-display uppercase tracking-widest flex justify-center gap-[2vw]">
          {words.map((word, i) => (
            <div key={i} className="relative overflow-hidden">
              <motion.span
                className="inline-block text-primary"
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.6, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {word}
              </motion.span>
            </div>
          ))}
        </h2>
      </div>

      {/* Radar rings */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-accent/40"
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: '80vw', height: '80vw', opacity: 0 }}
            transition={{ duration: 4, delay: i * 2, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
