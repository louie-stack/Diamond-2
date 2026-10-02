/**
 * The street outside the detective's window: Louie's painted plate
 * (public/art/case/street.webp) with our pieces composited into it. The lime
 * $DMND neon hangs on the blank wall between the three gooseneck lamps, its
 * light spilling over the brick and the awning; DIAMOND HANDS is old paint
 * under it; our man stands side on in a lit top-floor window.
 * All positions are fractions of the original plate, measured from the
 * painting. The plate is extended on the right by a mirrored strip (EXT) so
 * the sign, which sits right of the painting's middle, lands dead centre.
 * render(lit) redraws only the neon, so its letters can buzz on and flicker.
 */

/** the texture is the plate plus a mirrored strip on the right: total width / plate width */
export const EXT = 1.06;
/** plate fraction -> texture fraction, horizontally */
export const ex = (x: number) => x / EXT;

const WORD = "$DMND";
const SUB = "DIAMOND HANDS";

type Rect = [number, number, number, number]; // x0, y0, x1, y1 as plate fractions

/** the plate's windows, measured from the painting */
export const WINDOWS = {
  dark: [
    [0.225, 0.125, 0.254, 0.212],
    [0.297, 0.125, 0.321, 0.212],
    [0.713, 0.125, 0.74, 0.212],
    [0.297, 0.282, 0.321, 0.383],
  ] as Rect[],
  lit: [
    [0.4, 0.125, 0.428, 0.212],
    [0.523, 0.125, 0.55, 0.212],
    [0.651, 0.125, 0.678, 0.212],
    [0.768, 0.125, 0.796, 0.212],
    [0.769, 0.278, 0.796, 0.361],
  ] as Rect[],
  tv: [0.461, 0.125, 0.489, 0.212] as Rect,
  his: [0.59, 0.125, 0.617, 0.212] as Rect,
};

export const LIFE = {
  // steam from the vent by the stoop, and from the manhole in the road
  steam: [
    [0.165, 0.79, 0.06, 0.26],
    [0.62, 0.955, 0.045, 0.2],
  ] as [[number, number, number, number], [number, number, number, number]],
  beacons: [
    [0.1465, 0.06],
    [0.1725, 0.138],
    [0.8865, 0.037],
  ] as [number, number][],
  street: 0.82,
};

const fontVar = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim() || "sans-serif";

function glow(x: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number, rgb: string, a: number) {
  x.save();
  x.translate(cx, cy);
  x.scale(1, ry / rx);
  const g = x.createRadialGradient(0, 0, 0, 0, 0, rx);
  g.addColorStop(0, `rgba(${rgb},${a})`);
  g.addColorStop(0.4, `rgba(${rgb},${a * 0.35})`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  x.fillStyle = g;
  x.fillRect(-rx, -rx, rx * 2, rx * 2);
  x.restore();
}

/** a neon glyph: wide glow, tight glow, the tube, its hot core */
function tube(x: CanvasRenderingContext2D, ch: string, px: number, py: number, size: number, w: number, L: number) {
  x.shadowBlur = 0;
  x.lineWidth = w;
  x.strokeStyle = "rgba(40,44,24,0.7)";
  x.strokeText(ch, px, py);
  if (L <= 0.01) return;
  x.strokeStyle = `rgba(204,255,0,${0.35 * L})`;
  x.shadowColor = `rgba(204,255,0,${0.85 * L})`;
  x.shadowBlur = size * 0.3;
  x.lineWidth = w * 2.4;
  x.strokeText(ch, px, py);
  x.shadowBlur = size * 0.06;
  x.lineWidth = w * 1.25;
  x.strokeStyle = `rgba(214,255,40,${L})`;
  x.strokeText(ch, px, py);
  x.shadowBlur = 0;
  x.lineWidth = w * 0.55;
  x.strokeStyle = `rgba(250,255,228,${L})`;
  x.strokeText(ch, px, py);
}

export type Street = { render: (lit: number[]) => HTMLCanvasElement; neon: HTMLCanvasElement; letters: number; width: number; height: number; plate: HTMLCanvasElement };

export function createStreet(plate: HTMLImageElement, silhouette: HTMLImageElement | null, width: number): Street {
  const W0 = Math.round(width / EXT); // the painting's own width in this texture
  const W = width;
  const H = Math.round((W0 * plate.naturalHeight) / plate.naturalWidth);
  const display = fontVar("--font-display");

  const base = document.createElement("canvas");
  base.width = W;
  base.height = H;
  const b = base.getContext("2d")!;
  b.imageSmoothingQuality = "high";
  b.drawImage(plate, 0, 0, W0, H);
  // the extension: the painting's right edge, mirrored, so the seam is continuous
  {
    const strip = W - W0;
    const sx = plate.naturalWidth * (1 - (EXT - 1));
    b.save();
    b.translate(W0 * 2, 0);
    b.scale(-1, 1);
    b.drawImage(plate, sx, 0, plate.naturalWidth - sx, plate.naturalHeight, W0 - strip, 0, strip, H);
    b.restore();
  }
  // an untouched copy, for life.ts to borrow lit rooms from
  const raw = document.createElement("canvas");
  raw.width = W;
  raw.height = H;
  raw.getContext("2d")!.drawImage(base, 0, 0);

  // ---- the neon's geometry: centred under the middle lamp, between lamps and ledge
  const cx = W / 2; // dead centre of the texture = the blank wall under the middle lamp
  const cy = H * 0.405;
  b.font = `800 100px ${display}`;
  const size = (100 * W0 * 0.28) / b.measureText(WORD).width;
  b.font = `800 ${size}px ${display}`;
  const widths = [...WORD].map((ch) => b.measureText(ch).width);
  const total = widths.reduce((a, c) => a + c, 0);
  const xs: number[] = [];
  widths.reduce((x, wd) => (xs.push(x + wd / 2), x + wd), cx - total / 2);
  const tw = Math.max(2, size * 0.026);

  // the sign's hardware: wall clips under each letter, a conduit, a transformer
  b.fillStyle = "rgba(8,7,5,0.9)";
  b.fillRect(cx - total * 0.47, cy + size * 0.43, total * 0.94, Math.max(1.5, size * 0.012));
  xs.forEach((px) => b.fillRect(px - size * 0.01, cy + size * 0.35, size * 0.02, size * 0.09));
  const tx = cx + total * 0.5 + size * 0.1;
  b.fillRect(tx, cy + size * 0.12, size * 0.1, size * 0.15);
  b.fillRect(tx + size * 0.045, cy + size * 0.27, Math.max(1.5, size * 0.012), size * 0.17);
  b.fillStyle = "rgba(255,220,170,0.08)";
  b.fillRect(tx, cy + size * 0.12, size * 0.1, Math.max(1, size * 0.006));

  // ---- DIAMOND HANDS: old paint, only on the brick faces
  {
    const subSize = size * 0.17;
    const sy = H * 0.512;
    const pt = document.createElement("canvas");
    pt.width = W;
    pt.height = H;
    const px = pt.getContext("2d")!;
    px.font = `800 ${subSize}px ${display}`;
    px.letterSpacing = `${subSize * 0.2}px`;
    px.textAlign = "center";
    px.textBaseline = "middle";
    px.fillStyle = "#efe2c4";
    px.fillText(SUB, cx, sy);
    const tw2 = px.measureText(SUB).width;
    px.letterSpacing = "0px";
    // flaked and pitted
    px.globalCompositeOperation = "destination-out";
    let seed = 1027;
    const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 320; i++) {
      px.globalAlpha = 0.25 + r() * 0.75;
      px.beginPath();
      px.ellipse(cx + (r() - 0.5) * tw2 * 1.1, sy + (r() - 0.5) * subSize * 1.3, (1 + r() * r() * 10) * (W0 / 2000), (1 + r() * 4) * (W0 / 2000), r() * 3, 0, Math.PI * 2);
      px.fill();
    }
    px.globalAlpha = 1;
    // the mortar shows through: keep paint only where the brick is brighter than its surroundings
    const x0 = Math.max(0, Math.floor(cx - tw2 * 0.6));
    const y0 = Math.max(0, Math.floor(sy - subSize));
    const rw = Math.min(W - x0, Math.ceil(tw2 * 1.2));
    const rh = Math.min(H - y0, Math.ceil(subSize * 2));
    const wall = b.getImageData(x0, y0, rw, rh).data;
    const paint = px.getImageData(x0, y0, rw, rh);
    let mean = 0;
    for (let i = 0; i < wall.length; i += 4) mean += wall[i] + wall[i + 1] + wall[i + 2];
    mean /= (wall.length / 4) * 3;
    for (let i = 0; i < wall.length; i += 4) {
      const l = (wall[i] + wall[i + 1] + wall[i + 2]) / 3;
      const k = Math.min(1, Math.max(0, (l - mean * 0.7) / (mean * 0.6)));
      paint.data[i + 3] = paint.data[i + 3] * k;
    }
    px.putImageData(paint, x0, y0);
    b.globalAlpha = 0.24;
    b.drawImage(pt, 0, 0);
    b.globalAlpha = 1;
  }

  // ---- our man, side on, dark against the lamp behind him
  if (silhouette) {
    const [a, c, d, e] = WINDOWS.his;
    const x = a * W0;
    const y = c * H;
    const ww = (d - a) * W0;
    const wh = (e - c) * H;
    const s = document.createElement("canvas");
    s.width = silhouette.naturalWidth;
    s.height = silhouette.naturalHeight;
    const sx = s.getContext("2d")!;
    sx.drawImage(silhouette, 0, 0);
    sx.globalCompositeOperation = "source-in";
    sx.fillStyle = "#0a0504";
    sx.fillRect(0, 0, s.width, s.height);
    b.save();
    b.beginPath();
    b.rect(x, y, ww, wh);
    b.clip();
    const sh = wh * 0.84;
    const sw = (sh * s.width) / s.height;
    b.drawImage(s, x + ww * 0.55 - sw / 2, y + wh - sh, sw, sh);
    b.restore();
  }

  // ---- the neon itself, redrawn on every flicker
  const out = document.createElement("canvas");
  out.width = W;
  out.height = H;
  const o = out.getContext("2d")!;
  o.lineJoin = "round";
  o.lineCap = "round";

  // the tubes alone, on black: glass.ts keeps these crisp through the fog
  const neon = document.createElement("canvas");
  neon.width = W;
  neon.height = H;
  const n = neon.getContext("2d")!;
  n.lineJoin = "round";
  n.lineCap = "round";

  const render = (lit: number[]) => {
    o.globalCompositeOperation = "source-over";
    o.shadowBlur = 0;
    o.drawImage(base, 0, 0);
    const avg = lit.reduce((a, c) => a + c, 0) / lit.length;
    // lime light on the brick and across the top of the awning
    o.globalCompositeOperation = "lighter";
    glow(o, cx, cy, total * 0.95, size * 1.5, "204,255,0", 0.2 * avg);
    glow(o, cx, H * 0.575, total * 0.8, H * 0.03, "204,255,0", 0.12 * avg);
    o.globalCompositeOperation = "source-over";
    for (const x of [o, n]) {
      x.font = `800 ${size}px ${display}`;
      x.textAlign = "center";
      x.textBaseline = "middle";
    }
    n.fillStyle = "#000";
    n.fillRect(0, 0, W, H);
    [...WORD].forEach((ch, i) => {
      tube(o, ch, xs[i], cy, size, tw, lit[i] ?? 0);
      tube(n, ch, xs[i], cy, size, tw, lit[i] ?? 0);
    });
    o.shadowBlur = 0;
    n.shadowBlur = 0;
    return out;
  };

  return { render, neon, letters: WORD.length, width: W, height: H, plate: raw };
}
