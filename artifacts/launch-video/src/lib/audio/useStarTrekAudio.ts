import { useEffect, useRef, useState } from 'react';

function createCtx(): AudioContext {
  return new (window.AudioContext || (window as any).webkitAudioContext)();
}

// ---------------------------------------------------------------------------
// Reverb simulation — comb filter echo stack
// ---------------------------------------------------------------------------
function makeReverb(ctx: AudioContext): GainNode {
  const wet = ctx.createGain();
  wet.gain.value = 0.35;
  const delays = [0.08, 0.13, 0.19, 0.27];
  delays.forEach((t, i) => {
    const d = ctx.createDelay(1.0);
    const g = ctx.createGain();
    d.delayTime.value = t;
    g.gain.value = 0.18 - i * 0.03;
    wet.connect(d);
    d.connect(g);
    g.connect(ctx.destination);
  });
  return wet;
}

// ---------------------------------------------------------------------------
// Brass note — sawtooth + square mix, filter swell
// ---------------------------------------------------------------------------
function makeBrass(
  ctx: AudioContext,
  dest: AudioNode,
  reverb: AudioNode,
  freq: number,
  startTime: number,
  duration: number,
  vol = 0.22,
) {
  const saw = ctx.createOscillator();
  const sqr = ctx.createOscillator();
  const sqrGain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  saw.type = 'sawtooth';
  saw.frequency.value = freq;
  sqr.type = 'square';
  sqr.frequency.value = freq;
  sqrGain.gain.value = 0.4;

  // brass swell: filter opens on attack
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(400, startTime);
  filter.frequency.linearRampToValueAtTime(2800, startTime + 0.12);
  filter.frequency.linearRampToValueAtTime(1400, startTime + duration);
  filter.Q.value = 3;

  // ADSR
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(vol, startTime + 0.07);
  gain.gain.setValueAtTime(vol * 0.8, startTime + 0.15);
  gain.gain.linearRampToValueAtTime(0, startTime + duration);

  sqr.connect(sqrGain);
  sqrGain.connect(filter);
  saw.connect(filter);
  filter.connect(gain);
  gain.connect(dest);
  gain.connect(reverb);

  saw.start(startTime); saw.stop(startTime + duration);
  sqr.start(startTime); sqr.stop(startTime + duration);
}

// ---------------------------------------------------------------------------
// Theremin — sine with vibrato + gentle portamento
// ---------------------------------------------------------------------------
function makeTheremin(
  ctx: AudioContext,
  dest: AudioNode,
  notes: Array<[number, number, number]>, // [freq, startOffset, duration]
  baseDelay = 0,
  vol = 0.13,
) {
  notes.forEach(([freq, offset, dur]) => {
    const osc = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.value = freq;

    // vibrato
    lfo.type = 'sine';
    lfo.frequency.value = 5.5;
    lfoGain.gain.value = freq * 0.012; // ~1.2% pitch vibrato

    filter.type = 'bandpass';
    filter.frequency.value = freq * 2;
    filter.Q.value = 0.8;

    const t = ctx.currentTime + baseDelay + offset;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.18);
    gain.gain.setValueAtTime(vol, t + dur - 0.2);
    gain.gain.linearRampToValueAtTime(0, t + dur);

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(t); osc.stop(t + dur);
    lfo.start(t); lfo.stop(t + dur);
  });
}

// ---------------------------------------------------------------------------
// String pad — 5 detuned sawtooths, slow attack
// ---------------------------------------------------------------------------
function makeStringPad(
  ctx: AudioContext,
  dest: AudioNode,
  freq: number,
  startTime: number,
  duration: number,
  vol = 0.08,
) {
  const detunes = [-12, -5, 0, 5, 12];
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = freq * 1.5;
  filter.Q.value = 0.5;

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0, startTime);
  masterGain.gain.linearRampToValueAtTime(vol, startTime + 0.9);
  masterGain.gain.setValueAtTime(vol, startTime + duration - 0.5);
  masterGain.gain.linearRampToValueAtTime(0, startTime + duration);

  detunes.forEach(detune => {
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = freq;
    osc.detune.value = detune;
    osc.connect(filter);
    osc.start(startTime);
    osc.stop(startTime + duration);
  });
  filter.connect(masterGain);
  masterGain.connect(dest);
}

// ---------------------------------------------------------------------------
// TOS-style computer chirp — two-tone ping pattern
// ---------------------------------------------------------------------------
function makeTOSChirp(
  ctx: AudioContext,
  dest: AudioNode,
  pattern: Array<[number, number]>, // [freq, offsetMs]
  vol = 0.1,
) {
  const now = ctx.currentTime;
  pattern.forEach(([freq, offsetMs]) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const t = now + offsetMs / 1000;

    osc.type = 'sine';
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + 0.15);
  });
}

// ---------------------------------------------------------------------------
// Opening fanfare — heroic ascending perfect 4ths/5ths + theremin follow
// ---------------------------------------------------------------------------
// Brass: C3 bass → G3,C4 chord → ascending G4→D5→G5 (open 5ths)
const FANFARE_BRASS: Array<[number, number, number]> = [
  [130.81, 0.0,  0.25],  // C3 — bass hit
  [196.00, 0.28, 0.22],  // G3
  [261.63, 0.28, 0.22],  // C4 — open 5th chord
  [392.00, 0.55, 0.30],  // G4
  [523.25, 0.90, 0.30],  // C5
  [587.33, 1.24, 0.25],  // D5
  [783.99, 1.52, 0.80],  // G5 — held
];

// Theremin melody follows fanfare — wandering sci-fi line
const THEREMIN_MELODY: Array<[number, number, number]> = [
  [783.99, 2.6,  0.7],   // G5
  [659.25, 3.4,  0.6],   // E5
  [523.25, 4.1,  0.5],   // C5
  [587.33, 4.7,  0.4],   // D5
  [440.00, 5.2,  0.9],   // A4
  [392.00, 6.2,  1.2],   // G4 — fades out
];

// TOS chirp patterns
const TOS_CHIRPS: Array<Array<[number, number]>> = [
  [[880, 0], [1108, 120]],
  [[1108, 0], [880, 100], [1108, 200]],
  [[660, 0], [880, 90]],
  [[1318, 0]],
  [[880, 0], [1046, 80], [1318, 160]],
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
    // Deep engine hum — tuned to C (65Hz root with harmonics)
    const humFreqs: Array<[number, number]> = [
      [65.41, 0.12],   // C2
      [130.81, 0.07],  // C3
      [98.00, 0.05],   // G2 — perfect 5th
    ];
    humFreqs.forEach(([freq, vol]) => {
      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.detune.value = (Math.random() - 0.5) * 4;

      lfo.type = 'sine';
      lfo.frequency.value = 0.06 + Math.random() * 0.04;
      lfoGain.gain.value = vol * 0.25;

      filter.type = 'lowpass';
      filter.frequency.value = 220;

      gain.gain.value = vol;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);
      osc.start(); lfo.start();
    });
  }

  function scheduleChirps(ctx: AudioContext, dest: AudioNode) {
    if (mutedRef.current) {
      chirpTimerRef.current = setTimeout(() => scheduleChirps(ctx, dest), 800);
      return;
    }
    const pattern = TOS_CHIRPS[Math.floor(Math.random() * TOS_CHIRPS.length)];
    makeTOSChirp(ctx, dest, pattern);
    chirpTimerRef.current = setTimeout(
      () => scheduleChirps(ctx, dest),
      1600 + Math.random() * 2600,
    );
  }

  function playOpening(ctx: AudioContext, dest: AudioNode, reverb: AudioNode) {
    const now = ctx.currentTime + 0.05;
    // String pad underneath — C major chord
    makeStringPad(ctx, dest, 130.81, now, 8, 0.06);
    makeStringPad(ctx, dest, 196.00, now + 0.3, 7.5, 0.05);
    makeStringPad(ctx, dest, 261.63, now + 0.6, 7, 0.04);
    // Brass fanfare
    FANFARE_BRASS.forEach(([freq, offset, dur]) => {
      makeBrass(ctx, dest, reverb, freq, now + offset, dur);
    });
    // Theremin melody
    makeTheremin(ctx, dest, THEREMIN_MELODY, 0.05);
  }

  useEffect(() => {
    const ctx = createCtx();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = muted ? 0 : 1;
    master.connect(ctx.destination);
    masterRef.current = master;

    const reverb = makeReverb(ctx);

    const resume = () => ctx.resume();
    document.addEventListener('click', resume, { once: true });
    document.addEventListener('keydown', resume, { once: true });

    startAmbient(ctx, master);
    playOpening(ctx, master, reverb);

    const chirpDelay = setTimeout(() => scheduleChirps(ctx, master), 2500);

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
