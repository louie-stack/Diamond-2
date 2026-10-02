/**
 * Rain on a window, in WebGL2. The key art sits behind fogged glass (a smooth
 * pre-blurred copy); drops refract it sharp, sliding drops leave clear trails, the cursor wipes the fog,
 * lightning flickers, and `clear` (scroll) stops the rain and lifts the fog.
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
uniform float uFlash;
uniform float uZoom;
uniform vec2 uPar;
out vec4 o;

float h1(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
vec3 h3(vec2 p) { float a = h1(p); return vec3(a, h1(p + a), h1(p + a * 3.7)); }

// small static beads that bloom and evaporate
float beads(vec2 uv, float t, float scale) {
  uv *= scale;
  vec2 id = floor(uv);
  vec2 f = fract(uv) - 0.5;
  vec3 n = h3(id);
  vec2 c = (n.xy - 0.5) * 0.7;
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

vec3 field(vec2 uv, float t, float wiped) {
  float rain = (1.0 - uClear) * (1.0 - wiped);
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
  vec2 off = vec2((uRes.x - size.x) * uFocus, (uRes.y - size.y) * 0.5);
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
  float fog = (1.0 - uClear) * (1.0 - clamp(c.y * 0.9 + wipe, 0.0, 1.0));
  float haze = fog * (1.0 - c.x);

  vec2 refr = uv - nrm * vec2(1.0, -1.0) * 0.68 - c.x * vec2(0.0, 0.004);
  vec3 sharp = texture(uTex, refr).rgb;
  vec3 soft = texture(uBlur, uv).rgb;
  vec3 col = mix(sharp, soft, smoothstep(0.0, 1.0, haze));

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

  o = vec4(col, 1.0);
}`;

export type Glass = {
  frame: (u: { time: number; clear: number; flash: number; zoom: number; par: [number, number]; focus: number }) => void;
  resize: () => void;
  wipeAt: (x: number, y: number, strength?: number) => void;
  destroy: () => void;
};

export function createGlass(canvas: HTMLCanvasElement, img: HTMLImageElement): Glass | null {
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
  blur.width = 960;
  blur.height = Math.round((960 * img.naturalHeight) / img.naturalWidth);
  {
    const a = document.createElement("canvas");
    a.width = 240;
    a.height = Math.round(blur.height / 4);
    const b = document.createElement("canvas");
    b.width = 96;
    b.height = Math.round(blur.height / 10);
    const actx = a.getContext("2d")!;
    const bctx = b.getContext("2d")!;
    const cctx = blur.getContext("2d")!;
    for (const x of [actx, bctx, cctx]) {
      x.imageSmoothingEnabled = true;
      x.imageSmoothingQuality = "high";
    }
    actx.drawImage(img, 0, 0, a.width, a.height);
    bctx.drawImage(a, 0, 0, b.width, b.height);
    cctx.drawImage(b, 0, 0, blur.width, blur.height);
  }
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
    clear: U("uClear"), flash: U("uFlash"), zoom: U("uZoom"), par: U("uPar"),
  };
  gl.uniform1i(u.tex, 0);
  gl.uniform1i(u.wipe, 1);
  gl.uniform1i(u.blur, 2);
  gl.uniform2f(u.img, img.naturalWidth, img.naturalHeight);

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
    gl.uniform2f(u.par, s.par[0], s.par[1]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  return {
    frame,
    resize,
    wipeAt,
    destroy: () => {
      gl.deleteTexture(tex);
      gl.deleteTexture(wtex);
      gl.deleteTexture(btex);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    },
  };
}
