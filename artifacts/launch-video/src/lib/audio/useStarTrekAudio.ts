import { useEffect, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createCtx(): AudioContext {
  return new (window.AudioContext || (window as any).webkitAudioContext)();
}

function makeBrass(
  ctx: AudioContext,
  dest: AudioNode,
  freq: number,
  startTime: number,
  duration: number,
  volume = 0.18,
) {
  const osc = ctx.createOscillator();
  const harm = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.value = freq;

  // add a fifth harmonic for brass warmth
  harm.type = 'sawtooth';
  harm.frequency.value = freq * 1.5;

  const harmGain = ctx.createGain();
  harmGain.gain.value = 0.3;

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, startTime);
  filter.frequency.linearRampToValueAtTime(2400, startTime + 0.08);
  filter.frequency.linearRampToValueAtTime(1200, startTime + duration);
  filter.Q.value = 2;

  // brass ADSR
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.06);
  gain.gain.setValueAtTime(volume * 0.85, startTime + 0.1);
  gain.gain.linearRampToValueAtTime(0, startTime + duration);

  osc.connect(filter);
  harm.connect(harmGain);
  harmGain.connect(filter);
  filter.connect(gain);
  gain.connect(dest);

  osc.start(startTime);
  osc.stop(startTime + duration);
  harm.start(startTime);
  harm.stop(startTime + duration);
}

function makePingChirp(
  ctx: AudioContext,
  dest: AudioNode,
  freq: number,
  startTime: number,
  duration = 0.08,
  volume = 0.12,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.value = freq;

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gain);
  gain.connect(dest);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

// ---------------------------------------------------------------------------
// Fanfare — original rising brass motif (Eb major arpeggio feel)
// ---------------------------------------------------------------------------
const FANFARE: Array<[number, number, number]> = [
  // [freq Hz, startOffset s, duration s]
  [233.08, 0.0,  0.18],  // Bb3
  [233.08, 0.22, 0.18],  // Bb3
  [311.13, 0.44, 0.14],  // Eb4
  [466.16, 0.62, 0.48],  // Bb4
  [587.33, 1.14, 0.70],  // D5  (resolve up)
];

// Computer chirp patterns (freq pairs + gap)
const CHIRP_PATTERNS: Array<[number, number][]> = [
  [[1108.73, 0], [1318.51, 0.12]],            // two-tone up
  [[880, 0], [660, 0.09], [880, 0.18]],       // TOS communicator trill
  [[1244.51, 0], [987.77, 0.1]],              // two-tone down
  [[1396.91, 0]],                              // single ping
  [[659.25, 0], [783.99, 0.07], [1046.50, 0.14]], // ascending triple
];

// ---------------------------------------------------------------------------
// Main hook
// ---------------------------------------------------------------------------
export function useStarTrekAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const chirpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);

  function startAmbient(ctx: AudioContext, dest: AudioNode) {
    // Deep starship engine hum — three stacked oscillators
    const hums: Array<[number, number]> = [
      [55, 0.10],    // A1 — deep rumble
      [110, 0.07],   // A2
      [82.41, 0.05], // E2 — perfect fifth
    ];

    hums.forEach(([freq, vol]) => {
      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.value = freq;
      // slight random detune for realism
      osc.detune.value = (Math.random() - 0.5) * 6;

      // slow tremolo
      lfo.type = 'sine';
      lfo.frequency.value = 0.07 + Math.random() * 0.05;
      lfoGain.gain.value = vol * 0.3;

      filter.type = 'lowpass';
      filter.frequency.value = 200;

      gain.gain.value = vol;

      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      osc.start();
      lfo.start();
    });
  }

  function scheduleChirps(ctx: AudioContext, dest: AudioNode) {
    if (mutedRef.current) {
      chirpTimerRef.current = setTimeout(() => scheduleChirps(ctx, dest), 800);
      return;
    }
    const pattern = CHIRP_PATTERNS[Math.floor(Math.random() * CHIRP_PATTERNS.length)];
    const now = ctx.currentTime;
    pattern.forEach(([freq, offset]) => {
      makePingChirp(ctx, dest, freq, now + offset);
    });
    const next = 1800 + Math.random() * 2800;
    chirpTimerRef.current = setTimeout(() => scheduleChirps(ctx, dest), next);
  }

  function playFanfare(ctx: AudioContext, dest: AudioNode) {
    const now = ctx.currentTime + 0.05;
    FANFARE.forEach(([freq, offset, dur]) => {
      makeBrass(ctx, dest, freq, now + offset, dur);
    });
    // Ping chirp during fanfare for colour
    makePingChirp(ctx, dest, 1108.73, now + 0.5, 0.06, 0.08);
    makePingChirp(ctx, dest, 1318.51, now + 0.8, 0.06, 0.08);
  }

  useEffect(() => {
    const ctx = createCtx();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = muted ? 0 : 1;
    master.connect(ctx.destination);
    masterRef.current = master;

    // Resume context after first user gesture if needed
    const resume = () => { ctx.resume(); };
    document.addEventListener('click', resume, { once: true });
    document.addEventListener('keydown', resume, { once: true });

    startAmbient(ctx, master);
    playFanfare(ctx, master);

    const chirpDelay = setTimeout(() => scheduleChirps(ctx, master), 2000);

    return () => {
      document.removeEventListener('click', resume);
      document.removeEventListener('keydown', resume);
      clearTimeout(chirpDelay);
      if (chirpTimerRef.current) clearTimeout(chirpTimerRef.current);
      ctx.close();
    };
  }, []);

  function toggleMute() {
    const next = !muted;
    mutedRef.current = next;
    setMuted(next);
    if (masterRef.current && ctxRef.current) {
      masterRef.current.gain.setTargetAtTime(
        next ? 0 : 1,
        ctxRef.current.currentTime,
        0.1,
      );
    }
  }

  return { muted, toggleMute };
}
