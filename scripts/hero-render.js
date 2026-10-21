/**
 * Procedural hero frame-sequence renderer for The Wrap Shack.
 * Narrative: ingredients (parsley, peppercorns, bokeh) drift inward and
 * converge while the kraft-wrapped shawarma rises from below and settles
 * center-frame under living steam. Every parameter is a smooth function of
 * t ∈ [0,1] so the sequence scrubs perfectly in both directions.
 *
 * Usage:
 *   node hero-render.js test        -> renders 6 probe frames to ./hero-test
 *   node hero-render.js full        -> renders 150 lg + 80 sm to ./hero-out
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const W = 1280, H = 720;
const WRAP_SRC =
  "C:/Users/user/Desktop/Coredex/Itsawrapshack website/public/images/shawarma-cutout.webp";

// photographic parsley sprites (cropped + matted from the old footage)
const SPRITES = [1, 2, 3, 4].map((i) => {
  const p = path.join(__dirname, `sprite-sprig${i}.png`);
  const buf = fs.readFileSync(p);
  const dims = { 1: [93, 75], 2: [93, 90], 3: [48, 47], 4: [68, 72] }[i];
  return { uri: `data:image/png;base64,${buf.toString("base64")}`, w: dims[0], h: dims[1] };
});

// ---------- easing ----------
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const smoothstep = (a, b, t) => {
  const x = clamp01((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};
const lerp = (a, b, t) => a + (b - a) * t;

// ---------- deterministic rng ----------
function mulberry32(seed) {
  return function () {
    let z = (seed += 0x6d2b79f5);
    z = Math.imul(z ^ (z >>> 15), z | 1);
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- particle field ----------
// kinds: parsley sprig, peppercorn, cream bokeh dot
function buildParticles() {
  const rng = mulberry32(20260714);
  const parts = [];
  const N = { parsley: 12, pepper: 10, bokeh: 12 };
  const mk = (kind, i, n) => {
    const angle = (i / n) * Math.PI * 2 + rng() * 0.6;
    return {
      kind,
      angle,
      spin: (rng() - 0.5) * 0.9,          // orbital drift over full t
      r0: lerp(420, 660, rng()),          // start radius (frame edges)
      rf: lerp(210, 360, rng()),          // settle radius
      tIn: lerp(0, 0.28, rng()),          // convergence window start
      tSettle: lerp(0.55, 0.8, rng()),
      size: kind === "parsley" ? lerp(34, 78, rng())
          : kind === "pepper" ? lerp(7, 13, rng())
          : lerp(4, 12, rng()),
      sprite: Math.floor(rng() * SPRITES.length),
      flip: rng() < 0.5,
      rot0: rng() * 360,
      rotSpin: (rng() - 0.5) * 160,       // slow tumble
      bobAmp: lerp(4, 10, rng()),
      bobF: lerp(0.7, 1.6, rng()),
      bobP: rng() * Math.PI * 2,
      blur: rng() < 0.35 ? lerp(1.2, 2.6, rng()) : 0, // depth-of-field mix
      op: lerp(0.55, 1, rng()),
    };
  };
  for (let i = 0; i < N.parsley; i++) parts.push(mk("parsley", i, N.parsley));
  for (let i = 0; i < N.pepper; i++) parts.push(mk("pepper", i + 0.5, N.pepper));
  for (let i = 0; i < N.bokeh; i++) parts.push(mk("bokeh", i + 0.25, N.bokeh));
  return parts;
}
const PARTICLES = buildParticles();

// photographic parsley sprite, rotated and optionally mirrored
function parsleyNode(p, rot, opacity) {
  const s = SPRITES[p.sprite];
  const scale = p.size / Math.max(s.w, s.h);
  const flip = p.flip ? -1 : 1;
  return `
  <g transform="rotate(${rot.toFixed(1)}) scale(${(scale * flip).toFixed(3)} ${scale.toFixed(3)})"
     opacity="${opacity.toFixed(3)}" ${p.blur ? `filter="url(#pblur)"` : ""}>
    <image href="${s.uri}" xlink:href="${s.uri}" x="${(-s.w / 2).toFixed(1)}" y="${(-s.h / 2).toFixed(1)}"
      width="${s.w}" height="${s.h}"/>
  </g>`;
}
function pepperSvg(size, opacity, blur, id) {
  return `
  <g opacity="${opacity.toFixed(3)}" ${blur ? `filter="url(#pblur)"` : ""}>
    <circle r="${size}" fill="url(#pep${id})"/>
  </g>`;
}
function bokehSvg(size, opacity) {
  return `<circle r="${size}" fill="#e8ddc4" opacity="${(opacity * 0.24).toFixed(3)}" filter="url(#bblur)"/>`;
}

// ---------- steam ----------
// three sinuous ribbons above the wrap mouth; control points evolve with t
function steamSvg(t, wrapTopY, cx, presence) {
  if (presence <= 0.01) return "";
  const ribbons = [];
  const specs = [
    { x: -44, amp: 34, k: 0.011, speed: 2.2, len: 300, w: 34, ph: 0.4 },
    { x: 16, amp: 44, k: 0.009, speed: 1.6, len: 360, w: 46, ph: 2.4 },
    { x: 70, amp: 26, k: 0.013, speed: 2.8, len: 260, w: 26, ph: 4.2 },
  ];
  for (const s of specs) {
    const pts = [];
    const steps = 14;
    for (let i = 0; i <= steps; i++) {
      // rise from inside the wrap's mouth so the curl stays on-canvas
      const y = wrapTopY + 190 - (i / steps) * s.len;
      const sway =
        Math.sin(y * s.k + s.ph + t * s.speed * Math.PI * 2 * 0.35) *
        s.amp * (0.35 + (i / steps) * 0.9);
      pts.push([cx + s.x + sway, y]);
    }
    const d =
      `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)} ` +
      pts.slice(1).map((p) => `L ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
    ribbons.push(
      `<path d="${d}" fill="none" stroke="#dfe7dc" stroke-linecap="round"
         stroke-width="${s.w}" opacity="${(presence * 0.4).toFixed(3)}"/>`,
    );
  }
  return `<g filter="url(#steam)">${ribbons.join("")}</g>`;
}

// ---------- background (rendered once) ----------
async function makeBg() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <radialGradient id="f" cx="50%" cy="42%" r="80%">
        <stop offset="0%" stop-color="#1e3a2a"/>
        <stop offset="55%" stop-color="#142619"/>
        <stop offset="100%" stop-color="#0b160e"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#f)"/>
  </svg>`;
  const base = await sharp(Buffer.from(svg)).png().toBuffer();
  // film grain baked in, very subtle
  const noise = await sharp({
    create: { width: W, height: H, channels: 3, noise: { type: "gaussian", mean: 128, sigma: 14 } },
  }).png().toBuffer();
  return sharp(base)
    .composite([{ input: noise, blend: "overlay", opacity: 0.05 }])
    .png().toBuffer();
}

// drifting haze sheet: big blurred noise, tinted sage-cream, alpha-masked
async function makeHaze(seed) {
  const HW = 1700, HH = 1000;
  const n = await sharp({
    create: { width: 212, height: 125, channels: 3, noise: { type: "gaussian", mean: 118 + seed * 8, sigma: 55 } },
  }).resize(HW, HH, { kernel: "cubic" }).blur(38).greyscale().png().toBuffer();
  // brighten mids -> alpha; keep only the airy top range
  const alpha = await sharp(n).linear(1.5, -110).blur(6).png().toBuffer();
  const tint = await sharp({
    create: { width: HW, height: HH, channels: 3, background: { r: 214, g: 224, b: 206 } },
  }).png().toBuffer();
  return sharp(tint).joinChannel(alpha).png().toBuffer();
}

// ---------- per-frame ----------
function particleLayer(t) {
  const CX = W / 2, CY = H * 0.47;
  let defs = `
    <filter id="pblur"><feGaussianBlur stdDeviation="1.8"/></filter>
    <filter id="bblur"><feGaussianBlur stdDeviation="3"/></filter>`;
  let peppers = "";
  PARTICLES.forEach((p, i) => {
    if (p.kind === "pepper")
      defs += `<radialGradient id="pep${i}" cx="35%" cy="30%" r="80%">
        <stop offset="0%" stop-color="#5a4433"/><stop offset="55%" stop-color="#33241a"/>
        <stop offset="100%" stop-color="#1e130c"/></radialGradient>`;
  });
  let body = "";
  PARTICLES.forEach((p, i) => {
    const conv = smoothstep(p.tIn, p.tSettle, t);
    const r = lerp(p.r0, p.rf, conv);
    const ang = p.angle + p.spin * t;
    const bob = Math.sin(t * Math.PI * 2 * p.bobF + p.bobP) * p.bobAmp;
    const x = CX + Math.cos(ang) * r * 1.18; // slightly elliptical field
    const y = CY + Math.sin(ang) * r * 0.72 + bob;
    if (x < -80 || x > W + 80 || y < -80 || y > H + 80) return;
    const appear = p.tIn < 0.06 ? 1 : smoothstep(p.tIn, p.tIn + 0.1, t);
    const op = p.op * appear;
    if (op <= 0.01) return;
    const rot = p.rot0 + p.rotSpin * t;
    let inner = "";
    if (p.kind === "parsley") inner = parsleyNode(p, rot, op);
    else if (p.kind === "pepper") inner = pepperSvg(p.size, op, p.blur, i);
    else inner = bokehSvg(p.size, op);
    body += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">${inner}</g>`;
  });
  return { defs, body };
}

function overlaySvg(t, wrapTopY) {
  const { defs, body } = particleLayer(t);
  const steamPresence = smoothstep(0.5, 0.78, t);
  const steam = steamSvg(t, wrapTopY, W / 2, steamPresence);
  // warm key light breathing up gently
  const warm = lerp(0.05, 0.1, smoothstep(0.3, 0.9, t));
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}">
    <defs>
      ${defs}
      <filter id="steam" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="9"/>
      </filter>
      <radialGradient id="warm" cx="34%" cy="20%" r="70%">
        <stop offset="0%" stop-color="#c4a16b" stop-opacity="${warm.toFixed(3)}"/>
        <stop offset="100%" stop-color="#c4a16b" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="vin" cx="50%" cy="45%" r="75%">
        <stop offset="0%" stop-color="#0a160e" stop-opacity="0"/>
        <stop offset="68%" stop-color="#0a160e" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="#0a160e" stop-opacity="0.46"/>
      </radialGradient>
    </defs>
    ${body}
    ${steam}
    <rect width="${W}" height="${H}" fill="url(#warm)"/>
    <rect width="${W}" height="${H}" fill="url(#vin)"/>
  </svg>`;
}

// ---------- main ----------
async function main() {
  const mode = process.argv[2] || "test";
  const outDir = path.join(__dirname, mode === "test" ? "hero-test" : "hero-out");
  fs.mkdirSync(outDir, { recursive: true });
  if (mode === "full") {
    fs.mkdirSync(path.join(outDir, "lg"), { recursive: true });
    fs.mkdirSync(path.join(outDir, "sm"), { recursive: true });
  }

  const bg = await makeBg();
  const hazeA = await makeHaze(1);
  const hazeB = await makeHaze(2);

  // wrap sized once: final on-canvas height 560px
  const WRAP_H = 530;
  const wrapMeta = await sharp(WRAP_SRC).metadata();
  const WRAP_W = Math.round((wrapMeta.width / wrapMeta.height) * WRAP_H);
  const wrapBase = await sharp(WRAP_SRC).resize(WRAP_W, WRAP_H).png().toBuffer();

  async function renderFrame(t) {
    // wrap motion: rises from below, settles center, then micro-drift
    const rise = smoothstep(0.08, 0.62, t);
    const settleY = H * 0.47 - WRAP_H / 2; // final top
    const y0 = H + 40;                     // fully below frame
    const microsink = Math.sin(t * Math.PI * 2 * 0.5) * 4 * smoothstep(0.62, 0.8, t);
    const wy = lerp(y0, settleY, rise) + microsink;
    const wscale = lerp(1.07, 1.0, smoothstep(0.08, 0.7, t));
    const wblurS = lerp(9, 0, smoothstep(0.08, 0.5, t));
    const wopacity = smoothstep(0.08, 0.28, t);

    const layers = [];
    // haze sheets are bigger than the canvas — extract a drifting window
    const hazeWin = async (sheet, x, y) =>
      sharp(sheet)
        .extract({ left: Math.round(x), top: Math.round(y), width: W, height: H })
        .png().toBuffer();

    // back sheet — slow diagonal drift
    layers.push({
      input: await hazeWin(hazeB, lerp(320, 80, t), lerp(160, 280, t)),
      left: 0, top: 0, blend: "screen", opacity: 0.2,
    });

    if (wopacity > 0.01 && wy < H - 2) {
      const sw = Math.round(WRAP_W * wscale);
      const shHeight = Math.round(WRAP_H * wscale);
      let wr = sharp(wrapBase).resize(sw, shHeight);
      if (wblurS > 0.3) wr = wr.blur(wblurS);
      let wbuf = await wr.png().toBuffer();
      if (wopacity < 0.995) {
        wbuf = await sharp(wbuf)
          .composite([{
            input: Buffer.from([0, 0, 0, Math.round(255 * (1 - wopacity))]),
            raw: { width: 1, height: 1, channels: 4 },
            tile: true,
            blend: "dest-out",
          }])
          .png().toBuffer();
      }
      // crop whatever hangs below the canvas while the wrap is still rising
      const topPx = Math.round(wy);
      const visibleH = Math.min(shHeight, H - topPx);
      if (visibleH < shHeight) {
        wbuf = await sharp(wbuf)
          .extract({ left: 0, top: 0, width: sw, height: visibleH })
          .png().toBuffer();
      }
      layers.push({
        input: wbuf,
        left: Math.round(W / 2 - sw / 2),
        top: topPx,
      });
    }

    // front sheet — opposite drift, screens over the lower field
    layers.push({
      input: await hazeWin(hazeA, lerp(60, 300, t), lerp(40, 160, t)),
      left: 0, top: 0, blend: "screen", opacity: 0.12,
    });

    const wrapTopForSteam = wy;
    layers.push({
      input: Buffer.from(overlaySvg(t, wrapTopForSteam)),
      left: 0,
      top: 0,
    });

    return sharp(bg).composite(layers);
  }

  if (mode === "test") {
    for (const t of [0, 0.15, 0.35, 0.55, 0.75, 1]) {
      const img = await renderFrame(t);
      await img.webp({ quality: 82 }).toFile(path.join(outDir, `t${String(t).replace(".", "_")}.webp`));
      console.log("test frame t =", t);
    }
    return;
  }

  // full render
  const LG_N = 150;
  for (let i = 0; i < LG_N; i++) {
    const t = i / (LG_N - 1);
    const img = await renderFrame(t);
    const name = `f_${String(i + 1).padStart(3, "0")}.webp`;
    await img.webp({ quality: 70 }).toFile(path.join(outDir, "lg", name));
    if (i % 25 === 0) console.log("lg", i);
  }
  // poster from frame 1 at higher quality
  await (await renderFrame(0)).webp({ quality: 82 }).toFile(path.join(outDir, "hero-poster.webp"));
  // sm set: 80 frames, same t-space, rendered small
  const SM_N = 80;
  for (let i = 0; i < SM_N; i++) {
    const t = i / (SM_N - 1);
    const img = await renderFrame(t);
    const buf = await img.png().toBuffer();
    const name = `f_${String(i + 1).padStart(3, "0")}.webp`;
    await sharp(buf).resize(768, 432).webp({ quality: 66 }).toFile(path.join(outDir, "sm", name));
    if (i % 20 === 0) console.log("sm", i);
  }
  console.log("full render done");
}

main().catch((e) => { console.error(e); process.exit(1); });
