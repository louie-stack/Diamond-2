import type { Glass } from "../hero/glass";
import { SKYLINE } from "./skyline";
import { WINDOWS, ex } from "./street";

/**
 * The slow events on the street, painted into the glass shader's overlay:
 * apartment lights going on and off and changing colour (a pink lamp, a TV's
 * blue, a red bulb), windows across the skyline twinkling, and now and then a
 * car passing in the near lane, wheels hidden behind the window ledge.
 * The overlay is only redrawn while something is happening.
 *
 * Overlay layout (what glass.ts samples): the top 1024x576 is added light;
 * the 512x288 block under it, on the left, is darkening (red = how much).
 * Everything is placed in texture space: ex() maps plate x to texture x.
 */
const AW = 1024;
const AH = 576;
const DW = 512;
const DH = 288;

type Rect = [number, number, number, number];
type Kind = "on" | "off" | "tint";
type Win = { rect: Rect; kind: Kind; start: number; hold: number; from?: Rect; tint?: string; fadeIn: number };
type Car = { start: number; dur: number; dir: 1 | -1 };

// lamp colours a room might change to
const TINTS = ["255,90,150", "90,200,255", "255,70,50", "150,255,140", "190,120,255", "120,150,255"];

export function createLife(glass: Glass, plate: HTMLCanvasElement) {
  const c = document.createElement("canvas");
  c.width = AW;
  c.height = AH + DH;
  const x = c.getContext("2d")!;

  const wins: Win[] = [];
  let car: Car | null = null;
  let floor = 0.86; // where the passing car's tyres meet the window ledge, in plate y
  let nextWin = 1.5;
  let nextSky = 0.5;
  let nextCar = 9;
  let lastDraw = -1;
  let dirty = false;

  const fade = (w: Win, t: number) => {
    const d = t - w.start;
    if (d < 0) return 0;
    if (d < w.fadeIn) return d / w.fadeIn;
    if (d < w.fadeIn + w.hold) return 1;
    return Math.max(0, 1 - (d - w.fadeIn - w.hold) / w.fadeIn);
  };
  const busy = (w: Win, t: number) => {
    const d = t - w.start;
    return d < w.fadeIn || (d > w.fadeIn + w.hold && d < 2 * w.fadeIn + w.hold);
  };

  const glowAt = (gx: number, gy: number, rx: number, ry: number, rgb: string, a: number) => {
    x.save();
    x.translate(gx, gy);
    x.scale(1, ry / rx);
    const g = x.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, `rgba(${rgb},${a})`);
    g.addColorStop(0.35, `rgba(${rgb},${a * 0.4})`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    x.fillStyle = g;
    x.fillRect(-rx, -rx, rx * 2, rx * 2);
    x.restore();
  };

  const drawCar = (t: number, cr: Car) => {
    const k = (t - cr.start) / cr.dur; // 0..1 across the frame
    const len = 0.27;
    const cx = cr.dir > 0 ? -0.2 + k * 1.4 : 1.2 - k * 1.4;
    const y = floor + 0.012; // tyres just below the ledge
    const h = 0.085;
    const x0 = cx - len / 2;
    const front = cr.dir > 0 ? x0 + len : x0;
    const back = cr.dir > 0 ? x0 : x0 + len;

    // the body, as darkness over the street behind it
    x.beginPath();
    const pts = [
      [0, 0.12], [0.02, 0.5], [0.26, 0.56], [0.36, 0.95], [0.66, 0.97], [0.76, 0.56], [0.99, 0.5], [1, 0.12], [1, -0.4], [0, -0.4],
    ].map(([fx, fy]) => [(x0 + (cr.dir > 0 ? fx : 1 - fx) * len) * DW, AH + (y - fy * h) * DH] as const);
    x.moveTo(...pts[0]);
    pts.slice(1).forEach((q) => x.lineTo(...q));
    x.closePath();
    x.fillStyle = "rgb(235,0,0)";
    x.fill();

    // light: headlights, the beam on the wet road, tail lights
    x.globalCompositeOperation = "lighter";
    const fy = (y - h * 0.32) * AH;
    glowAt(front * AW, fy, 70, 34, "255,226,170", 0.35);
    glowAt(front * AW, fy, 22, 12, "255,240,205", 1);
    glowAt((front + 0.1 * cr.dir) * AW, (y - h * 0.05) * AH, 240, 14, "255,226,170", 0.3);
    glowAt(back * AW, fy, 38, 20, "255,40,30", 0.35);
    glowAt(back * AW, fy, 12, 7, "255,90,70", 1);
    // the street lights and the neon catching its outline, glass and chrome
    const P = (fx: number, fy: number) => [(x0 + (cr.dir > 0 ? fx : 1 - fx) * len) * AW, (y - fy * h) * AH] as const;
    x.strokeStyle = "rgba(255,214,160,0.55)";
    x.lineWidth = 1.4;
    x.beginPath();
    [[0.02, 0.5], [0.26, 0.56], [0.36, 0.95], [0.66, 0.97], [0.76, 0.56], [0.99, 0.5]].forEach(([fx, fy], i) => (i ? x.lineTo(...P(fx, fy)) : x.moveTo(...P(fx, fy))));
    x.stroke();
    x.fillStyle = "rgba(255,200,140,0.14)";
    x.beginPath();
    [[0.38, 0.6], [0.4, 0.88], [0.64, 0.9], [0.72, 0.6]].forEach(([fx, fy], i) => (i ? x.lineTo(...P(fx, fy)) : x.moveTo(...P(fx, fy))));
    x.fill();
    x.strokeStyle = "rgba(204,255,0,0.25)"; // the $DMND sign in the paintwork
    x.lineWidth = 1;
    x.beginPath();
    x.moveTo(...P(0.04, 0.42));
    x.lineTo(...P(0.97, 0.42));
    x.stroke();
    x.globalCompositeOperation = "source-over";
  };

  const box = (r: Rect, w: number, h: number, oy = 0) =>
    [ex(r[0]) * w, oy + r[1] * h, (ex(r[2]) - ex(r[0])) * w, (r[3] - r[1]) * h] as const;

  const draw = (t: number) => {
    x.globalCompositeOperation = "source-over";
    x.fillStyle = "#000";
    x.fillRect(0, 0, c.width, c.height);
    for (const w of wins) {
      const v = fade(w, t);
      if (v <= 0) continue;
      if (w.kind === "on" && w.from) {
        // someone's in: borrow a lit room from elsewhere in the painting
        const [fa, fb, fc, fd] = w.from;
        const PW = plate.width;
        const PH = plate.height;
        x.globalAlpha = 0.95 * v;
        x.drawImage(plate, ex(fa) * PW, fb * PH, (ex(fc) - ex(fa)) * PW, (fd - fb) * PH, ...box(w.rect, AW, AH));
        if (w.tint) {
          x.globalCompositeOperation = "multiply";
          x.fillStyle = `rgb(${w.tint})`;
          x.fillRect(...box(w.rect, AW, AH));
          x.globalCompositeOperation = "source-over";
        }
        x.globalAlpha = 1;
      } else if (w.kind === "tint") {
        // the lamp changes: dim the warm room, flood it with a colour
        x.fillStyle = `rgba(200,0,0,${0.55 * v})`;
        x.fillRect(...box(w.rect, DW, DH, AH));
        const [bx, by, bw, bh] = box(w.rect, AW, AH);
        const g = x.createLinearGradient(0, by, 0, by + bh);
        g.addColorStop(0, `rgba(${w.tint},${0.5 * v})`);
        g.addColorStop(1, `rgba(${w.tint},${0.25 * v})`);
        x.fillStyle = g;
        x.fillRect(bx, by, bw, bh);
      } else if (w.kind === "on") {
        // a skyline window lighting up
        x.fillStyle = `rgba(${w.tint ?? "255,190,110"},${0.75 * v})`;
        x.fillRect(...box(w.rect, AW, AH));
      } else {
        x.fillStyle = `rgba(220,0,0,${0.85 * v})`;
        x.fillRect(...box(w.rect, DW, DH, AH));
      }
    }
    if (car) drawCar(t, car);
    glass.setOverlay(c);
  };

  const free = (r: Rect) => !wins.some((w) => w.rect === r);
  const any = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

  return {
    /** plate y where the window ledge cuts the view: the passing car's tyres hide behind it */
    setFloor(y: number) {
      floor = y;
    },
    tick(t: number) {
      // the brownstone: a light on, a light off, or a lamp changing colour
      if (t > nextWin) {
        const k = Math.random();
        if (k < 0.35) {
          const rect = any(WINDOWS.dark);
          if (free(rect)) wins.push({ rect, kind: "on", start: t, hold: 8 + Math.random() * 16, from: any(WINDOWS.lit), tint: Math.random() < 0.35 ? any(TINTS) : undefined, fadeIn: 1 });
        } else if (k < 0.6) {
          const rect = any(WINDOWS.lit);
          if (free(rect)) wins.push({ rect, kind: "off", start: t, hold: 6 + Math.random() * 14, fadeIn: 0.8 });
        } else {
          const rect = any(WINDOWS.lit);
          if (free(rect)) wins.push({ rect, kind: "tint", start: t, hold: 5 + Math.random() * 10, tint: any(TINTS), fadeIn: 1.4 });
        }
        nextWin = t + 1.8 + Math.random() * 2.8;
      }
      // the skyline: windows blinking out, lighting up, the odd colour
      if (t > nextSky) {
        const rect = any(SKYLINE);
        if (free(rect)) {
          const k = Math.random();
          wins.push(
            k < 0.55
              ? { rect, kind: "off", start: t, hold: 4 + Math.random() * 12, fadeIn: 0.3 }
              : { rect, kind: "on", start: t, hold: 4 + Math.random() * 10, tint: Math.random() < 0.4 ? any(TINTS) : undefined, fadeIn: 0.3 },
          );
        }
        nextSky = t + 0.25 + Math.random() * 0.6;
      }
      if (!car && t > nextCar) {
        car = { start: t, dur: 8 + Math.random() * 3, dir: Math.random() < 0.5 ? 1 : -1 };
        nextCar = t + 20 + Math.random() * 16;
      }
      if (car && t > car.start + car.dur) car = null;
      for (let i = wins.length - 1; i >= 0; i--) if (t > wins[i].start + wins[i].hold + 2 * wins[i].fadeIn) wins.splice(i, 1);

      // redraw only while something moves: ~30fps for the car, ~15fps for fades
      const moving = !!car;
      const fading = wins.some((w) => busy(w, t));
      if (moving || fading || dirty) {
        if (t - lastDraw > (moving ? 1 / 30 : 1 / 15)) {
          draw(t);
          lastDraw = t;
          dirty = moving || fading; // one more pass after it settles
        }
      }
    },
  };
}
