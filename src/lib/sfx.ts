/**
 * Tiny synthesized sound kit. No audio files. Off until the user turns it on.
 *   thud  - rubber stamp hitting paper
 *   tick  - typewriter key
 *   flip  - a sheet of paper turning
 *   ching - a sale going through
 *   buzz  - denied
 */
let ctx: AudioContext | null = null;
let on = false;
const listeners = new Set<(v: boolean) => void>();

function ensure() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function noise(dur: number, vol: number, hp = 400, lp = 8000) {
  if (!on || !ctx) return;
  const c = ctx;
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const h = c.createBiquadFilter();
  h.type = "highpass";
  h.frequency.value = hp;
  const l = c.createBiquadFilter();
  l.type = "lowpass";
  l.frequency.value = lp;
  const g = c.createGain();
  const t = c.currentTime;
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(h).connect(l).connect(g).connect(c.destination);
  src.start(t);
  src.stop(t + dur);
}

function tone(freq: number, to: number, dur: number, vol: number, type: OscillatorType = "sine") {
  if (!on || !ctx) return;
  const c = ctx;
  const t = c.currentTime;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  o.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

export const sfx = {
  enabled: () => on,
  subscribe(fn: (v: boolean) => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  toggle(v?: boolean) {
    on = v ?? !on;
    if (on) ensure();
    listeners.forEach((fn) => fn(on));
    return on;
  },
  thud() {
    tone(150, 38, 0.2, 0.5);
    noise(0.09, 0.28, 300, 3000);
  },
  tick() {
    noise(0.025, 0.14, 1800, 9000);
  },
  flip() {
    noise(0.14, 0.09, 700, 6000);
  },
  ching() {
    tone(1320, 1320, 0.08, 0.12, "triangle");
    setTimeout(() => tone(1760, 1760, 0.35, 0.12, "triangle"), 70);
  },
  buzz() {
    tone(110, 95, 0.32, 0.22, "square");
  },
};
