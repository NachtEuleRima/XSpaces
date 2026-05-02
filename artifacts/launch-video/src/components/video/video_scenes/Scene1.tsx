import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function speakIntro() {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  function utter(text: string, delay: number, rate = 0.72, pitch = 0.75) {
    setTimeout(() => {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = rate;
      u.pitch = pitch;
      u.volume = 0.9;
      // prefer a deep male voice if available
      const voices = window.speechSynthesis.getVoices();
      const deep = voices.find(v =>
        /male|man|david|james|daniel|alex/i.test(v.name) && /en/i.test(v.lang)
      ) ?? voices.find(v => /en/i.test(v.lang));
      if (deep) u.voice = deep;
      window.speechSynthesis.speak(u);
    }, delay);
  }

  utter('Space...', 350);
  utter('the final frontier.', 2200, 0.68, 0.72);
}

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
    const start = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(start);
  }, [startDelay]);

  useEffect(() => {
    if (!started || visible >= text.length) return;
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
  const [showLine2, setShowLine2] = useState(false);

  useEffect(() => {
    speakIntro();
    const t = setTimeout(() => setShowLine2(true), 1400);
    return () => {
      clearTimeout(t);
      window.speechSynthesis?.cancel();
    };
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center gap-[2.5vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 0.7 }}
    >
      <p className="font-display text-[5.5vw] tracking-[0.12em] uppercase text-primary">
        <Typewriter text={LINE1} startDelay={300} charDelay={90} />
      </p>

      <AnimatePresence>
        {showLine2 && (
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
    </motion.div>
  );
}
