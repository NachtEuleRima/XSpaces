import { motion } from 'framer-motion';

const words = ["Know", "who's", "broadcasting"];

export function Scene4() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center px-12 max-w-5xl relative z-10">
        <h2 className="text-[5.5vw] font-display uppercase tracking-widest leading-tight flex flex-wrap justify-center gap-x-[2.5vw] gap-y-[1vh]">
          {words.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)', color: i === 1 ? 'var(--color-secondary)' : 'var(--color-primary)' }}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.25, ease: 'circOut' }}
            >
              {word}
            </motion.span>
          ))}
        </h2>

        {/* Subtle horizontal scan line */}
        <motion.div
          className="mt-[3vh] h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '40vw', opacity: 0.6 }}
          transition={{ duration: 1, delay: 1, ease: 'circOut' }}
        />
      </div>
    </motion.div>
  );
}
