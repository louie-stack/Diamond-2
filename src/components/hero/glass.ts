/**
 * Rain on a window, in WebGL2. The key art sits behind fogged glass (a smooth
 * pre-blurred copy); drops refract it sharp, sliding drops leave clear trails, the cursor wipes the fog,
 * lightning flickers, and `clear` (scroll) stops the rain and lifts the fog.
 * With `life` on (the footer), the scene behind the glass also lives: an
 * overlay texture for slow events (windows, a passing car), rain falling where
 * the light catches it, steam, blinking beacons, puddle ripples, bloom, grain.
 */

const VERT = `#version 300 es
in vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uTex;
uniform sampler2D uWipe;
uniform sampler2D uBlur;
uniform vec2 uRes;
uniform vec2 uImg;
uniform float uFocus;
uniform float uTime;
uniform float uClear;
uniform float uRain;
uniform float uFlash;
uniform float uZoom;
uniform vec2 uPar;
uniform float uFocusY;
uniform float uLife;
uniform sampler2D uNeon;   // emitters only (the footer's neon): stay crisp through the fog
uniform sampler2D uOver;   // top 2/3: added light; bottom-left: darkening (red)
uniform vec4 uSteamA;      // centre xy, size xy, in image uv
uniform vec4 uSteamB;
uniform vec2 uBeacon[3];
uniform float uStreet;     // image-uv y where the road starts
uniform vec4 uTv;          // a window with a television on: x0 y0 x1 y1
out vec4 o;

float h1(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
vec3 h3(vec2 p) { float a = h1(p); return vec3(a, h1(p + a), h1(p + a * 3.7)); }

// small static beads that bloom and evaporate
float beads(vec2 uv, float t, float scale) {
  uv *= scale;
  vec2 id = floor(uv);
  vec2 f = fract(uv) - 0.5;
  vec3 n = h3(id);
  vec2 c = (n.xy - 0.5) * 0.56; // keeps the biggest bead inside its cell, so no square edges
  float life = fract(t * (0.04 + n.z * 0.05) + n.x);
  float r = mix(0.06, 0.2, n.z) * smoothstep(0.0, 0.15, life) * smoothstep(1.0, 0.75, life);
  return smoothstep(r, r * 0.35, length(f - c));
}

// big drops that slide down and leave a trail; returns (drop, trail)
vec2 sliders(vec2 uv, float t, float cols, float seed) {
  vec2 st = uv * vec2(cols, cols * 0.42);
  float colId = floor(st.x);
  float speed = 0.06 + h1(vec2(colId, seed)) * 0.12;
  st.y += t * speed * cols * 0.42;
  vec2 id = floor(st);
  vec2 f = fract(st) - 0.5;
  vec3 n = h3(id + seed);
  if (n.z < 0.35) return vec2(0.0);
  float x = (n.x - 0.5) * 0.6 + sin(f.y * 9.0 + n.y * 6.28) * 0.035;
  float y = (n.y - 0.5) * 0.5;
  vec2 d = (f - vec2(x, y)) * vec2(1.0, 0.78);
  float drop = smoothstep(0.13, 0.07, length(d));
  float behind = smoothstep(y, y + 0.5, f.y);
  float lane = smoothstep(0.045, 0.0, abs(f.x - x));
  float trail = lane * (1.0 - behind) * step(y, f.y);
  float ty = fract(f.y * 7.0) - 0.5;
  float trailBeads = smoothstep(0.06, 0.02, length(vec2(f.x - x, ty * 0.3))) * step(y + 0.06, f.y) * (1.0 - behind);
  return vec2(max(drop, trailBeads * 0.8), trail);
}

float vn(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h1(i), h1(i + vec2(1, 0)), f.x), mix(h1(i + vec2(0, 1)), h1(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { s += a * vn(p); p = p * 2.07 + 13.1; a *= 0.5; }
  return s;
}

// steam rising from a vent: noise drifting up inside a tapering plume
float steam(vec2 p, vec4 s, float t, float aspect) {
  vec2 q = (p - s.xy) / s.zw;           // 0 at the vent, y < 0 going up
  if (q.y > 0.15 || q.y < -1.0) return 0.0;
  float up = clamp(-q.y, 0.0, 1.0);
  float width = 0.12 + up * 0.55;
  float sway = sin(t * 0.35 + up * 3.0) * 0.08 * up;
  float body = smoothstep(width, 0.0, abs(q.x - sway)) * smoothstep(0.15, -0.05, q.y) * (1.0 - up * 0.85);
  float n = fbm(vec2(q.x * 3.2 * aspect, q.y * 2.4 + t * 0.32)) * fbm(vec2(q.x * 6.0, q.y * 4.0 + t * 0.55) + 4.0);
  return body * smoothstep(0.12, 0.55, n);
}

// rain falling in the street, only visible where something lights it
float streaks(vec2 p, float t) {
  vec2 s = p * vec2(320.0, 9.0);
  s.x += s.y * 2.2;                     // a slight slant
  s.y -= t * 9.0;
  vec2 id = floor(s);
  vec2 f = fract(s);
  float n = h1(id);
  if (n < 0.78) return 0.0;
  float x = abs(f.x - 0.2 - n * 0.6);
  return smoothstep(0.09, 0.0, x) * smoothstep(0.0, 0.25, f.y) * smoothstep(1.0, 0.55, f.y);
}

// rings spreading where drops hit the wet road
float ripples(vec2 p, float t, float aspect) {
  vec2 s = vec2(p.x * aspect * 34.0, p.y * 110.0);
  vec2 id = floor(s);
  vec2 f = fract(s) - 0.5;
  float n = h1(id + 7.0);
  float life = fract(t * (0.5 + n * 0.6) + n * 11.0);
  vec2 c = (vec2(h1(id + 1.3), h1(id + 2.9)) - 0.5) * 0.5;
  float r = life * 0.45;
  float d = length((f - c) * vec2(1.0, 2.6));
  return smoothstep(0.05, 0.0, abs(d - r)) * (1.0 - life) * step(0.35, n);
}

vec3 field(vec2 uv, float t, float wiped) {
  float rain = (1.0 - uClear) * (1.0 - wiped) * uRain;
  float b = beads(uv, t, 22.0) * rain + beads(uv * 1.7 + 3.1, t, 30.0) * rain * 0.8;
  vec2 s1 = sliders(uv, t, 7.0, 1.0) * rain;
  vec2 s2 = sliders(uv * 1.35 + 7.0, t * 1.1, 9.0, 4.0) * rain;
  float drops = clamp(b + s1.x + s2.x, 0.0, 1.0);
  float trails = clamp(s1.y + s2.y, 0.0, 1.0);
  return vec3(drops, trails, 0.0);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uvS = frag / uRes;                      // screen 0..1
  vec2 g = frag / uRes.y;                      // glass space, square units

  // cover-fit the image, with a focus point and a slow push-in
  float sc = max(uRes.x / uImg.x, uRes.y / uImg.y) * uZoom;
  vec2 size = uImg * sc;
  vec2 off = vec2((uRes.x - size.x) * uFocus, (uRes.y - size.y) * (1.0 - uFocusY));
  vec2 uv = (frag - off) / size;
  uv = vec2(uv.x, 1.0 - uv.y) + uPar;

  float t = uTime;
  // where the cursor has wiped, the glass is clear: no fog and no drops
  float wipe = smoothstep(0.05, 0.85, texture(uWipe, vec2(uvS.x, 1.0 - uvS.y)).r);
  vec3 c = field(g, t, wipe);
  float e = 1.5 / uRes.y;
  float cx = field(g + vec2(e, 0.0), t, wipe).x;
  float cy = field(g + vec2(0.0, e), t, wipe).x;
  vec2 nrm = vec2(cx - c.x, cy - c.x);
  float fog = (1.0 - uClear) * (1.0 - clamp(c.y * 0.9 + wipe, 0.0, 1.0)) * uRain;
  float haze = fog * (1.0 - c.x);

  vec2 refr = uv - nrm * vec2(1.0, -1.0) * 0.68 - c.x * vec2(0.0, 0.004);
  vec3 sharp = texture(uTex, refr).rgb;
  vec3 soft = texture(uBlur, uv).rgb;

  if (uLife > 0.0) {
    float aspect = uImg.x / uImg.y;
    // slow events, painted into the overlay: added light, and darkening
    vec3 add = texture(uOver, vec2(refr.x, refr.y * 0.66667)).rgb;
    float dark = texture(uOver, vec2(refr.x * 0.5, 0.66667 + refr.y * 0.33333)).r;
    sharp = sharp * (1.0 - dark) + add;
    vec3 addS = texture(uOver, vec2(uv.x, uv.y * 0.66667)).rgb;
    float darkS = texture(uOver, vec2(uv.x * 0.5, 0.66667 + uv.y * 0.33333)).r;
    soft = soft * (1.0 - darkS) + addS * 0.8;

    // the television flickers as the picture changes
    if (refr.x > uTv.x && refr.x < uTv.z && refr.y > uTv.y && refr.y < uTv.w) {
      float f = vn(vec2(floor(t * 6.0), 3.0)) * 0.7 + vn(vec2(t * 23.0, 9.0)) * 0.3;
      sharp *= 0.55 + f * 0.9;
    }
    float lum = dot(soft, vec3(0.3, 0.55, 0.15));
    // rain in the light
    float rs = streaks(refr, t) * smoothstep(0.12, 0.5, lum);
    sharp += vec3(1.0, 0.92, 0.78) * rs * 0.32;
    // steam, lit by whatever is behind it
    float st = steam(refr, uSteamA, t, aspect) + steam(refr, uSteamB, t + 7.0, aspect) * 0.8;
    sharp = mix(sharp, sharp + vec3(0.9, 0.8, 0.66) * (0.12 + lum * 0.9), clamp(st * 0.55, 0.0, 1.0));
    soft += vec3(0.9, 0.8, 0.66) * st * 0.1;
    // ripples in the road's reflections
    if (refr.y > uStreet) sharp += vec3(1.0, 0.88, 0.7) * ripples(refr, t, aspect) * smoothstep(0.08, 0.4, lum) * 0.5;
    // aircraft beacons, blinking out of step
    for (int i = 0; i < 3; i++) {
      vec2 d = (refr - uBeacon[i]) * vec2(aspect, 1.0);
      float on = step(fract(t * 0.42 + float(i) * 0.37), 0.14);
      float g = exp(-dot(d, d) / 0.000045) + exp(-dot(d, d) / 0.0009) * 0.35;
      sharp += vec3(1.0, 0.16, 0.1) * g * on;
      soft += vec3(1.0, 0.16, 0.1) * g * on * 0.25;
    }
  }

  vec3 col = mix(sharp, soft, smoothstep(0.0, 1.0, haze));
  if (uLife > 0.0) {
    // bloom from the soft copy, and the neon read through the condensation
    col += max(soft - vec3(0.42), vec3(0.0)) * 0.6;
    col += texture(uNeon, refr).rgb * haze * 0.7;
  }

  // fogged glass is lighter and flatter
  col = mix(col, col * 0.85 + vec3(0.04, 0.045, 0.035), fog * 0.55);
  // drop highlights
  col *= 1.0 + c.x * 0.2;
  col += smoothstep(0.02, 0.1, -nrm.y - nrm.x * 0.5) * 0.14;
  col -= smoothstep(0.02, 0.1, nrm.y + nrm.x * 0.5) * 0.035;

  // night grade, then warm sun as it clears
  vec3 night = col * vec3(0.92, 1.0, 0.9);
  vec3 sun = col * vec3(1.06, 1.02, 0.92) + vec3(0.02, 0.018, 0.0);
  col = mix(night, sun, uClear);

  // lightning
  col += uFlash * (0.22 + 0.25 * fog) * vec3(0.92, 0.97, 1.0);

  // vignette
  vec2 q = uvS - 0.5;
  col *= 1.0 - dot(q, q) * 0.9;

  if (uLife > 0.0) col += (h1(frag + fract(t * 7.0) * 113.0) - 0.5) * 0.03;
  o = vec4(col, 1.0);
}`;

export type Glass = {
  frame: (u: { time: number; clear: number; flash: number; zoom: number; par: [number, number]; focus: number; focusY?: number }) => void;
  /** the footer's living scene: where the steam, beacons and road are, in image uv */
  setLife: (l: { steam: [[number, number, number, number], [number, number, number, number]]; beacons: [number, number][]; street: number; tv: [number, number, number, number] }) => void;
  /** emitters only, drawn crisp over the fog */
  setNeon: (c: HTMLCanvasElement) => void;
  /** the overlay canvas: added light on top 2/3, darkening (red) in the bottom-left half-size block */
  setOverlay: (c: HTMLCanvasElement) => void;
  resize: () => void;
  wipeAt: (x: number, y: number, strength?: number) => void;
  /** swap what's behind the glass (same size); `fog: false` keeps the old fog copy, for quick flickers */
  setImage: (src: HTMLImageElement | HTMLCanvasElement, fog?: boolean) => void;
  destroy: () => void;
};

const dims = (src: HTMLImageElement | HTMLCanvasElement) =>
  src instanceof HTMLImageElement ? [src.naturalWidth, src.naturalHeight] : [src.width, src.height];

/** fogDetail > 1 keeps more of the scene readable through the fog; rain < 1 makes drops and fog fainter; life turns on the living scene (the hero uses none of these) */
export function createGlass(canvas: HTMLCanvasElement, img: HTMLImageElement | HTMLCanvasElement, { fogDetail = 1, rain = 1, life = false } = {}): Glass | null {
  const gl = canvas.getContext("webgl2", { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: "high-performance" });
  if (!gl) return null;

  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  };
  const vs = sh(gl.VERTEX_SHADER, VERT);
  const fs = sh(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn(gl.getProgramInfoLog(prog));
    return null;
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "a");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  // the key art, mipmapped so the fog can blur it for free
  const tex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  // the wipe mask: a small 2D canvas the cursor paints into, fog creeps back
  const wipe = document.createElement("canvas");
  wipe.width = 256;
  wipe.height = 160;
  const wctx = wipe.getContext("2d")!;
  wctx.fillStyle = "#000";
  wctx.fillRect(0, 0, wipe.width, wipe.height);
  const wtex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, wtex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  // the fog: a smooth, pre-blurred copy of the art (stepped downsample, then
  // upscaled with high-quality smoothing), so it never looks blocky
  const blur = document.createElement("canvas");
  const fogCopy = (src: HTMLImageElement | HTMLCanvasElement) => {
    const [iw, ih] = dims(src);
    blur.width = 960;
    blur.height = Math.round((960 * ih) / iw);
    const a = document.createElement("canvas");
    a.width = 240;
    a.height = Math.round(blur.height / 4);
    const b = document.createElement("canvas");
    b.width = Math.round(96 * fogDetail);
    b.height = Math.round((blur.height / 10) * fogDetail);
    const actx = a.getContext("2d")!;
    const bctx = b.getContext("2d")!;
    const cctx = blur.getContext("2d")!;
    for (const x of [actx, bctx, cctx]) {
      x.imageSmoothingEnabled = true;
      x.imageSmoothingQuality = "high";
    }
    actx.drawImage(src, 0, 0, a.width, a.height);
    bctx.drawImage(a, 0, 0, b.width, b.height);
    cctx.drawImage(b, 0, 0, blur.width, blur.height);
  };
  fogCopy(img);
  const btex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, btex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, blur);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const U = (n: string) => gl.getUniformLocation(prog, n);
  const u = {
    tex: U("uTex"), wipe: U("uWipe"), blur: U("uBlur"), res: U("uRes"), img: U("uImg"), focus: U("uFocus"), time: U("uTime"),
    clear: U("uClear"), rain: U("uRain"), flash: U("uFlash"), zoom: U("uZoom"), par: U("uPar"),
    focusY: U("uFocusY"), tv: U("uTv"), life: U("uLife"), over: U("uOver"), neon: U("uNeon"), steamA: U("uSteamA"), steamB: U("uSteamB"), beacon: U("uBeacon"), street: U("uStreet"),
  };
  gl.uniform1i(u.tex, 0);
  gl.uniform1i(u.wipe, 1);
  gl.uniform1i(u.blur, 2);
  gl.uniform1f(u.rain, rain);
  gl.uniform1f(u.life, life ? 1 : 0);
  gl.uniform1f(u.focusY, 0.5);
  gl.uniform1f(u.street, 2);
  gl.uniform4f(u.tv, -1, -1, -1, -1);
  // the overlay starts empty (and stays empty for the hero)
  const otex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE3);
  gl.bindTexture(gl.TEXTURE_2D, otex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.uniform1i(u.over, 3);
  const ntex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE4);
  gl.bindTexture(gl.TEXTURE_2D, ntex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.uniform1i(u.neon, 4);
  gl.uniform2f(u.img, ...(dims(img) as [number, number]));

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(u.res, canvas.width, canvas.height);
  };
  resize();

  let lastWipe = 0;
  const wipeAt = (x: number, y: number, strength = 1) => {
    const r = canvas.getBoundingClientRect();
    const px = ((x - r.left) / r.width) * wipe.width;
    const py = ((y - r.top) / r.height) * wipe.height;
    const rad = 20;
    const grd = wctx.createRadialGradient(px, py, 0, px, py, rad);
    grd.addColorStop(0, `rgba(255,255,255,${0.7 * strength})`);
    grd.addColorStop(0.55, `rgba(255,255,255,${0.45 * strength})`);
    grd.addColorStop(1, "rgba(255,255,255,0)");
    wctx.fillStyle = grd;
    wctx.beginPath();
    wctx.arc(px, py, rad, 0, Math.PI * 2);
    wctx.fill();
  };

  const frame: Glass["frame"] = (s) => {
    // fog creeps back
    // slow: a wiped patch stays clear for a few seconds before it fogs over
    if (s.time - lastWipe > 0.05) {
      wctx.fillStyle = "rgba(0,0,0,0.011)";
      wctx.fillRect(0, 0, wipe.width, wipe.height);
      lastWipe = s.time;
    }
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, wtex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, wipe);
    gl.uniform1f(u.time, s.time);
    gl.uniform1f(u.clear, s.clear);
    gl.uniform1f(u.flash, s.flash);
    gl.uniform1f(u.zoom, s.zoom);
    gl.uniform1f(u.focus, s.focus);
    gl.uniform1f(u.focusY, s.focusY ?? 0.5);
    gl.uniform2f(u.par, s.par[0], s.par[1]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const setImage: Glass["setImage"] = (src, fog = true) => {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    gl.generateMipmap(gl.TEXTURE_2D);
    if (fog) {
      fogCopy(src);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, btex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, blur);
    }
    gl.uniform2f(u.img, ...(dims(src) as [number, number]));
  };

  const setLife: Glass["setLife"] = ({ steam, beacons, street, tv }) => {
    gl.uniform4f(u.tv, ...tv);
    gl.uniform4f(u.steamA, ...steam[0]);
    gl.uniform4f(u.steamB, ...steam[1]);
    const bs = [0, 1, 2].flatMap((i) => beacons[i] ?? [-9, -9]);
    gl.uniform2fv(u.beacon, new Float32Array(bs));
    gl.uniform1f(u.street, street);
  };

  const setOverlay: Glass["setOverlay"] = (c) => {
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, otex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
  };

  const setNeon: Glass["setNeon"] = (c) => {
    gl.activeTexture(gl.TEXTURE4);
    gl.bindTexture(gl.TEXTURE_2D, ntex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
  };

  return {
    frame,
    resize,
    wipeAt,
    setImage,
    setLife,
    setOverlay,
    setNeon,
    destroy: () => {
      gl.deleteTexture(tex);
      gl.deleteTexture(otex);
      gl.deleteTexture(ntex);
      gl.deleteTexture(wtex);
      gl.deleteTexture(btex);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    },
  };
}
