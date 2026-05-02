import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LINE1 = 'Space...';
const LINE2 = 'the final frontier.';

function Typewriter({ text, startDelay, charDelay = 80, className }: {
  text: string;
  startDelay: number;
  charDelay?: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const start = setTimeout(() => {
      setStarted(true);
    }, startDelay);
    return () => clearTimeout(start);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    if (visible >= text.length) return;
    const t = setTimeout(() => setVisible(v => v + 1), charDelay);
    return () => clearTimeout(t);
  }, [started, visible, text, charDelay]);

  return (
    <span className={className}>
      {text.slice(0, visible)}
      {visible < text.length && (
        <motion.span
          className="inline-block w-[2px] h-[1em] bg-current align-middle ml-0.5"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        />
      )}
    </span>
  );
}

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // phase 1: show line2 after line1 finishes typing
    const t1 = setTimeout(() => setPhase(1), 1400);
    // phase 2: show ident — give line2 plenty of time to be read
    const t2 = setTimeout(() => setPhase(2), 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center gap-[2.5vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 0.7 }}
    >
      {/* Line 1 — "Space..." */}
      <p className="font-display text-[5.5vw] tracking-[0.12em] uppercase text-primary">
        <Typewriter text={LINE1} startDelay={300} charDelay={90} />
      </p>

      {/* Line 2 — "the final frontier." */}
      <AnimatePresence>
        {phase >= 1 && (
          <motion.p
            key="line2"
            className="font-display text-[3.5vw] tracking-[0.22em] uppercase text-white/70"
            initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: 'circOut' }}
          >
            {LINE2}
          </motion.p>
        )}
      </AnimatePresence>

      {/* XCOMS.SPACE ident */}
      <AnimatePresence>
        {phase >= 2 && (
          <motion.div
            key="ident"
            className="mt-[3vh] flex flex-col items-center gap-[1vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeIn' }}
          >
            <motion.div
              className="h-[1px] bg-primary/50"
              initial={{ width: 0 }}
              animate={{ width: '22vw' }}
              transition={{ duration: 0.8, ease: 'circOut' }}
            />
            <motion.p
              className="font-mono text-[1.2vw] tracking-[0.55em] uppercase text-accent/80"
              initial={{ opacity: 0, letterSpacing: '0.8em' }}
              animate={{ opacity: 1, letterSpacing: '0.55em' }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              XComSpace | Live
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
