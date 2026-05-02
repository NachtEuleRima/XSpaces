import { motion } from 'framer-motion';

function getCurrentStardate(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86400000);
  const fraction = dayOfYear / 365.25;
  const stardate = (now.getFullYear() - 1966) * 1000 + fraction * 1000;
  return stardate.toFixed(1);
}

export function SceneStardate() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center gap-[2vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.8 }}
    >
      {/* Stardate label + number — one line */}
      <motion.div
        className="flex items-baseline gap-[2vw]"
        initial={{ opacity: 0, scale: 0.92, filter: 'blur(12px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.2, delay: 0.3, ease: 'circOut' }}
      >
        <span className="font-mono text-[2.8vw] tracking-[0.3em] uppercase text-white/50">
          Stardate
        </span>
        <span className="font-display text-[3.8vw] tracking-[0.08em] text-secondary leading-none">
          {getCurrentStardate()}
        </span>
      </motion.div>

      {/* Divider */}
      <motion.div
        className="h-[1px] bg-primary/40"
        initial={{ width: 0 }}
        animate={{ width: '28vw' }}
        transition={{ duration: 0.9, delay: 1.2, ease: 'circOut' }}
      />

      {/* XComSpace | Live */}
      <motion.p
        className="font-mono text-[1.3vw] tracking-[0.5em] uppercase text-accent/80"
        initial={{ opacity: 0, letterSpacing: '0.9em' }}
        animate={{ opacity: 1, letterSpacing: '0.5em' }}
        transition={{ duration: 1, delay: 1.4, ease: 'easeOut' }}
      >
        XComSpace | Live
      </motion.p>
    </motion.div>
  );
}
