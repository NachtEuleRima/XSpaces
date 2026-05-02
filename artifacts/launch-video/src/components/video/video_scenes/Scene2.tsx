import { motion } from 'framer-motion';

const words = "Your personal mission control".split(" ");

export function Scene2() {
  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center px-12 max-w-5xl relative z-10">
        <h1 className="text-[5vw] font-display uppercase tracking-widest leading-tight flex flex-wrap justify-center gap-x-[2vw] gap-y-[1vh]">
          {words.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                filter: 'blur(0px)',
                color: i === 2 ? 'var(--color-secondary)' : 'var(--color-primary)'
              }}
              transition={{ 
                duration: 1, 
                delay: i * 0.3,
                ease: "circOut"
              }}
            >
              {word}
            </motion.span>
          ))}
        </h1>
      </div>
    </motion.div>
  );
}
